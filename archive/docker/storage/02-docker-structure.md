---
title: Phase 2 — Docker 데이터 구조 파악
type: archive
tags: [archive, docker, data_root, overlay2, symlink, troubleshooting]
draft: true
---

> `/home/group/docker`에 2.2TB가 있다는 것까진 확인. 이 안이 표준 Docker data-root인지, 어디가 큰지 분석.

관련 개념: [[011_docker_overlay2_storage]]

---

## 2-1. 일단 들어가봤더니 표준 구조가 아님

```bash
sudo ls -la /home/group/docker/
```

**결과**:
```
drwxrwxr-x  4 user user   49 Feb  3  2025 .
drwxr-xr-x 33 user user 4096 Apr 29 11:21 ..
drwx--x--- 12 root root  219 May 18 18:30 overlay
drwxrwxr-x  3 user user  154 May  6 15:21 registry
```

→ 보통 Docker data-root 안에는 `containers/`, `volumes/`, `image/`, `network/` 등이 있어야 하는데 **`overlay/`와 `registry/`만 있음**. 게다가 `overlay/`는 root 소유에 권한 `drwx--x---`로 잠겨 있음.

이 상태로는 `/home/group/docker` 자체가 data-root인지, 아니면 그 안의 어딘가가 진짜 data-root인지 알 수 없음.

---

## 2-2. data-root 실제 설정 확인 (가장 정확)

```bash
docker info 2>/dev/null | grep -E "Root Dir|Storage Driver"
sudo cat /etc/docker/daemon.json
```

**결과**:
```
 Storage Driver: overlay2
 Docker Root Dir: /home/group/docker/overlay
```
```json
{
  "data-root": "/app/docker/overlay",
  "tls": true,
  ...
}
```

**중요한 발견**:
- `daemon.json`엔 `/app/docker/overlay`로 적혀 있는데 `docker info`는 `/home/group/docker/overlay`로 답함.
- 두 경로가 다른데 동일한 데이터를 가리킴 → **`/app/docker`가 `/home/group/docker`로의 심볼릭 링크**.

확인 명령:
```bash
ls -la /app/docker
readlink -f /app/docker/overlay
```

---

## 2-3. 진짜 data-root 안 구조

이제 `/home/group/docker/overlay/`가 진짜 data-root임을 알았으니, 그 안을 봄.

```bash
sudo ls /home/group/docker/overlay/
```

**결과**:
```
buildkit  containers  engine-id  image  network  overlay2  plugins  runtimes  swarm  tmp  volumes
```

→ 표준 Docker data-root 구조 확인. Phase 2-1에서 안 보였던 건 권한(`drwx--x---`) 때문이었음.

---

## 2-4. 어느 서브디렉토리가 큰지

```bash
sudo du -h --max-depth=1 /home/group/docker/overlay/ 2>/dev/null | sort -hr
```

**결과**:
```
2.2T    /home/group/docker/overlay/
2.0T    /home/group/docker/overlay/containers     ← 컨테이너 로그 파일
145G    /home/group/docker/overlay/volumes        ← named volume 데이터
92G     /home/group/docker/overlay/overlay2       ← 이미지 + 컨테이너 쓰기 레이어
358M    /home/group/docker/overlay/buildkit
92M     /home/group/docker/overlay/image
432K    /home/group/docker/overlay/network
0       /home/group/docker/overlay/tmp
0       /home/group/docker/overlay/swarm
0       /home/group/docker/overlay/runtimes
0       /home/group/docker/overlay/plugins
```

→ **`containers/`가 2.0TB**. 이게 진짜 범인. 컨테이너 로그 파일이 쌓인 것.

---

## 2-5. Docker data-root의 표준 서브디렉토리 의미

| 디렉토리 | 저장 내용 | 보통 크기 비중 |
|---|---|---|
| `image/` | 이미지 메타데이터 (manifest, config) | 작음 (수MB~수십MB) |
| `overlay2/` | 이미지 레이어 + 컨테이너 쓰기 레이어 | 큼 (이미지 수에 비례) |
| `containers/` | 컨테이너별 설정 + **`*-json.log` 로그** | 보통 작지만 로그가 폭주하면 폭발 |
| `volumes/` | named volume 데이터 (DB 등) | 가변 |
| `buildkit/` | BuildKit 빌드 캐시 | 빌드 자주 하면 큼 |
| `network/` | 네트워크 정의 | 작음 |
| `plugins/`, `swarm/`, `runtimes/`, `tmp/` | 보통 비어있거나 매우 작음 | 0~수MB |

→ `docker system df`는 image / containers(쓰기 레이어만) / volumes / build cache를 카운트.
→ **`containers/*/*-json.log`(로그 파일)은 어디에도 카운트 안 됨**. Phase 3에서 이 차이를 다룸.

---

## 2-6. Phase 2 요약

| 단계 | 명령 | 발견 |
|---|---|---|
| 1 | `ls -la /home/group/docker` | 표준 구조 아님 (`overlay`, `registry`만) |
| 2 | `docker info` + `cat daemon.json` | `/app/docker → /home/group/docker` 심볼릭 링크 발견 |
| 3 | `ls /home/group/docker/overlay/` | 표준 구조 확인 (권한 풀고 보니) |
| 4 | `du --max-depth=1 .../overlay/` | `containers/` 2.0TB로 압도적 |

**다음 Phase**: `containers/`의 로그 파일 분석 → [[03-log-analysis]]

---

## 핵심 교훈

- **custom data-root + 심볼릭 링크는 추적을 어렵게 함**. `daemon.json` 경로와 `docker info` 경로가 다를 수 있음. 둘 다 확인 필수.
- **권한이 잠긴 디렉토리는 처음 `ls`에서 안 보일 수 있음**. `sudo` 붙여서 다시 보거나 권한 확인 (`stat` / `ls -ld`).
- **표준 디렉토리 구조와 비교**하면 무엇이 비정상적으로 큰지 즉시 보임.
