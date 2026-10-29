---
title: 서버에 node_exporter가 설치·실행 중인지 확인하는 방법
type: archive
tags: [archive, node_exporter, prometheus, linux]
draft: true
---

**Q**: 서버에 node_exporter가 설치되어 있는지 어떻게 확인하는가?

**A**:
- 실제 응답 확인(가장 확실): `curl -s localhost:9100/metrics | grep node_exporter_build_info`
- 포트: `ss -lntp | grep 9100`, 프로세스: `ps -ef | grep [n]ode_exporter`
- 서비스: `systemctl status node_exporter` (Debian/Ubuntu 패키지는 `prometheus-node-exporter`)
- 패키지·파일: `dpkg -l | grep node-exporter`, `rpm -qa | grep node_exporter`, `command -v node_exporter`
- 모니터링 서버 쪽: Prometheus Status → Targets 또는 `up{job="node"}`

9100 포트를 다른 프로그램이 쓰는 경우도 있으므로 `/metrics` 응답에 `node_` 지표가 있는지까지 확인한다.
