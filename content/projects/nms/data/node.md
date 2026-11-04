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

| 항목 | 필수 | 용도 | 출처 |
|---|---|---|---|
| 식별자(id) | O | 인터페이스가 참조. ECharts `name`에도 id를 넣어 표시명 중복을 피한다 | RFC 8345 `node-id` |
| 이름(name) | O | 라벨·툴팁 | SNMPv2-MIB `sysName` |
| 유형(type) | O | core / dist / access / server. 범례·모양·크기 | 자체 정의 (참고: Cisco 3계층) |
| 상태(status) | O | UP / WARN / DOWN / UNKNOWN. 색 | 자체 정의 (ping·SNMP 응답) |
| IP 주소(ip) | - | 관리 IP | LLDP-MIB `lldpLocManAddr` 또는 등록 값 |

## 물리적 정보

| 항목 | 필수 | 용도 | 출처 |
|---|---|---|---|
| 모델(model) · 제조사(vendor) · 일련번호(serialNo) | - | 상세 표시, 자산 관리 | ENTITY-MIB `entPhysicalModelName` · `entPhysicalMfgName` · `entPhysicalSerialNum` |
| 소속 사이트(siteId) | - | [[projects/nms/data/site|사이트]]. 없으면 지도에 안 나옴("위치 미지정") | 자체 정의 (사람이 지정) |
| 사이트 안 위치(sitePosition) | - | 건물·층·랙 자유 문자열 | 참고값: SNMPv2-MIB `sysLocation` |
