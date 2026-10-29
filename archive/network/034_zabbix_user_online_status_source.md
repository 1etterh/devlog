---
title: Zabbix 사용자 Is online 값은 DB에 저장되는가
type: archive
tags: [archive, network, zabbix, session, user_online_status]
draft: true
---

**Q**: Zabbix 사용자 목록의 Is online? 값은 users 테이블에 저장되는 컬럼인가?

**A**:
- 아니다. users 테이블에는 online 관련 컬럼이 없고, 화면을 렌더링할 때마다 계산되는 파생값이다
- 근거 데이터는 sessions 테이블(userid, status, lastaccess)이다. status 0은 활성, 1은 로그아웃이고, lastaccess는 웹 요청마다 갱신된다
- 사용자별로 lastaccess가 가장 최근인 세션을 골라, 활성 상태 + 사용자 그룹 Enabled + `lastaccess + online_time >= now`이면 Yes로 표시한다
- online_time은 `ZBX_USER_ONLINE_TIME`(600초)과 사용자 autologout 중 작은 값이다 (autologout이 0이면 600초)

브라우저를 그냥 닫아 세션이 남아 있어도 10분(또는 autologout 시간) 동안 요청이 없으면 No가 된다.
