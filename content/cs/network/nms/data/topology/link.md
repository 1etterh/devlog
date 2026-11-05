---
title: "링크(Link)"
tags:
  - network
  - nms
  - RFC
  - IEEE
draft: false
---

두 [[cs/network/nms/data/topology/node|노드]]의 [[cs/network/nms/data/topology/interface|인터페이스]]를 잇는 **물리 케이블** 한 가닥. 같은 장비 쌍이라도 인터페이스가 다르면 여러 개(이중화 회선)일 수 있다.

> RFC 8345 링크는 **단방향**이라 케이블 하나를 링크 2개(A→B, B→A)로 표현한다. 화면에서는 보통 선 하나로 그린다([[cs/network/nms/data/topology/index|토폴로지 데이터 표준]]).

## 방향

케이블 하나는 보통 양방향(full duplex)이다. 그래도 한쪽 방향만 되거나 한쪽만 보이는 경우가 있다.

| 경우 | 실제로 단방향인가 | 내용 |
|---|---|---|
| 광 한 가닥 고장 | 예 | 광 링크는 송신·수신 가닥이 따로라 한 가닥이 끊기면 A→B만 된다. Cisco UDLD가 감지 |
| 데이터 다이오드 | 예 | 보안망에서 물리적으로 한 방향만 보내는 장비 |
| MPLS LSP · 일부 터널 | 예 (논리) | 경로가 한 방향으로 정의되고 돌아오는 길은 따로 만든다 |
| 비대칭 회선 | 아니오 | 위성 · 케이블 모뎀처럼 오가는 속도만 다르다 |
| 탐색 비대칭 | 아니오 | LLDP로 A는 B를 이웃으로 알리는데 B는 A를 안 알림(LLDP 꺼짐, SNMP 불가, 서버 등). 링크가 아니라 **근거가 한쪽에만** 있는 것 |

- 일반 NMS는 링크를 양 끝을 가진 **1개**로 다루고, 한쪽 장애는 끝점별 상태로, 탐색 비대칭은 "양쪽 확인 / 한쪽만 확인" 근거로 표시하는 경우가 많다.
- "API → DB 호출"처럼 원래 방향이 있는 관계는 링크가 아니라 [[cs/network/nms/data/topology/dependency|의존성]]이다.

## 정보

### 식별 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| 식별자 | 링크 키 | RFC 8345 `link-id` |
| 끝점 ×2 | 양 끝 장비 · 포트. 링크는 양 끝으로 정체가 정해진다 | LLDP-MIB `lldpLocPortId` ↔ `lldpRemPortId`, `lldpRemSysName`. 구조는 RFC 8345 `source` / `destination` |

### 논리적 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| 상태 | 양 끝 포트의 운용 상태로 판단. 판정 기준은 제품마다 | IF-MIB `ifOperStatus` |

### 물리적 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| 대역폭 | 양 끝 속도 중 작은 값(Mbps) | IF-MIB `ifHighSpeed` |

사용률·트래픽은 링크의 속성이 아니라 시간별 **측정값**이다([[cs/network/nms/extension#측정값metric|범위 밖 단위 › 측정값]]).

## 수집 방법

| 항목 | 방식 | 1순위 | 대안 | 비고 |
|---|---|---|---|---|
| 끝점 ×2 | 둘 다 | LLDP 이웃 테이블(SNMP로 LLDP-MIB 조회) | 시스코 CDP → MAC · ARP 테이블 추정 → 수동 | 결과가 다르면 앞쪽을 믿는다. 장비에서 LLDP를 켜야 한다. `lldpRemPortId`는 이웃이 포트를 무엇으로 알려줄지 고르므로(`lldpRemPortIdSubtype`: 인터페이스 이름 / MAC / 로컬 번호) `ifName`과 바로 맞지 않을 수 있다 |
| 상태 | 자동 | 양 끝 인터페이스 `ifOperStatus` | linkUp / linkDown trap | |
| 대역폭 | 자동 | 양 끝 `ifHighSpeed` 중 작은 값 | — | |

- **MAC · ARP 추정**: 스위치 MAC 주소 테이블(BRIDGE-MIB RFC 4188, Q-BRIDGE-MIB `dot1qTpFdbTable`)과 ARP 테이블(IP-MIB `ipNetToPhysicalTable`)을 맞춰 "어느 포트에 누가 붙었나"를 추정한다. LLDP가 없는 서버·비관리 스위치 구간용이고 틀릴 수 있다.
- **사이트 간 회선**은 사업자 망을 건너 LLDP로 잘 안 잡힌다 → 수동 링크가 많다.
