---
title: Grafana에도 백엔드가 있나
type: archive
tags: [archive, grafana, golang, monitoring]
draft: true
---

**Q**: Grafana는 대시보드 UI 아닌가? 백엔드도 있나?

**A**:
- 있다. `grafana-server`는 **Go 백엔드** + React/TypeScript 프론트로 구성된 웹 애플리케이션
- 브라우저는 Prometheus를 직접 호출하지 않고, Grafana 백엔드가 **데이터소스 프록시/쿼리 실행** 역할을 함 (자격증명이 브라우저에 노출되지 않음)
- 대시보드·사용자·조직·데이터소스 설정을 **자체 DB(기본 SQLite, MySQL/PostgreSQL 가능)**에 저장
- 인증(로그인, LDAP/OAuth), 권한, **Alerting 평가**, 플러그인(백엔드 플러그인은 별도 Go 프로세스) 실행도 담당
- 즉 Grafana 자체는 메트릭을 저장하지 않지만, "UI만 있는 정적 페이지"도 아님
