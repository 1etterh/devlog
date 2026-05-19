---
title: 운영 서버 디스크 풀 트러블슈팅 — 개요
type: project
tags: [project, docker, container_logs, disk_full, postmortem, overview]
draft: true
---

> Docker 컨테이너 로그가 2TB를 차지한 사건의 진단부터 해결까지 전체 기록.
> Phase별 상세 내용은 같은 디렉토리의 `00N_*.md` 참조.

관련 개념: [[011_docker_overlay2_storage]]

---

## 사건 요약

- **증상**: 운영 서버의 디스크가 거의 100% 사용 중. 누군가 "Docker overlay가 2TB"라고 함.
- **실제 범인**: `container-a`의 로그 파일 단독으로 **1.7TB**, `container-b` **252GB**.
- **근본 원인**:
  1. Nuxt 앱이 운영 환경에서 **dev 모드 또는 watch 빌드 모드**로 떠 있음
  2. → file watcher가 OS의 `inotify` 한도 초과
  3. → `ENOSPC` 에러가 초당 수천 줄씩 stdout으로 폭주
  4. → Docker가 `*-json.log`에 그대로 영구 저장 (로그 로테이션 미설정)
- **추가 발견**: `package.json`과 `docker-compose.yml` 양쪽에 미묘한 함정이 있어, 단순히 "production 스크립트 쓰기"나 "yarn all 쓰기"만으론 해결 안 됨.
- **해결 가능량**: 즉시 ~2.1TB 회수 (로그 truncate ~2TB + dangling volume prune ~125GB).

---

## Phase 구성

| 파일 | 내용 |
|---|---|
| **[[001_disk_usage_trace]]** | `df` / `du`로 어느 디렉토리가 큰지 좁혀나간 과정 |
| **[[002_docker_data_root_structure]]** | Docker data-root 위치 확인 (심볼릭 링크) + 표준 디렉토리 구조 |
| **[[003_container_log_file_analysis]]** | `docker system df`와 디렉토리 실측치 차이 + 컨테이너 로그 파일 식별 + ID→이름 매핑 |
| **[[004_nuxt_dev_mode_inotify_root_cause]]** | Nuxt dev 모드 / inotify 한도 / `package.json`·`docker-compose.yml`의 함정 |
| **[[005_disk_recovery_solutions]]** | 즉시 회수 + 영구 해결 방안 (옵션 A: package.json 수정 / 옵션 B: compose command 변경) |
| **[[006_troubleshoot_commands_lessons]]** | 자주 쓴 명령어 모음, 트러블슈팅 함정, 교훈 |
| **[[007_incident_postmortem]]** | 종합 포스트모템 (회사 보고서 양식, 일반화) |

---

## 핵심 결론 (TL;DR)

### 즉시 해야 할 일

```bash
# 1. 로그 truncate (즉시 2TB 회수)
sudo sh -c 'truncate -s 0 /home/group/docker/overlay/containers/*/*-json.log'

# 2. dangling volume 정리 (125GB 추가 회수)
docker volume prune

# 3. inotify 한도 증가
sudo sysctl fs.inotify.max_user_watches=524288
```

### 영구 해결

- **`~/docker/app-1/source/package.json`의 `build` 스크립트에서 `--watch` 제거** (옵션 A)
- 또는 **이미지에 빌드 결과가 이미 있다면 `docker-compose.yml`의 `command`를 `yarn start`로 변경** (옵션 B)
- Docker 데몬 차원의 로그 로테이션도 `/etc/docker/daemon.json`에 설정 (안전장치)

### 핵심 교훈 3가지

1. **운영 서버에 dev 모드 / watch 빌드 띄우지 말 것.** `package.json`의 스크립트 이름(`production`)이 항상 진실은 아님. 실제 동작 확인 필수.
2. **Docker 로그 로테이션은 기본 세팅으로 봐야 함.** 한 컨테이너가 미치면 디스크 전체가 즉사.
3. **`docker system df`만 믿지 말 것.** 컨테이너 로그(`*-json.log`)는 카운트 안 됨. 의심되면 `du`로 직접 측정.
