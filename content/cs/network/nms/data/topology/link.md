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

## 정보

### 논리적 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| 식별자 | 링크 키 | RFC 8345 `link-id` |
| 상태 | 양 끝 포트의 운용 상태로 판단. 판정 기준은 제품마다 | IF-MIB `ifOperStatus` |

### 물리적 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| 끝점 ×2 | 양 끝 장비 · 포트 | LLDP-MIB `lldpLocPortId` ↔ `lldpRemPortId`, `lldpRemSysName`. 구조는 RFC 8345 `source` / `destination` |
| 대역폭 | 양 끝 속도 중 작은 값(Mbps) | IF-MIB `ifHighSpeed` |
| 사용률 · 트래픽 | 카운터 증가량 | IF-MIB `ifHCInOctets` · `ifHCOutOctets` |

## 수집 방법

| 항목 | 방식 | 1순위 | 대안 | 비고 |
|---|---|---|---|---|
| 끝점 ×2 | 둘 다 | LLDP 이웃 테이블(SNMP로 LLDP-MIB 조회) | 시스코 CDP → MAC · ARP 테이블 추정 → 수동 | 결과가 다르면 앞쪽을 믿는다. 장비에서 LLDP를 켜야 한다 |
| 상태 | 자동 | 양 끝 인터페이스 `ifOperStatus` | linkUp / linkDown trap | |
| 대역폭 | 자동 | 양 끝 `ifHighSpeed` 중 작은 값 | — | |
| 사용률 · 트래픽 | 자동 | `ifHCInOctets` / `ifHCOutOctets` 두 번 읽은 차이 | gNMI | 64비트 카운터 |

- **MAC · ARP 추정**: 스위치 MAC 주소 테이블(BRIDGE-MIB RFC 4188, Q-BRIDGE-MIB `dot1qTpFdbTable`)과 ARP 테이블(IP-MIB `ipNetToPhysicalTable`)을 맞춰 "어느 포트에 누가 붙었나"를 추정한다. LLDP가 없는 서버·비관리 스위치 구간용이고 틀릴 수 있다.
- **사이트 간 회선**은 사업자 망을 건너 LLDP로 잘 안 잡힌다 → 수동 링크가 많다.
