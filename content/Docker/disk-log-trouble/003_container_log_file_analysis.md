---
title: Phase 3 — 컨테이너 로그 파일 분석
type: project
tags: [project, docker, container_logs, json_log, troubleshooting, sudo_glob]
draft: false
---

> `containers/`가 2.0TB라는 건 확인. 어느 컨테이너의 로그가 큰지 식별하고, 컨테이너 ID를 이름으로 매핑.

---

## 3-1. `docker system df`와 디렉토리 실측치의 차이

먼저 Docker 자신이 보고하는 사용량:

```bash
docker system df --format "{{.Type}}\t{{.Size}}\t{{.Reclaimable}}"
```

**결과**:
```
Images          33.48GB   1.542GB (4%)
Containers       6.45GB   0B (0%)
Local Volumes  129.2GB   125.2GB (96%)   ← dangling 96%
Build Cache        0B      0B
```

**중요한 발견**:
- docker 보고 총합: **~169GB**
- 디렉토리 실측: **2.2TB**
- **약 2TB가 `docker system df`에 안 잡힘**

`docker system df`의 "Containers" 6.45GB는 **컨테이너 쓰기 레이어**(overlay2의 일부)만 카운트. `*-json.log` 로그 파일은 어디에도 안 잡힘.

→ 디스크 진단 시 `docker system df`만 믿으면 안 됨. **`du`로 직접 측정한 결과가 진실**.

---

## 3-2. 로그 파일 크기 측정 — `sudo + glob`의 함정

처음 시도한 명령:
```bash
sudo du -h /home/group/docker/overlay/containers/*/*-json.log 2>/dev/null | sort -hr
```

**결과: 빈 출력**. 아무것도 안 나옴.

**원인**: 쉘 glob(`*`)은 **sudo 실행 전에** 호출 사용자(user) 권한으로 펼쳐짐. 그 사용자가 `containers/` 디렉토리를 못 읽으면 glob이 빈 문자열로 펼쳐져서 `du`에 인자가 안 들어감. `2>/dev/null` 때문에 에러도 안 보임.

**해결책 2가지**:

```bash
# 방법 1: sh -c 안에서 glob 펼치기 (glob이 sudo 권한으로 평가됨)
sudo sh -c "du -h /home/group/docker/overlay/containers/*/*-json.log | sort -hr | head -20"

# 방법 2: find 사용 (glob 의존 없음, 더 안전)
sudo find /home/group/docker/overlay/containers -name "*-json.log" \
  -exec du -h {} + 2>/dev/null | sort -hr | head -20
```

---

## 3-3. 로그 파일 크기 순위

위 명령의 실제 결과:

```
1.7T    .../b39029cb5b6696c2c92f611c5fb05b21.../...-json.log
252G    .../7e7178fff259e9657bf33182efbaaeb6.../...-json.log
79G     .../6d8c5ed3a576454d5c21a71c37e76f73.../...-json.log
13G     .../5eae30a4d1d8735da7cb7bf5c5e59b54.../...-json.log
6.3G    .../9161bffa3cff8a1518eb8842fc438f86.../...-json.log
310M    .../1138a45a47e86f34520fb7b2b6886eb2.../...-json.log
200M    .../ada9da2139c2511f451f3801d9f4fe9e.../...-json.log
...
```

→ **상위 2개가 약 2TB**. 컨테이너 ID(64자리 hash)만으로는 어떤 컨테이너인지 모름.

---

## 3-4. 컨테이너 ID → 이름 매핑

`docker ps`가 보여주는 12자리 짧은 ID는 **64자리 풀 ID의 접두사**. 풀 ID 그대로 디렉토리명이 됨.

`docker system df -v` 출력의 Containers 섹션 (또는 `docker ps -a`):

```
CONTAINER ID    IMAGE                  NAMES
b39029cb5b66    container-a:3.0.00     container-a     ← 1.7TB 주인
7e7178fff259    container-b:3.0.00     container-b     ← 252GB 주인
6d8c5ed3a576    container-c:3.0.1      container-c     ← 79GB 주인
5eae30a4d1d8    container-d:3.0.00     container-d     ← 13GB 주인
9161bffa3cff    container-e:0.0.1      container-e     ← 6.3GB 주인
```

매핑 확인: 로그 파일 경로의 `b39029cb5b6696c2...` = `docker ps`의 `b39029cb5b66` = 컨테이너 이름 `container-a`.

---

## 3-5. 한 줄로 이름까지 보여주는 명령

다음번에는 이 한 줄로 바로 이름이 보이게 할 수 있음:

```bash
sudo find /home/group/docker/overlay/containers -name "*-json.log" -exec du -b {} + 2>/dev/null | \
  sort -rn | head -10 | \
  while read size path; do
    cid=$(basename $(dirname "$path"))
    name=$(docker inspect --format '{{.Name}}' "$cid" 2>/dev/null | sed 's|^/||')
    printf "%10s  %-30s  (%s)\n" "$(numfmt --to=iec $size)" "${name:-<삭제됨>}" "${cid:0:12}"
  done
```

출력 예:
```
       1.7T  container-a                    (b39029cb5b66)
       252G  container-b                    (7e7178fff259)
        79G  container-c                    (6d8c5ed3a576)
```

---

## 3-6. Phase 3 요약

| 단계 | 명령 | 발견 |
|---|---|---|
| 1 | `docker system df` | 169GB만 보고 → 2TB가 어디로? |
| 2 | `find ... -name "*-json.log" -exec du` | 로그 파일 1.7TB / 252GB가 압도적 |
| 3 | ID 앞 12자리 매칭 | `container-a` / `container-b`가 주범 |

**다음 Phase**: 왜 이 두 컨테이너가 로그를 폭주시켰는지 → [[004_nuxt_dev_mode_inotify_root_cause]]

---

## 핵심 교훈

- **`docker system df`는 컨테이너 로그를 카운트 안 함**. 의심되면 항상 `du`로 직접 측정.
- **`sudo + glob`은 함정**. glob은 sudo 전에 평가됨. `sh -c` 또는 `find`로 우회.
- **컨테이너 ID는 64자리 풀 ID와 12자리 짧은 ID의 동일물**. 파일시스템엔 64자리, `docker ps`엔 12자리.
- **dangling volume 96%**도 발견 — Phase 5의 정리 대상.
