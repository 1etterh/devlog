---
title: Phase 5 — 해결 액션 (즉시 회수 + 영구 차단)
type: project
tags: [project, docker, truncate, volume_prune, inotify, log_rotation, daemon_json]
draft: false
---

> 즉시 회수 → 영구 차단 순서. 2가지 영구 해결 옵션(A: package.json 수정 / B: compose command 변경) 비교.

---

## 5-1. 즉시 회수 (지금 바로 — 안전)

### A. 컨테이너 로그 truncate (~2TB 회수)

```bash
sudo sh -c 'truncate -s 0 /home/group/docker/overlay/containers/*/*-json.log'
df -h /home
```

- `truncate -s 0`은 inode를 유지한 채 내용만 비움
- **컨테이너·데몬 모두 재시작 불필요**
- Docker가 같은 파일에 계속 쓰기 가능

### B. Dangling volume 정리 (~125GB 회수)

`docker system df`에서 Local Volumes가 96% reclaimable이었음.

```bash
# 사용 중인 named volume이 정말 안 쓰이는지 한 번만 확인
# (예: db_data가 LINKS=0으로 보이지만 실제로는 bind mount일 수 있음)
docker inspect container-db --format '{{json .Mounts}}'

# bind mount면 db_data 볼륨은 안전하게 제거 대상
docker volume prune
```

**안전**: `docker volume prune`은 컨테이너에 attach된 볼륨은 절대 건드리지 않음 (LINKS≥1).

---

## 5-2. inotify 한도 증가 (재발 방지 1차)

Vue/Nuxt + `node_modules` 환경에서 기본값은 즉시 부족.

```bash
# 임시 (재부팅 시 사라짐)
sudo sysctl fs.inotify.max_user_watches=524288
sudo sysctl fs.inotify.max_user_instances=512

# 영구 적용
sudo sh -c 'echo "fs.inotify.max_user_watches=524288" >> /etc/sysctl.conf'
sudo sh -c 'echo "fs.inotify.max_user_instances=512" >> /etc/sysctl.conf'
sudo sysctl -p

# 확인
cat /proc/sys/fs/inotify/max_user_watches
```

→ 524288은 vscode·webpack·nuxt 같은 dev 환경 표준값.

---

## 5-3. 진짜 근본 해결 — 2가지 옵션

### 옵션 A: `package.json` 수정 (권장 — 보수적)

호스트 파일이 bind mount이므로 이미지 재빌드 없이 적용됨.

```bash
# 백업
cp ~/docker/app-1/source/package.json ~/docker/app-1/source/package.json.bak

# 수정
vi ~/docker/app-1/source/package.json
```

scripts 안에서:
```json
"build": "cross-env NODE_ENV=production HOST=0.0.0.0 nuxt --watch build"
```
→ 다음과 같이 변경 (`--watch` 제거):
```json
"build": "cross-env NODE_ENV=production HOST=0.0.0.0 nuxt build"
```

이러면 `yarn all`이:
1. `yarn build` (nuxt build, --watch 없음) — 정상 종료
2. `yarn start` (nuxt start, 진짜 prod 서버) — 진입

**장점**: 매번 컨테이너 시작 시 최신 빌드. 코드 변경 즉시 반영(다음 시작 시).
**단점**: 컨테이너 시작 시 빌드 시간 소요 (수십초~수분).

### 옵션 B: compose `command`를 `yarn start`로 변경 — 더 빠름

이미지에 빌드 결과(`.nuxt/dist/`)가 이미 있다면, 빌드 스킵하고 바로 prod 서버만 띄움.

```bash
# 이미지 안 빌드 결과 존재 확인
docker run --rm --entrypoint sh container-a:3.0.00 -c \
  'ls -la /app/.nuxt/dist/server/index.js 2>/dev/null && echo "OK: 빌드됨" || echo "NO: 안 빌드됨"'
```

빌드돼 있으면:
```yaml
# docker-compose.yml
command: "yarn start"   # yarn all → yarn start
```

**장점**: 컨테이너 시작 즉시 서빙 (빌드 시간 0).
**단점**: 이미지에 빌드 결과 없으면 즉시 실패. 코드 수정 시 이미지 재빌드 필요.

---

## 5-4. 안전장치 — Docker 데몬 차원 로그 로테이션

특정 compose에서 빠뜨려도 디스크 폭발을 막는 fallback.

```bash
sudo cp /etc/docker/daemon.json /etc/docker/daemon.json.bak
sudo vi /etc/docker/daemon.json
```

기존 내용에 `log-driver`/`log-opts` 추가:

```json
{
  "data-root": "/app/docker/overlay",
  "tls": true,
  "tlsverify": true,
  "tlscacert": "/etc/docker/tls/ca.pem",
  "tlscert": "/etc/docker/tls/server-cert.pem",
  "tlskey": "/etc/docker/tls/server-key.pem",
  "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2376"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  }
}
```

→ 컨테이너당 로그 최대 150MB. 개별 compose의 `logging:` 설정이 우선이지만, 누락 시 이 값으로 fallback.

```bash
# JSON 문법 검증
sudo python3 -m json.tool /etc/docker/daemon.json

# 적용 (한가한 시간에 — 모든 컨테이너 잠깐 내려감)
sudo systemctl restart docker
```

**중요**: 데몬 재시작해도 **기존 컨테이너에는 새 정책이 즉시 적용 안 됨**. 컨테이너를 `docker compose down && up -d` 또는 `docker rm/run`으로 재생성해야 적용.

---

## 5-5. 추천 실행 순서

```
[지금 — Docker 켜져있어도 안전]
1. sudo sh -c 'truncate -s 0 /home/group/docker/overlay/containers/*/*-json.log'
   → df -h /home으로 회수 확인 (~2TB)

2. docker volume prune
   → ~125GB 추가 회수

3. sudo sysctl fs.inotify.max_user_watches=524288
   → 즉시 효과, 컨테이너 재시작 불필요

[근본 해결 — 옵션 선택]
4-A. 이미지에 .nuxt/dist 있으면:
     - docker-compose.yml의 command를 "yarn start"로 변경
4-B. 없으면:
     - source/package.json의 build에서 "--watch" 제거 (yarn all 그대로 유지)

[안전장치 — 한가한 시간에]
5. /etc/docker/daemon.json에 log-opts 추가
6. sudo systemctl restart docker
7. 각 서비스 docker compose down && up -d로 재생성

[검증]
8. 1분 후 docker logs --tail 100 container-a | grep -i "ENOSPC\|listening\|ready"
   → ENOSPC 없고 "Nuxt server listening on..." 나오면 성공
9. 1시간 후 du -sh /home/group/docker/overlay/containers
   → 다시 GB 단위로 안 늘어나면 진짜 해결
```

---

## 5-6. Phase 5 요약

| 단계 | 회수량/효과 | 위험도 |
|---|---|---|
| 로그 truncate | ~2TB | 매우 낮음 (inode 유지) |
| volume prune | ~125GB | 낮음 (attach된 볼륨 보호) |
| inotify 한도 증가 | (재발 방지) | 매우 낮음 |
| 옵션 A: package.json 수정 | 영구 해결 | 낮음 (백업 후) |
| 옵션 B: compose command 변경 | 영구 해결 | 낮음 (백업 후) |
| daemon.json + 데몬 재시작 | 안전장치 | 중간 (모든 컨테이너 다운타임) |

**다음 Phase**: 명령어/함정/교훈 정리 → [[006_troubleshoot_commands_lessons]]
