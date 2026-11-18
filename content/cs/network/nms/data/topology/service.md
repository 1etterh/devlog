---
title: "서비스(Service)"
tags:
  - network
  - nms
  - RFC
  - 참고
draft: false
---

장비 위에서 도는 컨테이너·프로세스. RFC 8345로 보면 물리 망 위에 얹힌 다른 층(서비스 맵)이고, 서비스가 도는 장비는 `supporting-node`다. 공식 표준이 없어 Docker Engine API를 참고한다.

## 정보

### 식별 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| 식별자 | 서비스 연결이 참조하는 키. 컨테이너 id는 재생성 때 바뀌므로 보통 compose 프로젝트·서비스명으로 식별한다 | 참고: Docker 라벨 `com.docker.compose.project` · `com.docker.compose.service` |
| 소속 장비 | 어느 노드 위에서 도는지(연결이 아니라 소속) | RFC 8345 `supporting-node` |

### 논리적 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| 이름 | 서비스 이름 | 참고: Docker `Name` / compose 서비스명 |
| 상태 | 실행 상태 · 헬스체크 결과 | 참고: Docker `State.Status`, `State.Health.Status` |
| 이미지 | 컨테이너 이미지 | 참고: Docker `Config.Image` |
| 컨테이너 포트 | 컨테이너 안에서 서비스가 listen하는 포트 + 프로토콜(TCP/UDP) | 참고: Docker `NetworkSettings.Ports`의 키(`5432/tcp`) |
| 호스트 포트 | 호스트 IP에 열린 포트(`-p 호스트:컨테이너`). 없을 수 있다 | 참고: Docker `NetworkSettings.Ports` › `HostIp` · `HostPort` |

- 포트는 장비 인터페이스(물리·논리 포트)와 다른 개념이다. TCP/UDP 포트 **번호**(L4)다.
- 물리적 정보는 없다. 물리 위치는 소속 장비가 대신한다.

## 수집 방법

| 항목 | 방식 | 1순위 | 대안 | 비고 |
|---|---|---|---|---|
| 목록 · 이름 · 상태 · 이미지 · 포트 | 둘 다 | Docker Engine API(컨테이너 조회) | 서버 에이전트, 수동 | 재생성에도 유지되는 이름은 compose 서비스명 |
| 소속 장비 | 자동 | Docker API를 조회한 서버 = 소속 노드 | — | 수집 대상 서버와 노드를 미리 연결해 둔다 |

Docker 소켓 접근은 root 권한과 같다. 읽기 전용 프록시나 에이전트로 노출 범위를 줄인다.
