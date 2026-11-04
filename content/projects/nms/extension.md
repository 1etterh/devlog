---
title: "범위 밖 단위(Extension)"
tags:
  - project
  - nms
  - RFC8345
  - RFC2863
  - RFC6933
  - IEEE802-1AB
  - RFC8632
  - RFC3877
  - RFC8343
  - IEEE802-1AX
  - RFC8348
  - RFC4268
  - RFC3433
  - RFC8944
  - RFC8346
  - RFC8299
  - RFC8466
  - RFC9418
  - 참고/RFC9417
  - 참고/ITU-T-X733
  - 참고/draft-ietf-ivy-network-inventory-yang
  - 자체정의
draft: false
---

> **현재 범위에 넣지 않는다.** NMS가 보통 다루지만 지금 모델에 없는 단위를 정의와 **붙는 자리**만 적어 둔다(2026-11-04). 빠진 이유는 셋이다: 장비에서 수집되지 않는 기준 정보, 구조가 아닌 감시 정보, 맵보다 더 잘게·위로 쪼갠 구조.

| 단위 | 붙는 자리 | 출처 | 넣을 시점 |
|---|---|---|---|
| [경보](#경보alarm) | 노드·인터페이스·링크·구성품·서비스 | RFC 8632, RFC 3877 | 상태를 장애 이력과 함께 보여야 할 때 |
| [인터페이스 계층](#인터페이스-계층) | 인터페이스 → 상위 인터페이스 | IF-MIB `ifStackTable`, RFC 8343, IEEE 802.1AX | LAG·VLAN을 맵에 보일 때 |
| [하드웨어 구성품](#하드웨어-구성품component) | 노드 › 구성품 › 인터페이스 | ENTITY-MIB, RFC 8348, RFC 4268, RFC 3433 | 전원·팬·모듈 고장을 따로 볼 때 |
| [측정값](#측정값metric) | 대상 + 시각 + 값 | IF-MIB 카운터, ENTITY-SENSOR-MIB | 트래픽 그래프를 붙일 때 |
| [네트워크(층)](#네트워크network) | 노드·링크가 속하는 층 | RFC 8345 `network`, RFC 8944, RFC 8346 | 망이 여럿이거나 IP가 겹칠 때 |
| [관리 접속 정보](#관리-접속-정보access) | 노드 1:1 | 자체 정의 | 백엔드 수집기를 만들 때 |
| [네트워크 서비스](#네트워크-서비스network-service) | 여러 노드·링크를 지나는 고객 회선 | RFC 8299, RFC 8466, RFC 9418 | 회선 단위 관리가 필요할 때 |
| 그룹·태그, 소유, 작업 시간대, 변경 이력 | 노드·사이트 | 자체 정의 | 요구가 생길 때 |

## 경보(Alarm)

일반적인 NMS는 상태를 저장하지 않고 **해제되지 않은 경보 중 가장 심각한 것**으로 계산한다. 지금 상태 값은 근거가 없다.

| 항목 | 출처 |
|---|---|
| 대상(resource), 종류(alarmType) — 같은 대상·종류는 경보 1개로 갱신 | RFC 8632 `resource`, `alarm-type-id` |
| 심각도(severity): indeterminate / warning / minor / major / critical | RFC 8632 `perceived-severity` (ITU-T X.733) |
| 해제 여부(cleared), 발생·마지막 발생 시각, 내용 | RFC 8632 `is-cleared`, `time-created`, `last-raised`, `alarm-text` |
| 운영자 처리(ack / 종료 / 보류) | RFC 8632 `operator-state-change` |

상태 대응(안): critical·major → DOWN, minor·warning → WARN, 없음 → UP, 수집 실패 → UNKNOWN. trap과 폴링으로 본 `ifOperStatus` 변화를 경보 발생·해제로 기록한다.

## 인터페이스 계층

IF-MIB `ifStackTable`이 물리 포트와 논리 인터페이스(Port-channel, Vlan10)의 위아래를 잇는다. 인터페이스에 종류(`ifType`)와 상위 인터페이스(RFC 8343 `higher-layer-if`)를 붙인다.

- 케이블 링크는 **멤버 포트**에 붙인다(`UNIQUE(interface_id)` 유지).
- LAG 링크는 저장하지 않고 멤버 링크를 묶어 계산한다([[projects/nms/data/site#사이트-간-회선|사이트 간 회선]]과 같은 방식). 일부 멤버 장애 = WARN.

## 하드웨어 구성품(Component)

ENTITY-MIB의 부품 나무: 섀시 › 슬롯 › 모듈 › 포트(= 인터페이스), 전원·팬·센서.

| 항목 | 출처 |
|---|---|
| 식별자, 상위 구성품, 분류(chassis / module / port / powerSupply / fan / sensor …) | ENTITY-MIB `entPhysicalIndex` · `entPhysicalContainedIn` · `entPhysicalClass`, RFC 8348 |
| 모델·제조사·일련번호 (지금 노드 값은 사실 섀시 값) | ENTITY-MIB |
| 운용 상태 / 센서 값 | ENTITY-STATE-MIB `entStateOper` / ENTITY-SENSOR-MIB `entPhySensorValue` |
| 포트 ↔ 인터페이스 대응 | ENTITY-MIB `entAliasMappingTable` |

모듈이 빠지면 그 아래 포트·링크가 영향받는다는 판단에 쓴다. IETF 통합 인벤토리 모델(`draft-ietf-ivy-network-inventory-yang`)은 아직 RFC가 아니다.

## 측정값(Metric)

대상(인터페이스·구성품·노드) + 지표(바이트·오류·폐기·온도) + 시각 + 값. 링크 "트래픽"은 속성이 아니라 이 단위다. 카운터는 차이 ÷ 시간으로 속도를 구하고, 사용률 = 속도 ÷ `ifHighSpeed`. 주기·보관은 [[projects/nms/resolution|resolution.md]].

## 네트워크(Network)

RFC 8345의 최상위 단위(`network-id`, `network-types`, `supporting-network`). 지금은 물리 맵 / 서비스 맵을 API로 나눠 암묵적으로 처리한다. 관리망·서비스망 분리, 고객망 IP 중복, 한 장비가 여러 망에 속할 때 필요하다.

## 관리 접속 정보(Access)

백엔드 수집용, 화면에 안 나옴. 관리 주소(LLDP-MIB `lldpLocManAddr`), 수집 방식(SNMP v2c/v3, gNMI), 인증 정보(**참조만, 값은 별도 보관소**), 수집 주기·마지막 수집 결과(UNKNOWN 판정 근거).

## 네트워크 서비스(Network Service)

고객 회선·VPN처럼 여러 노드·링크를 지나는 단위(RFC 8299 L3VPN, RFC 8466 L2VPN). 의존 대상(RFC 9418)으로 장애 영향을 판단한다.

- 표준의 `site`는 고객 접속 단위로, 우리 [[projects/nms/data/site|사이트]](장소)와 뜻이 다르다.
- 이름 충돌: 범위에 넣을 때 우리 서비스는 "애플리케이션 서비스"로 부른다.
