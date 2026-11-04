---
title: "서비스(Service)"
tags:
  - project
  - nms
  - RFC8345
  - 참고/Docker
  - 자체정의
draft: false
---

장비 위에서 도는 docker 컨테이너·프로세스. 물리 맵이 아니라 서비스 맵에 그린다. 공식 표준이 없어 Docker Engine API를 참고한다.

## 정보

### 논리적 정보

| 항목 | 필수 | 용도 | 출처 |
|---|---|---|---|
| 식별자(id) | O | 서비스 연결이 참조. 컨테이너 id는 재생성 시 바뀌므로 compose 서비스명 기준 | 자체 정의 |
| 이름(name) | O | 라벨(db, api, mgr) | 참고: Docker `Name` / compose 서비스명 |
| 종류(kind) | O | container / process | 자체 정의 |
| 상태(status) | O | UP / WARN / DOWN / UNKNOWN. 헬스체크 | 자체 정의 (참고: Docker `State.Status`, `State.Health.Status`) |
| 서비스 포트(listenPorts) | - | TCP 5432 등. 장비 인터페이스와 다른 개념 | 참고: Docker `NetworkSettings.Ports` |

### 물리적 정보

| 항목 | 필수 | 용도 | 출처 |
|---|---|---|---|
| 소속 장비(hostNodeId) | O | 어느 노드 위에서 도는지(연결이 아니라 소속) | RFC 8345 `supporting-node` |
| 이미지(image) · 컨테이너 id(containerId) | - | 상세, 수집 매칭 | 참고: Docker `Config.Image` · `Id` |

## 수집 방법

| 항목 | 1순위 | 대안 | 비고 |
|---|---|---|---|
| 목록 · 이름 · 상태 · 이미지 · 서비스 포트 | Docker Engine API(컨테이너 조회) | 서버 에이전트, 수동 | 이름은 compose 서비스명 기준 |
| 소속 장비 | Docker API를 조회한 서버 = 소속 노드 | — | 수집 대상 서버와 노드를 미리 연결해 둔다 |

Docker 소켓 접근은 root 권한과 같다. 읽기 전용 프록시나 에이전트로 노출 범위를 줄인다.
