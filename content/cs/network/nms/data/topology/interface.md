---
title: "인터페이스(Interface)"
tags:
  - network
  - nms
  - RFC
draft: false
---

장비의 포트. RFC 8345 `termination-point`.

> IF-MIB 인터페이스 테이블에는 Vlan10(SVI)·Port-channel1(LAG)·Loopback0 같은 논리 인터페이스도 섞여 나온다. 케이블은 물리 포트에 꽂히므로 `ifType`으로 물리 / 논리를 구분한다.

## 정보

### 식별 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| 식별자 | 링크 끝점이 참조하는 키 | RFC 8345 `tp-id`. 장비 안에서는 IF-MIB `ifIndex` |
| 소속 장비 | 어느 노드의 포트인지 | RFC 8345 (termination-point ⊂ node) |
| 인터페이스명 | Gi1/0/1 등 | IF-MIB `ifName` |

### 논리적 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| IP 주소 | L3 인터페이스의 IP | IP-MIB `ipAddressIfIndex` |
| VLAN | 기본 VLAN(PVID) | Q-BRIDGE-MIB `dot1qPvid` |
| 관리 상태 | 관리자가 켜고 끈 상태 | IF-MIB `ifAdminStatus` |
| 운용 상태 | 실제 링크 동작 상태 | IF-MIB `ifOperStatus` |

### 물리적 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| MAC 주소 | 포트 MAC. MAC 테이블 기반 연결 추정에 쓴다 | IF-MIB `ifPhysAddress` |
| 속도 | 대역폭(Mbps) | IF-MIB `ifHighSpeed` |
| 매체 유형 | 구리 / 광 | MAU-MIB `ifMauType` |

## 수집 방법

| 항목 | 방식 | 1순위 | 대안 | 비고 |
|---|---|---|---|---|
| 목록 · 인터페이스명 · 종류 | 자동 | SNMP 폴링 IF-MIB `ifName`, `ifType` | NETCONF | `ifType`으로 물리 / 논리 구분 |
| 관리 · 운용 상태 | 자동 | SNMP 폴링 `ifAdminStatus`, `ifOperStatus` | SNMP trap linkUp / linkDown, gNMI | 폴링 + trap을 같이 쓰는 게 일반적 |
| IP 주소 | 자동 | SNMP 폴링 IP-MIB `ipAddressIfIndex` | SSH CLI | |
| VLAN | 자동 | SNMP 폴링 Q-BRIDGE-MIB `dot1qPvid` | SSH CLI | 장비마다 지원 편차 |
| MAC 주소 · 속도 | 자동 | SNMP 폴링 `ifPhysAddress`, `ifHighSpeed` | — | `ifSpeed`는 약 4.29Gbps 상한([[cs/network/nms/data/resolution|해상도]]) |
| 매체 유형 | 자동 | SNMP 폴링 MAU-MIB `ifMauType` | SSH CLI | 지원 장비 적음 |

trap을 받으려면 장비에 수신 주소를 설정하고 수집 서버 UDP 162를 연다.
