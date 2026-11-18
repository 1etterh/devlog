---
title: "보안(Security)"
tags:
  - network
  - nms
  - RFC
  - 참고
draft: false
---

NMS는 망의 모든 장비에 접속할 권한과 망 전체의 지도를 가진다. 그래서 **NMS가 뚫리면 망 전체가 뚫린다.** 보안은 [[cs/network/nms/data/topology/index|토폴로지]]와 [[cs/network/nms/data/monitoring/index|감시]] 양쪽에 걸친 관점이라 데이터와 따로 정리한다.

| 문서 | 다루는 것 |
|---|---|
| [[cs/network/nms/security/collection\|수집 경로]] | NMS ↔ 장비 통신: SNMP, trap, syslog, SSH, 인증 정보 보관, 발견(스캔) |
| [[cs/network/nms/security/topology\|토폴로지 데이터]] | 맵·인벤토리 자체: 내부 지도 노출, 접근 권한, LLDP 위조 |
| [[cs/network/nms/security/monitoring\|감시 데이터]] | 측정값·이벤트·경보: 로그 속 민감정보, 경보 폭주, 보관 기간 |

## 관리 평면

장비의 기능은 셋으로 나눈다. NMS가 쓰는 건 **관리 평면**이고, 보호도 여기에 집중한다.

| 평면 | 하는 일 | 예 |
|---|---|---|
| 데이터 평면(data plane) | 사용자 트래픽 전달 | 패킷 포워딩 |
| 제어 평면(control plane) | 경로 계산, 이웃 교환 | OSPF, BGP, LLDP |
| 관리 평면(management plane) | 장비 설정·감시 | SNMP, SSH, syslog, gNMI |

## 기본 원칙

| 원칙 | 내용 |
|---|---|
| 관리망 분리 | 관리 트래픽을 사용자망과 다른 망(OOB, Out-of-Band 관리망 또는 관리 VLAN)으로 보낸다 |
| 접근 제한 | 장비의 SNMP·SSH는 **NMS 주소에서만** 받도록 ACL을 건다 |
| 암호화·인증 | 평문 프로토콜(SNMPv1/v2c, Telnet, UDP syslog)보다 인증·암호화가 있는 것(SNMPv3, SSH, TLS)을 쓴다 |
| 최소 권한 | 수집은 **읽기 전용** 계정으로. 설정 변경 권한은 꼭 필요할 때만 따로 |
| 비밀 분리 | 인증 정보는 토폴로지 데이터에 넣지 않고 별도 보관소에 두고 **참조만** 한다 |
| 감사 | 누가 언제 무엇을 보고 바꿨는지 기록한다 |

## 위협 한눈에

| 위협 | 대상 | 문서 |
|---|---|---|
| 평문 community·비밀번호 도청 | 수집 경로 | [[cs/network/nms/security/collection#snmp\|수집 경로]] |
| trap·syslog 위조 | 수집 경로 | [[cs/network/nms/security/collection#trap--syslog\|수집 경로]] |
| 인증 정보 유출 | NMS 저장소 | [[cs/network/nms/security/collection#인증-정보-보관\|수집 경로]] |
| 내부 지도 노출(정찰) | 토폴로지 데이터 | [[cs/network/nms/security/topology#내부-지도-노출\|토폴로지 데이터]] |
| LLDP 위조로 가짜 링크 | 토폴로지 데이터 | [[cs/network/nms/security/topology#lldp-위조\|토폴로지 데이터]] |
| 로그 속 개인정보 | 감시 데이터 | [[cs/network/nms/security/monitoring#로그-속-민감정보\|감시 데이터]] |
| trap 폭주로 NMS 마비 | 감시 데이터 | [[cs/network/nms/security/monitoring#경보-폭주\|감시 데이터]] |

## 출처 문서

| 문서 | 표준 | 상태 | 쓰는 곳 |
|---|---|---|---|
| SNMPv3 USM | [RFC 3414](https://www.rfc-editor.org/rfc/rfc3414) | Internet Standard | SNMP 사용자 인증·암호화 |
| SNMPv3 VACM | [RFC 3415](https://www.rfc-editor.org/rfc/rfc3415) | Internet Standard | SNMP 읽기 범위 제한 |
| SNMP AES | [RFC 3826](https://www.rfc-editor.org/rfc/rfc3826) | Proposed Standard | SNMPv3 AES 암호화 |
| SNMP over TLS | [RFC 6353](https://www.rfc-editor.org/rfc/rfc6353) | Internet Standard | 인증서 기반 SNMP |
| Syslog over TLS | [RFC 5425](https://www.rfc-editor.org/rfc/rfc5425) | Proposed Standard | 암호화된 syslog |
| NACM | [RFC 8341](https://www.rfc-editor.org/rfc/rfc8341) | Internet Standard | NETCONF/RESTCONF(YANG) 접근 제어 |
| 각 RFC의 Security Considerations | RFC 8345, RFC 8632 등 | — | 데이터 모델별 주의점 |
| CIS Benchmarks | 참고: CIS(Center for Internet Security) | 업계 지침 | 장비별 보안 설정 점검 목록 |
