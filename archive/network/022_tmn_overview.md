---
title: TMN 모델 요약
type: archive
tags: [archive, network, tmn, network_management, fcaps]
draft: true
---

**Q**: TMN은 무엇이고, 쇠퇴했는데도 무엇이 남았나?

**A**:
- ITU-T M.3000 시리즈(1988 M.30 → 1992 M.3010)로 정의된 통신망 관리 참조 모델
- 논리 계층 BML·SML·NML·EML·NEL → 오늘날 BSS·OSS·NMS·EMS 구분의 출처
- 기능(OSF·NEF·MF·QAF·WSF), 물리(OS·NE·MD·QA·WS·DCN, Q3·Qx·F·X), 정보(Manager/Agent, CMIP, GDMO) 구조로 설명
- Q3·CMIP·OSI 스택은 무겁고 비싸 SNMP·CORBA·REST에 밀려 사라짐
- 계층 개념, FCAPS(M.3400), X.733 알람 모델, Manager/Agent는 지금 표준에 그대로 남음

OSI 7계층처럼 "프로토콜은 졌지만 모델·용어는 남은" 경우다. NMS는 역할이라 구현 기술만 바뀌며 존속한다.
