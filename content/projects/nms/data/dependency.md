---
title: "서비스 연결(Dependency)"
tags:
  - project
  - nms
  - 참고/OpenTelemetry
  - 자체정의
draft: false
---

한 [[projects/nms/data/service|서비스]]가 다른 서비스를 호출하는 관계(mgr → api → db). **방향이 있고** 같은 장비 안에서도 생긴다. 물리 [[projects/nms/data/link|링크]]와 별개다. 공식 표준이 없어 자체 정의, 필드 이름은 OpenTelemetry 참고.

## 논리적 정보

| 항목 | 필수 | 용도 | 출처 |
|---|---|---|---|
| 식별자(id) | O | 저장 시 기존/신규 구분 | 자체 정의 |
| 호출 서비스(from) / 대상 서비스(to) | O | 화살표 방향 | 자체 정의 (참고: OpenTelemetry client → server) |
| 프로토콜(protocol) | - | HTTP / TCP. 툴팁 | 참고: OpenTelemetry `network.protocol.name` |
| 대상 포트(port) | - | TCP 5432 등. 툴팁 | 참고: OpenTelemetry `server.port` |
| 상태(status) | O | 성공 여부·응답 시간. 선 색 | 자체 정의 |
| 생성 방식(origin) | O | DISCOVERED / MANUAL | 자체 정의 |

물리적 정보는 없다. 실제로는 docker 네트워크나 물리 링크를 타지만 경로는 그리지 않는다.
