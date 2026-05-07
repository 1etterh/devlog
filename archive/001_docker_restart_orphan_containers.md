---
title: Docker restart 시 orphan 컨테이너는 어떻게 되는가
type: archive
tags: [archive, docker, docker_compose, container_lifecycle, restart_policy]
draft: true
---

**Q**: docker restart하면 orphan container들은 어떻게 되는가?

**A**:
- `docker restart <container>`: 지정한 컨테이너만 재시작, orphan 영향 없음
- `docker compose restart` / `docker compose down`: 현재 compose 파일에 정의된 서비스만 처리, orphan은 그대로 유지 (`--remove-orphans` 줘야 정리됨)
- `docker compose up`: orphan 발견 시 경고만 출력, 자동 제거 안 함
- `systemctl restart docker` (데몬 재시작): orphan 포함 모든 컨테이너가 자기 restart policy(`no` / `always` / `unless-stopped` / `on-failure`)에 따라 동작

핵심: 어떤 restart 명령에도 orphan이 자동으로 정리되거나 따라가는 보장은 없다. compose 명령은 "현재 파일에 정의된 것"만 다루고, 데몬 재시작은 출신과 무관하게 restart policy로만 결정된다. orphan을 의도적으로 정리하려면 `--remove-orphans`를 명시하거나 직접 `docker rm` 해야 한다.
