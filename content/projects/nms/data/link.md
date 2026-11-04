---
title: "링크(Link)"
tags:
  - project
  - nms
  - RFC8345
  - RFC2863
  - IEEE802-1AB
  - 자체정의
draft: false
---

두 [[projects/nms/data/node|노드]]의 [[projects/nms/data/interface|인터페이스]]를 잇는 **물리 케이블** 한 가닥. 방향이 없고, 같은 장비 안에서는 생기지 않는다. 같은 장비 쌍이라도 인터페이스가 다르면 여러 개(이중화 회선)일 수 있다.

> RFC 8345 링크는 단방향이라 케이블 하나를 2개로 표현한다. 여기서는 1개로 저장하고 방향을 없앴다([[projects/nms/standard|standard.md]]).

## 논리적 정보

| 항목 | 필수 | 용도 | 출처 |
|---|---|---|---|
| 식별자(id) | O | 저장 시 기존/신규 구분 | RFC 8345 `link-id` |
| 상태(status) | O | 선 색, DOWN은 파선 | 자체 정의 (양 끝 IF-MIB `ifOperStatus`) |
| 생성 방식(origin) | O | DISCOVERED / MANUAL. 수동은 점선, 삭제 가능 | 자체 정의 |

## 물리적 정보

| 항목 | 필수 | 용도 | 출처 |
|---|---|---|---|
| 끝점(endpoints) ×2: nodeId, interfaceId, ifName | O | 양 끝. 순서 무의미. 화면에서 source/target으로 펼친다 | LLDP-MIB `lldpLocPortId` ↔ `lldpRemPortId`, `lldpRemSysName`. 구조는 RFC 8345 `source`/`destination` |
| 대역폭(bandwidth) | - | 툴팁(Mbps), 선 굵기 | IF-MIB `ifHighSpeed` (양 끝 중 작은 값) |
| 사용률·트래픽 | - | 추후 선 굵기·색 | IF-MIB `ifHCInOctets`·`ifHCOutOctets` 증가량 |
