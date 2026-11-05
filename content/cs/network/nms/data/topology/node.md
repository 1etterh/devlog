---
title: "노드(Node)"
tags:
  - network
  - nms
  - RFC
  - IEEE
  - 참고
draft: false
---

토폴로지 맵의 점 하나 = **장비** 한 대(스위치·라우터·서버). [[cs/network/nms/data/topology/interface|인터페이스]]와 [[cs/network/nms/data/topology/service|서비스]]가 노드에 속한다. RFC 8345 `node`.

## 정보

### 식별 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| 식별자 | 인터페이스·서비스가 참조하는 키 | RFC 8345 `node-id` |
| 이름 | 장비 호스트명. 장비에서 바꾸면 따라 바뀐다 | SNMPv2-MIB `sysName` |
| 장비 고유값 | 같은 장비인지 가리는 값. IP·이름은 바뀔 수 있다([중복 판별](#중복-판별)) | LLDP-MIB `lldpLocChassisId`, ENTITY-MIB `entPhysicalSerialNum` |

### 논리적 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| 유형 | 망 안에서 맡는 계층·역할([아래](#유형)) | 참고: Cisco 3계층 |
| 장비 종류 | 스위치·라우터·방화벽·무선 AP·서버 등 | SNMPv2-MIB `sysObjectID`, LLDP-MIB `lldpLocSysCapEnabled` |
| 상태 | 장비가 살아 있는지. 표준 값이 없어 제품마다 정한다(ping·SNMP 응답, 경보로 판단) | 표준 없음 |
| 관리 IP | 수집할 때 접속하는 주소 | 등록 값 / 이웃 장비의 LLDP-MIB `lldpRemManAddr` (장비 자신은 `lldpLocManAddr`) |

#### 유형

망 안에서 맡는 **계층·역할**. Cisco 캠퍼스 3계층(Core / Distribution / Access)에 서버(호스트)를 더한 분류가 흔하다.

| 계층 | 의미 | 예 |
|---|---|---|
| 코어(Core) | 망의 중심. 분배 스위치들을 묶고 다른 사이트·인터넷으로 나간다. 빠른 전달이 목적이라 보통 2대로 이중화 | 코어 L3 스위치, 백본 라우터 |
| 분배(Distribution) | 액세스 스위치들을 모아 코어로 올린다. VLAN 간 라우팅·정책을 여기서 건다 | 층·건물 단위 L3 스위치 |
| 액세스(Access) | 단말·서버가 직접 꽂히는 맨 아래 스위치 | 층·랙 단위 L2 스위치 |
| 서버(호스트) | 망을 구성하지 않고 망에 붙는 호스트. [[cs/network/nms/data/topology/service|서비스]](컨테이너·프로세스)가 이 위에서 돈다 | 애플리케이션 서버, DB 서버 |

- 계층(역할)과 **장비 종류**(방화벽·로드밸런서·무선 AP·라우터)는 다른 축이다. 장비 종류는 장비가 알려주지만(`sysObjectID`, LLDP `lldpLocSysCapEnabled` — 이웃 쪽에서 보면 `lldpRemSysCapEnabled`) 계층은 알려주지 않는다.
- 수집기(장비를 발견·조회하는 서버)는 별도 단위가 아니다. 수집기가 깔린 장비도 서버 노드이고, 수집기는 그 노드가 맡은 **역할**이다.

### 물리적 정보

| 항목 | 뜻 | 출처 |
|---|---|---|
| 모델 · 제조사 · 일련번호 | 자산 관리 | ENTITY-MIB `entPhysicalModelName` · `entPhysicalMfgName` · `entPhysicalSerialNum` |
| 소속 사이트 | 장비가 놓인 장소([[cs/network/nms/data/site|사이트]]) | ITU-T M.3100 `locationName` |
| 사이트 안 위치 | 건물·층·랙 | 참고값: SNMPv2-MIB `sysLocation` |

## 수집 방법

| 항목                | 방식  | 1순위                | 대안                                         | 비고                               |
| ----------------- | --- | ------------------ | ------------------------------------------ | -------------------------------- |
| 이름                | 둘 다 | SNMP 폴링 `sysName`  | 수동 입력                                      |                                  |
| 유형 | 수동 | 수동 지정 | — | 망에서의 역할(코어·분배·액세스)은 장비가 알려주지 않는다 |
| 장비 종류 | 둘 다 | `sysObjectID` · LLDP `lldpLocSysCapEnabled`로 추정 | 수동 지정 | `sysDescr`도 참고 |
| 장비 고유값 | 자동 | SNMP 폴링 LLDP-MIB `lldpLocChassisId` | ENTITY-MIB `entPhysicalSerialNum` | 중복 판별에 쓴다 |
| 상태                | 자동  | ping + SNMP 응답 여부  | 경보(trap)                                   |                                  |
| 관리 IP             | 둘 다 | 등록 값(수집 대상 주소)     | 자동 발견: 이웃 장비의 LLDP `lldpRemManAddr`, 대역 스캔 | 수집하려면 이 주소를 먼저 알아야 한다            |
| 모델 · 제조사 · 일련번호   | 자동  | SNMP 폴링 ENTITY-MIB | SSH CLI `show version`                     |                                  |
| 소속 사이트 · 사이트 안 위치 | 수동  | 수동 지정              | `sysLocation` 참고                           | [[cs/network/nms/data/site#수집-방법|사이트 › 수집 방법]]  |

필요한 것: 장비 SNMP 활성화와 접속 정보(v2c 커뮤니티 또는 v3 계정 — v3 권장), 수집 서버 → 장비 UDP 161 · ICMP 허용.

### 등록 경로

수동 등록과 자동 발견을 섞는 게 일반적이다. 사이트·역할은 장비가 알려주지 않으므로 자동 발견한 장비도 운영자가 확인한 뒤 감시 대상에 넣는다.

```
시드 장비 등록 (코어 · 게이트웨이 등)
  → 자동 발견 (아래 방식)
  → 발견 목록 (승인 대기)
  → 운영자 승인: 사이트 · 역할 지정 → 감시 시작
```

| 자동 발견 방식 | 어떻게 | 특징 |
|---|---|---|
| 이웃 따라가기 | 시드 장비의 LLDP·CDP 이웃 테이블에서 상대 관리 주소(`lldpRemManAddr`)를 얻고, 그 장비를 다시 조회하며 퍼져 나간다 | 가장 많이 쓴다. 링크도 함께 얻는다 |
| 대역 스캔 | 지정 IP 대역에 ping + SNMP 요청, 응답하는 장비를 후보로 | LLDP 없는 장비도 찾는다. 대역을 알아야 하고 느리다 |
| ARP · MAC 테이블 | 스위치·라우터 테이블에 보이는 주소를 후보로 | 서버·단말까지 보인다. 장비인지 따로 확인 |
| 모르는 장비의 trap | 등록 안 된 주소에서 온 SNMP trap을 후보로 | 보조 수단 |

- **시드**는 발견을 시작할 장비 IP다. 보통 발견 작업 설정(시드 · IP 범위 · 자격증명 · 깊이 · 주기)의 한 항목으로 둔다.
- 자동 발견에도 SNMP 접속 정보가 필요하다. 미리 등록한 접속 정보 목록을 차례로 시도한다.

### 중복 판별

자동 발견한 장비가 이미 있는 노드인지 아래 순서로 비교한다. IP만 보면 IP가 바뀐 장비가 두 개로 잡힌다.

1. 장비 고유값: LLDP `lldpLocChassisId`, ENTITY-MIB `entPhysicalSerialNum`
2. `sysName`
3. 관리 IP
