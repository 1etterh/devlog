---
title: "인터페이스(Interface)"
tags:
  - project
  - nms
  - RFC8345
  - RFC2863
  - RFC4293
  - RFC4363
  - RFC4836
draft: false
---

장비의 물리 포트. 화면 라벨은 "포트".

> IF-MIB 인터페이스 테이블에는 Vlan10(SVI)·Port-channel1(LAG)·Loopback0 같은 논리 인터페이스도 섞여 나온다. 맵 링크에는 물리 포트만 쓰고 `ifType`으로 구분한다.

## 정보

### 식별 정보

| 항목 | 필수 | 용도 | 출처 |
|---|---|---|---|
| 식별자(id) | O | 링크 끝점이 참조 | RFC 8345 `tp-id`. 장비 안에서는 IF-MIB `ifIndex` |
| 소속 장비(nodeId) | O | 어느 노드의 인터페이스인지 | RFC 8345 (termination-point ⊂ node) |
| 인터페이스명(ifName) | O | Gi1/0/1 등. 링크 라벨, 포트 선택 | IF-MIB `ifName` |

### 논리적 정보

| 항목 | 필수 | 용도 | 출처 |
|---|---|---|---|
| IP 주소(ip) | - | L3 인터페이스의 IP | IP-MIB `ipAddressIfIndex` |
| VLAN(vlan) | - | 기본 VLAN | Q-BRIDGE-MIB `dot1qPvid` |
| 관리 상태(adminStatus) | - | 관리자가 끈 포트 구분 | IF-MIB `ifAdminStatus` |
| 운용 상태(operStatus) | - | 링크 상태 판정 근거 | IF-MIB `ifOperStatus` |

### 물리적 정보

| 항목 | 필수 | 용도 | 출처 |
|---|---|---|---|
| MAC 주소(macAddress) | - | 상세, MAC 테이블 기반 연결 추정 | IF-MIB `ifPhysAddress` |
| 속도(speed) | - | 대역폭(Mbps) | IF-MIB `ifHighSpeed` |
| 매체 유형(mediaType) | - | copper / fiber | MAU-MIB `ifMauType` |

## 수집 방법

| 항목 | 1순위 | 대안 | 비고 |
|---|---|---|---|
| 목록 · 인터페이스명 · 종류 | SNMP 폴링 IF-MIB `ifName`, `ifType` | NETCONF | `ifType`으로 물리 / 논리 구분 |
| 관리 · 운용 상태 | SNMP 폴링 `ifAdminStatus`, `ifOperStatus` | SNMP trap linkUp / linkDown, gNMI | 폴링 + trap을 같이 쓰는 게 일반적 |
| IP 주소 | SNMP 폴링 IP-MIB `ipAddressIfIndex` | SSH CLI | |
| VLAN | SNMP 폴링 Q-BRIDGE-MIB `dot1qPvid` | SSH CLI | 장비마다 지원 편차 |
| MAC 주소 · 속도 | SNMP 폴링 `ifPhysAddress`, `ifHighSpeed` | — | `ifSpeed`는 약 4.29Gbps 상한([[projects/nms/resolution|해상도]]) |
| 매체 유형 | SNMP 폴링 MAU-MIB `ifMauType` | SSH CLI | 지원 장비 적음 |

trap을 받으려면 장비에 수신 주소를 설정하고 수집 서버 UDP 162를 연다.
