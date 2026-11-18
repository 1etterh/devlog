---
title: "서비스 연결(Dependency)"
tags:
  - network
  - nms
  - 참고
draft: false
---

한 [[cs/network/nms/data/topology/service|서비스]]가 다른 서비스를 호출하는 관계(web → api → db). **방향이 있고** 같은 장비 안에서도 생긴다. 물리 [[cs/network/nms/data/topology/link|링크]]와 별개다. 공식 표준이 없고, 필드 이름은 OpenTelemetry를 참고할 만하다.

## 정보

### 식별 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| 호출 서비스 / 대상 서비스 | 호출 방향 | 참고: OpenTelemetry client → server |

### 논리적 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| 프로토콜 | HTTP / TCP 등 | 참고: OpenTelemetry `network.protocol.name` |
| 대상 포트 | 호출하는 쪽이 도착지로 쓴 포트. 같은 Docker 네트워크 안이면 컨테이너 포트, 밖에서 부르면 호스트 포트 | 참고: OpenTelemetry `server.port` |
| 상태 | 호출 성공률 · 응답 시간 | 표준 없음 |

물리적 정보는 없다. 실제 호출은 컨테이너 네트워크나 물리 링크를 타지만, 서비스 연결은 경로가 아니라 호출 관계만 나타낸다.

## 수집 방법

| 항목 | 방식 | 1순위 | 대안 | 비고 |
|---|---|---|---|---|
| 호출 · 대상 서비스, 프로토콜, 포트 | 둘 다 | 수동 등록 | 서버 에이전트(`ss` · conntrack으로 TCP 연결 관찰) → OpenTelemetry 트레이스 | OpenTelemetry가 가장 정확하지만 애플리케이션 코드 수정이 필요하다 |
| 상태 | 자동 | 에이전트·트레이스의 성공률·응답 시간 | 헬스체크 | 기준은 제품마다 |
