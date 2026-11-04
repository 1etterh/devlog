---
title: "노드(Node)"
tags:
  - project
  - nms
  - RFC8345
  - RFC3418
  - RFC6933
  - IEEE802-1AB
  - 참고/Cisco
  - 자체정의
draft: false
---

맵의 점 하나 = **장비** 한 대(스위치·라우터·서버). [[projects/nms/data/interface|인터페이스]]와 [[projects/nms/data/service|서비스]]가 노드에 소속된다.

## 논리적 정보

| 항목         | 필수  | 용도                                             | 출처                                |
| ---------- | --- | ---------------------------------------------- | --------------------------------- |
| 식별자(id)    | O   | 인터페이스가 참조. ECharts `name`에도 id를 넣어 표시명 중복을 피한다 | RFC 8345 `node-id`                |
| 이름(name)   | O   | 라벨·툴팁                                          | SNMPv2-MIB `sysName`              |
| 유형(type)   | O   | core / dist / access / server. 범례·모양·크기        | 자체 정의 (참고: Cisco 3계층)             |
| 상태(status) | O   | UP / WARN / DOWN / UNKNOWN. 색                  | 자체 정의 (ping·SNMP 응답)              |
| IP 주소(ip)  | -   | 관리 IP                                          | LLDP-MIB `lldpLocManAddr` 또는 등록 값 |
|            |     |                                                |                                   |

### 유형(type)

망 안에서 맡는 **계층·역할**이다. Cisco 3계층(Core / Distribution / Access)에 서버를 더했다.

| 값        | 이름               | 의미                                                           | 예                 |
| -------- | ---------------- | ------------------------------------------------------------ | ----------------- |
| `core`   | 코어               | 망의 중심. 분배 스위치들을 묶고 다른 사이트·인터넷으로 나간다. 빠른 전달이 목적이라 보통 2대로 이중화  | 코어 L3 스위치, 백본 라우터 |
| `dist`   | 분배(distribution) | 액세스 스위치들을 모아 코어로 올린다. VLAN 간 라우팅·정책을 여기서 건다                  | 층·건물 단위 L3 스위치    |
| `access` | 액세스              | 단말·서버가 직접 꽂히는 맨 아래 스위치                                       | 층·랙 단위 L2 스위치     |
| `server` | 서버               | 망을 구성하지 않고 망에 붙는 호스트. [[projects/nms/data/service|서비스]](컨테이너·프로세스)가 이 위에서 돈다 | 중계 서버, DB 서버      |

방화벽·로드밸런서·무선 AP·라우터처럼 계층이 아니라 **장비 종류**로 구분되는 장비는 지금 유형에 없다. 넣을 때는 계층(`layer`)과 장비 종류(`deviceType`)를 나눠 두는 것을 검토한다.

## 물리적 정보

| 항목 | 필수 | 용도 | 출처 |
|---|---|---|---|
| 모델(model) · 제조사(vendor) · 일련번호(serialNo) | - | 상세 표시, 자산 관리 | ENTITY-MIB `entPhysicalModelName` · `entPhysicalMfgName` · `entPhysicalSerialNum` |
| 소속 사이트(siteId) | - | [[projects/nms/data/site|사이트]]. 없으면 지도에 안 나옴("위치 미지정") | 자체 정의 (사람이 지정) |
| 사이트 안 위치(sitePosition) | - | 건물·층·랙 자유 문자열 | 참고값: SNMPv2-MIB `sysLocation` |

## 수집 방법

| 항목                | 1순위                | 대안                                   | 비고                               |
| ----------------- | ------------------ | ------------------------------------ | -------------------------------- |
| 식별자(id)           | 백엔드가 등록 시 부여       | —                                    | 수집 값이 아님                         |
| 이름(name)          | SNMP 폴링 `sysName`  | 수동 입력                                |                                  |
| 유형(type)          | 수동 지정              | `sysObjectID` · `sysDescr`로 장비 종류 추정 | 망에서의 역할(코어·분배·액세스)은 장비가 알려주지 않는다 |
| 상태(status)        | ping + SNMP 응답 여부  | —                                    | 판정 기준은 자체 정의                     |
| IP 주소(ip)         | 등록 값(수집 대상 주소)     | LLDP `lldpLocManAddr`                | 수집하려면 이 주소를 먼저 알아야 한다            |
| 모델 · 제조사 · 일련번호   | SNMP 폴링 ENTITY-MIB | SSH CLI `show version`               |                                  |
| 소속 사이트 · 사이트 안 위치 | 수동 지정              | `sysLocation` 참고                     | [[projects/nms/data/site#수집-방법|사이트 › 수집 방법]]     |

필요한 것: 장비 SNMP 활성화와 접속 정보(v2c 커뮤니티 또는 v3 계정 — v3 권장), 수집 서버 → 장비 UDP 161 · ICMP 허용.
