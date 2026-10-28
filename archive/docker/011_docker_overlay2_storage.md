---
title: Docker overlay2가 디스크를 크게 차지하는 이유
type: archive
tags: [archive, docker, storage_driver, overlay2, disk_usage]
draft: true
---

**Q**: Docker overlay(overlay2)가 디스크 용량을 수 TB 단위로 차지하고 있다는데, 이게 무엇인가?

**A**:
- overlay2는 Docker의 기본 **스토리지 드라이버**로, 이미지 레이어와 컨테이너의 쓰기 레이어를 `/var/lib/docker/overlay2/`에 저장
- 큰 용량은 보통 4가지 중 하나의 누적: **이미지 레이어**, **컨테이너 쓰기 레이어**, **named volume**, **빌드 캐시(BuildKit)**
- 특히 컨테이너 안에서 application log를 stdout이 아닌 파일로 쓰면 overlay 안에 계속 쌓여 TB 단위로 커지기 쉬움
- `docker system df -v`로 어느 카테고리가 점유 중인지 먼저 확인하고, RECLAIMABLE 비율 높은 항목부터 정리

| 카테고리 | 정리 명령 |
|---|---|
| 중지된 컨테이너·dangling 이미지·빌드 캐시 | `docker system prune` |
| 미사용 이미지까지 | `docker system prune -a` |
| 볼륨까지 (DB 데이터 주의) | `docker system prune -a --volumes` |
| 빌드 캐시 단독 | `docker builder prune -a` |
| 컨테이너 로그 파일 | `truncate -s 0 /var/lib/docker/containers/*/*-json.log` |

근본 해결은 `daemon.json`에 로그 로테이션 설정(`max-size`, `max-file`)을 두어 컨테이너 로그가 무한히 커지지 않도록 막는 것.

---

**실제 사례**: 위 4가지 누적 패턴 중 "컨테이너 로그 파일"이 1.7TB까지 폭주한 장애의 진단·해결 전체 흐름은 [[index|Docker/disk-log-trouble/index]] (Phase별 상세) 또는 [[007_incident_postmortem]] (종합 보고서) 참조.
