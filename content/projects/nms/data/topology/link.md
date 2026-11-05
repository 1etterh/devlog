---
title: "링크(Link)"
tags:
  - project
  - nms
  - RFC
  - IEEE
  - 자체정의
draft: false
---

두 [[projects/nms/data/topology/node|노드]]의 [[projects/nms/data/topology/interface|인터페이스]]를 잇는 **물리 케이블** 한 가닥. 방향이 없고, 같은 장비 안에서는 생기지 않는다. 같은 장비 쌍이라도 인터페이스가 다르면 여러 개(이중화 회선)일 수 있다.

> RFC 8345 링크는 단방향이라 케이블 하나를 2개로 표현한다. 여기서는 1개로 저장하고 방향을 없앴다([[projects/nms/data/topology/index|토폴로지 데이터 표준]]).

## 정보

### 논리적 정보

| 항목 | 필수 | 용도 | 출처 |
|---|---|---|---|
| 식별자(id) | O | 저장 시 기존/신규 구분 | RFC 8345 `link-id` |
| 상태(status) | O | 선 색, DOWN은 파선 | 자체 정의 (양 끝 IF-MIB `ifOperStatus`) |
| 생성 방식(origin) | O | DISCOVERED / MANUAL. 수동은 점선, 삭제 가능 | 자체 정의 |

### 물리적 정보

| 항목 | 필수 | 용도 | 출처 |
|---|---|---|---|
| 끝점(endpoints) ×2: nodeId, interfaceId, ifName | O | 양 끝. 순서 무의미. 화면에서 source/target으로 펼친다 | LLDP-MIB `lldpLocPortId` ↔ `lldpRemPortId`, `lldpRemSysName`. 구조는 RFC 8345 `source`/`destination` |
| 대역폭(bandwidth) | - | 툴팁(Mbps), 선 굵기 | IF-MIB `ifHighSpeed` (양 끝 중 작은 값) |
| 사용률·트래픽 | - | 추후 선 굵기·색 | IF-MIB `ifHCInOctets`·`ifHCOutOctets` 증가량 |

## 수집 방법

| 항목 | 방식 | 1순위 | 대안 | 비고 |
|---|---|---|---|---|
| 끝점 ×2 | 둘 다 | LLDP 이웃 테이블(SNMP로 LLDP-MIB 조회) | 시스코 CDP → MAC · ARP 테이블 추정 → 수동 | 결과가 다르면 앞쪽을 믿는다. 장비에서 LLDP를 켜야 한다 |
| 상태 | 자동 | 양 끝 인터페이스 `ifOperStatus` | linkUp / linkDown trap | |
| 생성 방식(origin) | 자동 | 백엔드가 기록 | — | LLDP·CDP·추정이면 DISCOVERED, 수동이면 MANUAL |
| 대역폭 | 자동 | 양 끝 `ifHighSpeed` 중 작은 값 | — | |
| 사용률 · 트래픽 | 자동 | `ifHCInOctets` / `ifHCOutOctets` 두 번 읽은 차이 | gNMI | 64비트 카운터 |

- **MAC · ARP 추정**: 스위치 MAC 주소 테이블(BRIDGE-MIB RFC 4188, Q-BRIDGE-MIB `dot1qTpFdbTable`)과 ARP 테이블(IP-MIB `ipNetToPhysicalTable`)을 맞춰 "어느 포트에 누가 붙었나"를 추정한다. LLDP가 없는 서버·비관리 스위치 구간용이고 틀릴 수 있다.
- **사이트 간 회선**은 사업자 망을 건너 LLDP로 잘 안 잡힌다 → 수동 링크가 많다.
