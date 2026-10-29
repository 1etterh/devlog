---
title: Prometheus는 어떤 언어로 작성됐나
type: archive
tags: [archive, prometheus, golang, monitoring]
draft: true
---

**Q**: Prometheus는 무슨 언어로 작성됐나?

**A**:
- 본체(server)는 **Go**로 작성됐다 (2012년 SoundCloud에서 시작, 현재 CNCF 졸업 프로젝트)
- Go라서 의존성 없는 **단일 정적 바이너리**로 배포됨 → 오프라인/폐쇄망 설치가 쉬움
- node_exporter, Alertmanager, Pushgateway, blackbox_exporter 등 공식 컴포넌트도 대부분 Go
- 웹 UI는 React/TypeScript, 서드파티 exporter는 언어 무관 (HTTP `/metrics` 텍스트 포맷만 맞추면 됨)
- 참고로 Grafana도 백엔드 Go + 프론트 TypeScript, Zabbix는 C(서버) + PHP(웹)
