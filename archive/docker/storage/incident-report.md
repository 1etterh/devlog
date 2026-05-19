---
title: 운영 컨테이너 로그 폭주로 인한 디스크 풀 장애 포스트모템
type: archive
tags: [archive, docker, container_logs, inotify, nuxt, disk_full, log_rotation, json_log, postmortem]
draft: true
---

> 운영 서버 디스크가 거의 100% 차서 추적해보니, 단일 컨테이너의 로그 파일 한 개가 1.7TB를 차지하고 있던 사건. 진단부터 근본 원인, 해결까지의 흐름 기록.

---

## 1. 요약

### 1-1. 무슨 일이 일어났는가

운영 서버 `sv`의 `/home` 파티션 2.4TB가 거의 100% 사용된 상태가 확인됨. 추적 결과 단일 컨테이너의 **로그 파일만 1.7TB**를 차지하고 있었고, 두 번째 컨테이너가 추가로 **252GB**를 점유. 합쳐서 약 2TB가 일부 컨테이너의 로그 폭주로 발생.

### 1-2. 무엇이 원인이었는가

운영 중인 Nuxt 기반 컨테이너(`container-a`, `container-b`)가 **dev 모드 또는 watch 빌드 모드로 실행 중**이었음. OS의 파일 감시 한도(`inotify`)를 초과하면서 `ENOSPC` 에러가 초당 수천 줄 발생, Docker가 이를 `*-json.log`에 누적 저장한 결과.

원인은 단순 운영 미스가 아니라 **`package.json`과 `docker-compose.yml` 양쪽에 미묘한 함정**이 겹친 결과로, "production"이라는 이름의 스크립트가 사실 dev 서버를 띄우는 명령이었고, "yarn all" 명령도 `--watch` 플래그 때문에 prod 서버로 진입하지 못함.

### 1-3. 회수 가능량

| 우선순위 | 액션 | 회수량/효과 | 다운타임 |
|---|---|---|---|
| 즉시 | 로그 파일 truncate | ~2TB 회수 | 없음 |
| 즉시 | dangling volume 정리 | ~125GB 회수 | 없음 |
| 즉시 | inotify 한도 증가 | 재발 방지 1차 | 없음 |
| 24시간 내 | package.json 또는 compose.yml 수정 | 근본 차단 | 컨테이너 재시작 |
| 이번 주 내 | Docker 데몬 로그 로테이션 설정 | 안전장치 | 전체 컨테이너 재시작 |

---

## 2. 상세 진단 결과

### 2-1. 디스크 점유 분포

```
2.4T  /home                                              (전체)
  2.4T  /home/group                                      (단일 사용자/그룹 디렉토리)
    2.2T  /home/group/docker                             (Docker data-root, 커스텀 경로)
      2.0T  ~/docker/overlay/containers                  (컨테이너 로그)
      145G  ~/docker/overlay/volumes                     (named volumes, dangling 다수)
       92G  ~/docker/overlay/overlay2                    (이미지 + 컨테이너 쓰기 레이어)
```

### 2-2. 로그 파일 점유 상위 5개

| 크기 | 컨테이너 | 역할 |
|---|---|---|
| **1.7TB** | `container-a` | Nuxt 프론트엔드 (관리자) |
| **252GB** | `container-b` | Nuxt 기반 API |
| 79GB | `container-c` | API 서버 |
| 13GB | `container-d` | API 서버 |
| 6.3GB | `container-e` | Agent |

→ 상위 2개로 **약 2TB**. 나머지는 합쳐 100GB 수준으로 정상 범위.

### 2-3. Docker 자체 진단과 디렉토리 실측의 차이

```
docker system df 보고치:    169GB
디렉토리 실측치:           2,200GB
차이:                     2,031GB   ← 컨테이너 로그 파일(*-json.log)
```

**중요**: `docker system df`는 컨테이너 로그를 카운트하지 않음. 운영 모니터링 지표로 `docker system df`만 보고 있었다면 이 사건을 사전에 탐지 불가능했음.

### 2-4. Docker 환경 정보

- Storage Driver: `overlay2` (개념 정리: [[011_docker_overlay2_storage]])
- Docker Root Dir: `/home/group/docker/overlay` (`daemon.json`엔 `/app/docker/overlay`로 적혀있음 → 심볼릭 링크)
- 실행 컨테이너 수: 50+ 개
- 이미지 수: 39개 (총 33GB)
- 사설 registry: `registry.example.com:15000`
- Dangling volume: 200개 가까이, 합산 ~125GB

---

## 3. 근본 원인 분석

### 3-1. 직접 원인 — ENOSPC 에러 폭주

`container-a` 로그 마지막 부분 (반복 수십만 줄):

```
ERROR  Watchpack Error (watcher): Error: ENOSPC: System limit for number
       of file watchers reached, watch '/app/node_modules/vue-client-only/dist'
ERROR  Watchpack Error (watcher): Error: ENOSPC: System limit for number
       of file watchers reached, watch '/app/node_modules/highcharts-vue'
ERROR  Watchpack Error (watcher): Error: ENOSPC: System limit for number
       of file watchers reached, watch '/app/node_modules/readable-stream/lib/internal'
...
```

Nuxt가 webpack을 통해 `node_modules` 안 수천 개 파일에 file watcher를 걸려고 시도. 그러나 OS의 `fs.inotify.max_user_watches` 한도(기본값 8192)를 초과해 watch 생성 실패. 이 에러가 stdout으로 폭주, Docker가 `*-json.log`에 영구 저장.

### 3-2. 함정 1: package.json의 잘못된 스크립트 이름

```json
{
  "scripts": {
    "dev":        "cross-env NODE_ENV=development HOST=0.0.0.0 nuxt",
    "production": "cross-env NODE_ENV=production  HOST=0.0.0.0 nuxt",
    "build":      "cross-env NODE_ENV=production  HOST=0.0.0.0 nuxt --watch build",
    "start":      "cross-env NODE_ENV=production  HOST=0.0.0.0 nuxt start",
    "all":        "yarn build && yarn start"
  }
}
```

| 스크립트 | 실제 동작 | 운영용? |
|---|---|---|
| `dev` | nuxt (dev 서버) | X |
| **`production`** | **nuxt (이름만 production, 사실은 dev 서버)** | **X (함정)** |
| **`build`** | **nuxt --watch build (파일 변경 감시하며 빌드)** | **X (함정)** |
| `start` | nuxt start (진짜 prod 서버) | O |
| `all` | yarn build && yarn start | △ (함정 2 참조) |

**핵심**: `nuxt`를 인자 없이 단독 실행하면 `nuxt dev`와 동일. `NODE_ENV=production` 환경변수만으로는 dev 모드를 막을 수 없음.

### 3-3. 함정 2: yarn all도 결국 같음

`yarn all` = `yarn build && yarn start`. 그런데 `build`가 `nuxt --watch build`이므로 **빌드 후에도 watcher가 살아 있어 명령이 영원히 종료되지 않음**. 결과적으로 `&&` 뒤의 `yarn start`는 실행되지 않고, 빌드 모드 watcher가 계속 inotify를 점유.

### 3-4. 함정 3: 로그 로테이션 미설정

장애 발생 시점까지 `/etc/docker/daemon.json`에 로그 로테이션 설정 없었음. 컨테이너의 `*-json.log`는 무제한 누적되어 1.7TB까지 도달.

### 3-5. 원인 흐름도

```
누군가 compose의 command를 yarn all로 설정
       ↓
yarn build = "nuxt --watch build" 실행
       ↓
빌드 후에도 watcher 살아있음 (--watch 때문)
       ↓
node_modules 수천 개 파일 watch 시도
       ↓
fs.inotify.max_user_watches 한도 초과 (기본 8192)
       ↓
파일마다 ENOSPC 에러 출력 (초당 수천 줄)
       ↓
stdout → docker가 *-json.log에 저장
       ↓
로그 로테이션 미설정 → 1.7TB 누적
```

---

## 4. 조치 사항

### 4-1. 즉시 회수 (Docker 운영 중 안전, 다운타임 없음)

#### A. 컨테이너 로그 truncate — 약 2TB 즉시 회수

```bash
sudo sh -c 'truncate -s 0 /home/group/docker/overlay/containers/*/*-json.log'
df -h /home
```

`truncate -s 0`은 inode를 유지한 채 내용만 비움 → 컨테이너·데몬 모두 재시작 불필요.

#### B. Dangling volume 정리 — 약 125GB 추가 회수

```bash
# 사용 중인 named volume 확인 (특히 DB가 진짜 안 쓰이는지)
docker inspect container-db --format '{{json .Mounts}}'

# bind mount면 해당 named volume은 안전하게 제거 대상
docker volume prune
```

`docker volume prune`은 컨테이너에 attach된 볼륨은 절대 건드리지 않음 (LINKS≥1 보호).

#### C. inotify 한도 증가 — 재발 방지 1차

```bash
# 임시 (재부팅 시 사라짐)
sudo sysctl fs.inotify.max_user_watches=524288
sudo sysctl fs.inotify.max_user_instances=512

# 영구
sudo sh -c 'echo "fs.inotify.max_user_watches=524288" >> /etc/sysctl.conf'
sudo sh -c 'echo "fs.inotify.max_user_instances=512" >> /etc/sysctl.conf'
sudo sysctl -p
```

### 4-2. 근본 차단 — 2가지 옵션

호스트의 `~/docker/app-1/source/*`가 컨테이너 `/app/*`로 bind mount되어 있으므로, **이미지 재빌드 없이 호스트 파일 수정만으로 적용** 가능.

#### 옵션 A: package.json 수정 (보수적·권장)

```bash
cp ~/docker/app-1/source/package.json ~/docker/app-1/source/package.json.bak
vi ~/docker/app-1/source/package.json
```

scripts 안에서:
```json
"build": "... nuxt --watch build"   →   "build": "... nuxt build"
```

`--watch` 제거. 이러면 `yarn all`이 정상적으로 빌드 종료 → `yarn start`(진짜 prod 서버) 진입.

- 장점: 매 시작 시 최신 빌드 적용
- 단점: 컨테이너 시작 시 빌드 시간 소요 (수십초~수분)

#### 옵션 B: compose command를 yarn start로 변경

이미지에 빌드 결과(`.nuxt/dist/`)가 이미 있다면 빌드 단계 스킵.

```bash
# 사전 확인
docker run --rm --entrypoint sh registry.example.com:15000/container-a:3.0.00 -c \
  'ls -la /app/.nuxt/dist/server/index.js 2>/dev/null && echo OK || echo NO'
```

OK면 compose 수정:
```yaml
command: "yarn start"
```

- 장점: 컨테이너 시작 즉시 서빙
- 단점: 이미지에 빌드 결과 없으면 즉시 실패. 코드 수정 시 이미지 재빌드 필요.

### 4-3. 안전장치 — Docker 데몬 차원 로그 로테이션

`/etc/docker/daemon.json`에 추가:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  }
}
```

→ 컨테이너당 로그 최대 150MB. 개별 compose의 `logging:` 설정이 우선이며, 누락된 컨테이너는 이 값으로 fallback.

**중요**: 데몬 재시작 후 **기존 컨테이너에 새 정책이 즉시 적용 안 됨**. 컨테이너를 `docker compose down && up -d` 또는 `docker rm/run`으로 **재생성**해야 적용.

### 4-4. 개별 compose에도 logging 일괄 추가

데몬 fallback과 별개로, 각 서비스 compose에도 명시적으로 `logging:` 블록 추가 권장:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "50m"
    max-file: "3"
```

#### 점검 명령 A — logging 누락된 compose 파일 찾기

```bash
sudo find /app /home -name "docker-compose*.y*ml" -not -path "*/node_modules/*" 2>/dev/null | \
  while read f; do
    if ! grep -q "logging:" "$f"; then
      echo "[누락] $f"
    fi
  done
```

#### 점검 명령 B — 실행 중 컨테이너의 실제 적용 정책 확인

```bash
docker ps -a --format '{{.Names}}' | while read name; do
  cfg=$(docker inspect "$name" --format '{{json .HostConfig.LogConfig}}' 2>/dev/null)
  case "$cfg" in
    *'"max-size"'*) status="OK   " ;;
    *)              status="누락 " ;;
  esac
  printf "%s %-40s %s\n" "$status" "$name" "$cfg"
done
```

출력 예:
```
OK    container-a             {"Type":"json-file","Config":{"max-file":"3","max-size":"50m"}}
누락  legacy-worker           {"Type":"json-file","Config":{}}
```

→ `누락` 컨테이너는 재생성해야 새 정책이 적용됨.

#### 점검 명령 C — 자동화 (선택)

위 두 점검을 cron으로 주기 실행하면 신규 서비스 배포 시 누락을 사전 탐지 가능:

```bash
# 예: /etc/cron.weekly/check-docker-logging.sh
#!/bin/bash
MISSING=$(sudo find /app /home -name "docker-compose*.y*ml" -not -path "*/node_modules/*" 2>/dev/null | \
  xargs -I {} sh -c 'grep -L "logging:" "{}"')
if [ -n "$MISSING" ]; then
  echo "logging 설정 누락 compose 파일 발견:" | mail -s "[sv] Docker logging 점검 알림" infra@example.com
  echo "$MISSING" | mail ...
fi
```

---

## 5. 재발 방지 대책

### 5-1. 운영 환경 표준화

- 모든 운영 컨테이너의 `docker-compose.yml`에 `logging` 설정 기본 포함
- `/etc/docker/daemon.json`에 데몬 차원 로그 로테이션 fallback 설정
- `fs.inotify.max_user_watches=524288` 영구 적용을 모든 서버 표준에 포함

### 5-2. 코드 리뷰 체크리스트

운영 서비스의 `package.json` 및 `Dockerfile` 리뷰 시:

- `dev`, `start`, `production` 등 스크립트 이름이 **실제 동작과 일치하는가**
- `nuxt` (인자 없음)을 운영 entrypoint로 쓰지 않는가
- `--watch` 플래그가 운영 경로에 포함되지 않는가
- `yarn build && yarn start` 같은 체인이 `&&` 의미상 정상 종료되는가

### 5-3. 모니터링 보강

현재 `docker system df` 기반 모니터링은 컨테이너 로그를 카운트하지 못함. 다음 항목 추가:

- Docker data-root의 `du -sh` 정기 수집 (예: cron으로 1시간마다)
- 개별 컨테이너의 `*-json.log` 크기 알람 (예: 1GB 초과 시 알림)
- inotify 사용량 모니터링 (`/proc/sys/fs/inotify/max_user_watches` 대비 현재 사용)

---

## 6. 검증 방법

### 6-1. 즉시 회수 검증

```bash
# 로그 truncate 후
df -h /home
# → 사용량 2.4T → 약 300GB 수준으로 떨어져야 함

# volume prune 후
docker system df
# → Local Volumes Reclaimable이 거의 0이어야 함
```

### 6-2. 근본 차단 검증

수정 적용 후 컨테이너 재기동, 1분 후:

```bash
docker logs --tail 200 container-a | grep -iE "ENOSPC|Watchpack|listening|ready"
```

- 성공: `Nuxt server listening on http://...` 출력, ENOSPC 없음
- 실패: ENOSPC 또는 Watchpack Error 계속 출력 → 수정이 적용되지 않은 것

### 6-3. 장기 검증 (24시간 후)

```bash
sudo du -sh /home/group/docker/overlay/containers/*/
# → 어느 컨테이너도 1GB 이상 증가하지 않아야 함
```

---

## 7. 교훈

### 7-1. 이름은 진실이 아니다

`production`이라는 스크립트가 dev 서버를 띄우고, `yarn all`이라는 종합 명령이 무한 루프에 빠지는 함정은 코드 한 줄 한 줄 직접 읽지 않으면 발견하기 어렵다. 스크립트 이름과 실제 동작을 항상 검증할 것.

### 7-2. docker system df는 절반의 진실만 보여준다

컨테이너 로그라는 가장 흔한 디스크 점유 요인이 표준 진단 도구에서 빠져 있다. 운영 가시성 보강 시 `du`로 직접 측정하는 항목을 반드시 포함.

### 7-3. 데몬 설정 변경은 기존 컨테이너에 즉시 적용되지 않는다

`/etc/docker/daemon.json`을 바꾸고 `systemctl restart docker`를 해도, 이미 실행 중인 컨테이너는 생성 시점의 정책을 그대로 사용한다. 새 정책 적용에는 컨테이너 **재생성**(`down && up -d`)이 필요. 이 부분을 빠뜨리면 설정 변경이 무의미해질 수 있음.

### 7-4. 진단·회수·차단·검증을 분리

```
1. 어디가 큰가? (du)
2. Docker가 차지하는가? (docker system df + du)
3. 컨테이너 중 누가? (find + ID 매핑)
4. 왜? (docker logs)
5. 즉시 회수 (truncate, prune)
6. 영구 차단 (config 수정 + 컨테이너 재생성)
7. 검증 (1분 후 / 1시간 후 / 24시간 후 재측정)
```

각 단계를 건너뛰면 같은 문제가 반복된다. 특히 5→6 사이에서 멈추면 며칠 안에 재발.

### 7-5. inotify 한도는 Node.js 환경의 기본 부족분

Vue/Nuxt/Webpack/Vite 같은 환경은 기본 `fs.inotify.max_user_watches`(보통 8192) 한도에 즉시 부딪힌다. dev 환경에서도 운영 환경에서도 524288 정도로 미리 올려두는 게 표준. 안 올려두면 dev 서버나 watch 빌드가 즉시 에러 폭주를 일으킴.

### 7-6. Custom data-root와 심볼릭 링크는 진단을 어렵게 한다

`daemon.json`엔 `/app/docker/overlay`로 적혀 있고, 실제 데이터는 `/home/group/docker/overlay`에 있는 식의 심볼릭 링크 구조는 처음 진단할 때 큰 혼란을 줌. data-root 위치 변경 시 인프라 문서에 명시하고, 진단 시 `docker info`의 `Docker Root Dir`와 `daemon.json`의 `data-root`를 둘 다 확인 + `readlink -f`로 실제 경로 파악 습관 필요.
