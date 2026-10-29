---
title: Prometheus·Grafana는 감시 대상 서버마다 설치해야 하는가
type: archive
tags: [archive, prometheus, grafana, node_exporter, monitoring]
draft: true
---

**Q**: Prometheus/Grafana도 감시하려는 서버마다 설치해야 관리할 수 있는가?

**A**:
- 아니다. Prometheus·Alertmanager·Grafana는 모니터링 서버 1대에만 설치한다
- 감시 대상 서버에는 node_exporter(실행 파일 하나, 9100/tcp)만 설치하고, Prometheus가 주기적으로 접속해서 가져간다(pull)
- 대상 서버 방화벽은 9100/tcp를 모니터링 서버 IP에서만 허용
- 설치 없이 보려면 blackbox_exporter(ping·포트·HTTP로 살아있는지만) 또는 SNMP. CPU·메모리까지 보려면 node_exporter가 필요

Zabbix도 대상 서버에는 agent만 설치하는 같은 구조다.
