---
title: "이벤트(Event)"
tags:
  - network
  - nms
  - RFC
  - ITU-T
  - 참고
draft: false
---

**대상 + 시각 + 내용** 하나. "무슨 일이 있었나"를 장비가 먼저 알려주거나(trap · syslog), NMS가 바뀐 것을 알아챈 기록이다. [[cs/network/nms/data/monitoring/metric|측정값]]이 숫자를 쌓는다면 이벤트는 일을 쌓는다.

## 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| 대상 | 어디서 일어났나. 토폴로지 객체를 참조 | trap의 보낸 주소 · 변수(예: `ifIndex`), syslog 호스트명 |
| 종류 | 무슨 일인가 | trap OID(예: `linkDown`), syslog 메시지 |
| 시각 | 언제 | 장비 시각 / NMS 받은 시각(장비 시계가 틀릴 수 있어 둘 다 둔다) |
| 심각도 | 얼마나 중요한가 | syslog severity, 경보로 바꿀 때 정함 |
| 내용 | 원문 | trap 변수 목록, syslog 문장 |

## trap

장비가 일이 생기면 NMS로 바로 보내는 SNMP 알림(보통 UDP 162).

| trap | 뜻 | 출처 |
|---|---|---|
| `linkDown` / `linkUp` | 인터페이스가 내려감 / 올라옴 | IF-MIB |
| `coldStart` / `warmStart` | 장비가 켜짐(재부팅) / 설정을 다시 읽음 | SNMPv2-MIB |
| `authenticationFailure` | 잘못된 community · 인증으로 SNMP 접근 | SNMPv2-MIB |
| 제조사 trap | 팬 고장, 온도 경고, 설정 변경 등 | 제조사 MIB |

- trap은 UDP라 잃어버릴 수 있다. 그래서 **폴링으로 보완**한다(trap을 놓쳐도 다음 폴링 때 `ifOperStatus`로 알아챈다).
- 받는 쪽(NMS)을 장비에 등록해 둬야 보낸다.

## syslog

장비·서버가 로그 문장을 보내는 형식(보통 UDP 514). 심각도 8단계가 있다.

| 값 | 이름 | 예 |
|---|---|---|
| 0 | emergency | 시스템 사용 불가 |
| 1 | alert | 즉시 조치 필요 |
| 2 | critical | 하드웨어 고장 |
| 3 | error | 오류 |
| 4 | warning | 경고 |
| 5 | notice | 정상이지만 눈여겨볼 일(설정 변경, 포트 up/down) |
| 6 | informational | 정보 |
| 7 | debug | 디버그 |

- 문장 형식이 제조사마다 달라 "무슨 일인가"를 뽑으려면 **파싱 규칙**이 필요하다(예: Cisco `%LINK-3-UPDOWN`).
- 로그인 실패·설정 변경처럼 trap으로 잘 안 오는 일이 syslog로 온다.

## 변경 감지

장비가 알려주지 않아도 NMS가 이전 값과 비교해 알아챈다.

| 변경 | 알아채는 방법 |
|---|---|
| 재부팅 | 가동 시간(`sysUpTime`)이 줄어듦 |
| 설정 변경 | 설정 백업(SSH CLI) 비교, syslog 메시지, 제조사 MIB의 마지막 변경 시각 |
| 구성품 변경 | ENTITY-MIB 재수집 시 모델 · 일련번호 · 모듈이 다름 |
| 이웃 변경 | LLDP 이웃이 바뀜 → [[cs/network/nms/data/topology/link|링크]] 추가 · 사라짐 |
| 인터페이스 변경 | IF-MIB 재수집 시 인터페이스가 생기거나 없어짐 |

## 경보(Alarm)

측정값이 임계값을 넘거나 이벤트가 규칙에 맞으면 **경보**가 된다. 이벤트는 쌓이기만 하지만 경보는 **발생 → 해제**가 있는 상태다. 일반적인 NMS는 노드 상태를 저장하지 않고 **해제되지 않은 경보 중 가장 심각한 것**으로 계산한다.

| 항목 | 출처 |
|---|---|
| 대상(resource), 종류(alarmType) — 같은 대상·종류는 경보 1개로 갱신 | RFC 8632 `resource`, `alarm-type-id` |
| 심각도(severity): indeterminate / warning / minor / major / critical | RFC 8632 `perceived-severity` (ITU-T X.733) |
| 해제 여부(cleared), 발생·마지막 발생 시각, 내용 | RFC 8632 `is-cleared`, `time-created`, `last-raised`, `alarm-text` |
| 운영자 처리(ack / 종료 / 보류) | RFC 8632 `operator-state-change` |

- 이벤트와 경보 예: `linkDown` trap(이벤트) → "Gi1/0/1 down" 경보 발생 → `linkUp` trap(이벤트) → 경보 해제.
- 같은 일이 반복되면 경보를 새로 만들지 않고 **횟수 · 마지막 발생 시각**만 갱신한다(경보 폭주 방지).
- **근본 원인 분석**: 코어 스위치가 죽으면 그 아래 장비가 모두 응답하지 않는다. 토폴로지(링크·위아래 관계)로 아래쪽 경보를 "영향 받음"으로 묶어 원인 하나만 보여 준다. 토폴로지 데이터가 감시에 쓰이는 대표적인 자리다.

## 수집 방법

| 항목 | 방식 | 1순위 | 대안 | 비고 |
|---|---|---|---|---|
| trap | 자동 | 장비 → NMS(UDP 162) | 폴링으로 보완 | 장비에 NMS 주소 등록 필요 |
| syslog | 자동 | 장비 → NMS(UDP 514) | — | 파싱 규칙 필요 |
| 변경 감지 | 자동 | 재수집 시 이전 값과 비교 | — | |
| 경보 규칙 · 임계값 | 수동 | 운영자가 정함 | 제품 기본값 | |
