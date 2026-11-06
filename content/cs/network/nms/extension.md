---
title: "범위 밖 단위(Extension)"
tags:
  - network
  - nms
  - RFC
  - IEEE
  - 참고
draft: false
---

> 기본 토폴로지(사이트·노드·인터페이스·링크·서비스) 밖에서 NMS가 흔히 다루는 단위. 정의와 **붙는 자리**를 적는다. 감시 정보(경보·측정값)는 [[cs/network/nms/data/monitoring/index|감시]]에 따로 정리했다. 성격은 셋이다: 장비에서 수집되지 않는 기준 정보, 구조가 아닌 감시 정보, 맵보다 더 잘게·위로 쪼갠 구조.

| 단위 | 붙는 자리 | 출처 | 필요할 때 |
|---|---|---|---|
| [[cs/network/nms/data/monitoring/event#경보alarm\|경보]] | 노드·인터페이스·링크·구성품·서비스 | RFC 8632, RFC 3877 | 상태를 장애 이력과 함께 보여야 할 때 |
| [인터페이스 계층](#인터페이스-계층) | 인터페이스 → 상위 인터페이스 | IF-MIB `ifStackTable`, RFC 8343, IEEE 802.1AX | LAG·VLAN을 맵에 보일 때 |
| [하드웨어 구성품](#하드웨어-구성품component) | 노드 › 구성품 › 인터페이스 | ENTITY-MIB, RFC 8348, RFC 4268, RFC 3433 | 전원·팬·모듈 고장을 따로 볼 때 |
| [[cs/network/nms/data/monitoring/metric\|측정값]] | 대상 + 시각 + 값 | IF-MIB 카운터, ENTITY-SENSOR-MIB | 트래픽 그래프를 붙일 때 |
| [네트워크(층)](#네트워크network) | 노드·링크가 속하는 층 | RFC 8345 `network`, RFC 8944, RFC 8346 | 망이 여럿이거나 IP가 겹칠 때 |
| [관리 접속 정보](#관리-접속-정보access) | 노드 1:1 | 제품마다 다름 | 장비를 직접 수집할 때 |
| [네트워크 서비스](#네트워크-서비스network-service) | 여러 노드·링크를 지나는 고객 회선 | RFC 8299, RFC 8466, RFC 9418 | 회선 단위 관리가 필요할 때 |
| 그룹·태그, 소유, 작업 시간대, 변경 이력 | 노드·사이트 | 제품마다 다름 | 분류·권한·점검 일정·감사가 필요할 때 |

## 인터페이스 계층

IF-MIB `ifStackTable`이 물리 포트와 논리 인터페이스(Port-channel, Vlan10)의 위아래를 잇는다. 인터페이스에 종류(`ifType`)와 상위 인터페이스(RFC 8343 `higher-layer-if`)를 붙인다.

- 케이블은 **멤버 포트**에 연결된다. LAG 링크는 멤버 링크를 묶은 논리 링크다([[cs/network/nms/data/site#사이트-간-회선|사이트 간 회선]]처럼 묶어서 보는 단위).
- 일부 멤버만 끊기면 LAG는 살아 있지만 대역폭이 줄어든다.

## 하드웨어 구성품(Component)

ENTITY-MIB의 부품 나무: 섀시 › 슬롯 › 모듈 › 포트(= 인터페이스), 전원·팬·센서.

| 항목 | 출처 |
|---|---|
| 식별자, 상위 구성품, 분류(chassis / module / port / powerSupply / fan / sensor …) | ENTITY-MIB `entPhysicalIndex` · `entPhysicalContainedIn` · `entPhysicalClass`, RFC 8348 |
| 모델·제조사·일련번호 (장비 단위 값은 보통 섀시 값) | ENTITY-MIB |
| 운용 상태 / 센서 값 | ENTITY-STATE-MIB `entStateOper` / ENTITY-SENSOR-MIB `entPhySensorValue` |
| 포트 ↔ 인터페이스 대응 | ENTITY-MIB `entAliasMappingTable` |

모듈이 빠지면 그 아래 포트·링크가 영향받는다는 판단에 쓴다. IETF 통합 인벤토리 모델(`draft-ietf-ivy-network-inventory-yang`)은 아직 RFC가 아니다.

## 네트워크(Network)

RFC 8345의 최상위 단위(`network-id`, `network-types`, `supporting-network`). 물리 망과 서비스 망처럼 층을 나누거나, 관리망·서비스망 분리, 고객망 IP 중복, 한 장비가 여러 망에 속할 때 필요하다.

## 관리 접속 정보(Access)

수집용 정보. 관리 주소(LLDP-MIB `lldpLocManAddr`), 수집 방식(SNMP v2c/v3, gNMI), 인증 정보(**참조만 두고 값은 별도 보관소**에 두는 게 보통), 수집 주기·마지막 수집 결과(수집 실패와 장비 장애를 구분하는 근거).

## 네트워크 서비스(Network Service)

고객 회선·VPN처럼 여러 노드·링크를 지나는 단위(RFC 8299 L3VPN, RFC 8466 L2VPN). 의존 대상(RFC 9418)으로 장애 영향을 판단한다.

- 표준의 `site`는 고객 접속 단위(논리)로, 물리 장소인 [[cs/network/nms/data/site|사이트]]와 뜻이 다르다.
- 장비 위 애플리케이션인 [[cs/network/nms/data/topology/service|서비스]]와 이름이 겹친다. 구분할 때는 "네트워크 서비스" / "애플리케이션 서비스"로 부른다.
