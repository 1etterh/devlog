---
title: Prometheus·Alertmanager에 기본으로 들어 있는 UI의 정체
type: archive
tags: [archive, prometheus, alertmanager, monitoring]
draft: true
---

**Q**: Prometheus/Alertmanager 주소로 들어가면 이미 UI가 있는데 이건 무엇인가?

**A**:
- 각 프로그램에 함께 들어 있는 관리·디버깅용 UI (따로 설치하는 게 아님)
- Prometheus: PromQL 쿼리·그래프, Targets(수집 상태), Rules, Alerts, Config, TSDB 상태
- Alertmanager: 현재 알림, Silence(알림 일시 중지) 관리, 설정 상태
- 로그인·권한·대시보드 저장이 없어서 최종 사용자용 화면이 아님 → 보는 화면은 Grafana나 자체 화면이 담당
- 운영자 점검용으로 남겨두되 외부 노출 금지 (필요하면 `--web.config.file`로 기본 인증)
