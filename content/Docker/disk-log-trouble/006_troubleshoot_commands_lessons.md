---
title: Phase 6 — 참고 자료 (명령어 / 함정 / 교훈)
type: project
tags: [project, docker, reference, cheatsheet, pitfalls, lessons]
draft: false
---

> 이번 사건에서 자주 쓴 명령어, 부딪힌 함정, 일반화된 교훈 정리.

---

## 6-1. 자주 쓴 명령어 모음

### 디스크 사용량 추적

```bash
df -h                                                              # 마운트별 사용량
sudo du -h --max-depth=1 <path> 2>/dev/null | sort -hr | head -20  # 한 단계씩 내려가기
sudo ncdu /                                                        # 대화형 (yum/apt install ncdu)

# df와 du가 안 맞을 때 (삭제됐는데 핸들 잡힌 파일)
sudo lsof +L1 | awk '$5=="REG" {print}' | sort -k7 -n | tail -20
```

### Docker 사용량 진단

```bash
docker system df                                              # 요약
docker system df --format "{{.Type}}\t{{.Size}}\t{{.Reclaimable}}"
docker system df -v                                           # 상세 (이미지/컨테이너/볼륨별)
docker info | grep -E "Root Dir|Storage Driver"               # data-root 위치 확인

# 이미지/컨테이너 크기 순 정렬
docker images --format "{{.Size}}\t{{.Repository}}:{{.Tag}}" | sort -hr
docker ps -as --format "{{.Size}}\t{{.Names}}" | sort -hr
```

### Docker 정리

```bash
docker system prune                # 중지 컨테이너 + dangling 이미지 + 미사용 네트워크 + 빌드캐시
docker system prune -a             # + 미사용 이미지
docker system prune -a --volumes   # + 볼륨 (DB 데이터 주의)
docker volume prune                # dangling 볼륨만 (attach된 것 보호)
docker builder prune -a            # 빌드 캐시만
```

### 컨테이너 로그

```bash
docker logs --tail 50 <name>                # 최근 로그
docker logs -f <name>                       # follow
docker logs <name> 2>&1 | grep -i error     # 에러만 추출

# 호스트에서 직접 로그 파일 비우기 (컨테이너 재시작 불필요)
sudo sh -c 'truncate -s 0 /var/lib/docker/containers/*/*-json.log'
# (custom data-root면 경로 변경)
```

### 컨테이너 안 파일 확인 (컨테이너 실행 없이도)

```bash
# 임시 컨테이너 생성 후 cp (시작 안 함)
CID=$(docker create <image>)
docker cp "$CID:/path/in/container" /tmp/local
docker rm "$CID"

# 또는 entrypoint 우회해서 한 줄 실행
docker run --rm --entrypoint cat <image> /path/in/container
docker run --rm --entrypoint sh <image> -c 'ls -la /app/.nuxt'
```

### 시간 표시

```bash
ls -la --time-style=long-iso     # YYYY-MM-DD HH:MM
ls -la --time-style=full-iso     # YYYY-MM-DD HH:MM:SS.nano +TZ
ls -la --time-style=iso          # MM-DD HH:MM
ls -la --time=atime              # access time 표시
ls -la --time=ctime              # change time (메타데이터)

stat <file>                      # Access / Modify / Change 모두
```

---

## 6-2. 트러블슈팅 중 부딪힌 함정들

### 함정 1: `sudo du -h /path/*` 가 결과 없이 끝남

**원인**: 쉘 glob은 **sudo 실행 전에** 호출 사용자 권한으로 펼쳐짐. 사용자가 디렉토리를 못 읽으면 `*`이 빈 문자열로 펼쳐져 명령에 인자가 안 들어감. `2>/dev/null`이 붙으면 에러도 안 보임.

**해결**:
```bash
# 방법 1: sh -c 안에서 glob 펼치기
sudo sh -c "du -h /path/* | sort -hr"

# 방법 2: find 사용 (더 안전)
sudo find /path -maxdepth 1 -exec du -sh {} +
```

### 함정 2: `docker info` Root Dir와 `daemon.json` data-root 경로가 다름

**원인**: 심볼릭 링크. 예) `daemon.json`은 `/app/docker/overlay`, `docker info`는 `/home/group/docker/overlay` → `/app/docker`가 `/home/group/docker`로의 symlink.

**해결**:
```bash
ls -la /app/docker
readlink -f /app/docker/overlay
```

### 함정 3: `docker system df`의 숫자와 디스크 실측치가 안 맞음

**카운트되는 것**:
- 이미지 레이어
- 컨테이너 쓰기 레이어 (overlay2의 일부)
- named volume
- 빌드 캐시

**카운트 안 되는 것**:
- 컨테이너 로그 파일 (`containers/*/*-json.log`) — **이번 사건의 범인**
- bind mount된 호스트 경로 데이터
- 메타데이터, 임시 파일

→ 진짜 사용량은 항상 `du`로 측정.

### 함정 4: `ls -l`의 시간 표시가 들쭉날쭉

**원인**: 기본 동작은 파일이 6개월 이상 오래되면 **연도** 표시, 최근이면 **HH:MM** 표시. 한 디렉토리 안에서도 섞임.

**해결**: `--time-style=long-iso` 또는 `--time-style=full-iso`.

### 함정 5: `mtime`이 바뀌었다고 무조건 수정이 일어난 건 아님

- `vim :w`로 저장만 해도 내용 동일하게 mtime 갱신
- `cat`/`less`로 보면 `atime`만 갱신, `mtime`은 그대로

**진짜 내용 변경 여부**: git diff, 백업 비교, 또는 파일 해시 비교.

### 함정 6: `package.json`의 스크립트 이름이 진실이 아님

```json
"production": "cross-env NODE_ENV=production HOST=0.0.0.0 nuxt"
```

→ 이름은 `production`이지만 `nuxt`를 인자 없이 단독 실행하면 **`nuxt dev`와 동일**한 dev 서버가 뜸. NODE_ENV 환경변수만으로는 부족.

스크립트 이름 말고 **실제 실행 명령**을 봐야 함.

### 함정 7: `yarn build && yarn start`도 `--watch`가 끼어 있으면 무한 루프

```json
"build": "... nuxt --watch build"
"all":   "yarn build && yarn start"
```

`nuxt build --watch`는 빌드 후 파일 감시하며 영영 안 끝남 → `&&` 뒤의 `yarn start`로 영영 못 감.

### 함정 8: `docker ps -all`은 잘못된 옵션

`-all`은 `-a -l -l`로 해석됨 (`-l` 두 번). 정답은 `docker ps -a`.

### 함정 9: daemon.json 수정 후 데몬 재시작으로는 기존 컨테이너에 미적용

`/etc/docker/daemon.json`을 바꾸고 `systemctl restart docker`를 해도, 이미 실행 중인 컨테이너는 **생성 시점의 정책을 그대로 사용**한다. 새 정책 적용에는 컨테이너 **재생성**(`docker compose down && up -d` 또는 `docker rm/run`)이 필요. `restart`만으로는 안 됨.

---

## 6-3. 이번 사건의 교훈 (일반화)

### 1. 운영 서버에 dev 모드 / watch 빌드 띄우지 말 것

- `package.json`의 스크립트 이름이 항상 진실은 아님
- 실제 실행 명령에서 `nuxt` 단독 호출, `--watch` 플래그 등을 확인
- "production"이라는 이름에 속지 말고 실제 동작 확인

### 2. Docker 로그 로테이션은 기본 세팅

- `/etc/docker/daemon.json`에 `log-opts` 설정 권장
- 한 컨테이너의 미친 로그가 디스크 전체를 죽일 수 있음
- 데몬 차원과 compose 차원 양쪽에 두면 fallback 가능

### 3. `docker system df`만 믿지 말 것

- 로그 파일은 카운트 안 됨
- 의심되면 항상 `du`로 직접 측정
- data-root 위치도 `docker info`로 정확히 확인

### 4. Custom data-root + symlink는 추적을 어렵게 함

- 설정 변경 시 반드시 문서화
- `df` → `du`로 추적할 때 symlink 따라가야 진짜 위치 파악
- `readlink -f`로 실제 경로 확인 습관

### 5. inotify 한도는 Node.js/Nuxt/Webpack에서 기본값으로 부족

- `fs.inotify.max_user_watches`를 524288로 사전에 늘려두는 게 안전
- 이걸 안 늘려두면 dev 서버나 watch 빌드가 즉시 에러 폭주

### 6. bind mount된 파일은 호스트 측 수정만으로 적용

- 이미지 재빌드 불필요
- 응급 패치 시 큰 장점
- 단, 어떤 파일이 mount돼 있는지 `docker inspect` 또는 `compose` 확인 필수

### 7. 진단 → 회수 → 영구 차단 → 검증 순서

```
1. 어디가 큰가? (du)
2. Docker가 차지하는가? (docker system df + du)
3. 컨테이너 중 누가? (find + ID 매핑)
4. 왜? (docker logs)
5. 즉시 회수 (truncate, prune)
6. 영구 차단 (config 수정 + 컨테이너 재생성)
7. 검증 (1분 후 / 1시간 후 / 24시간 후 재측정)
```

각 단계를 건너뛰면 같은 문제가 반복됨. 특히 5→6 사이에서 멈추면 며칠 안에 재발.
