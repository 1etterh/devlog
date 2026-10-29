---
title: Prometheus·Alertmanager는 DB로 무엇을 쓰는가
type: archive
tags: [archive, prometheus, alertmanager, tsdb, monitoring]
draft: true
---

**Q**: Prometheus와 Alertmanager는 DB로 무엇을 쓰는가?

**A**:
- Prometheus: 외부 DB 없이 내장 시계열 DB(TSDB)에 로컬 파일로 저장 (메모리 head + WAL → 2시간 블록 → 합치기 → 보관기간이 지나면 삭제). SQL은 없고 PromQL로만 조회
- 서버 1대의 로컬 디스크에만 저장되고 이중화·장기 보관이 없음 → 필요하면 `remote_write`로 VictoriaMetrics·Thanos·Mimir에 함께 보냄
- Alertmanager: DB 없음. `silences`, `nflog`(전송 기록) 파일만 있고, 현재 알림은 메모리에만 있음 (Prometheus가 계속 다시 보내서 재시작해도 복구됨)
- 알림 이력, 서버 메타데이터, 사용자 정보를 저장할 곳이 없음 → 자체 화면을 만든다면 BFF가 쓸 DB(SQLite·PostgreSQL)를 따로 둬야 함

Zabbix가 PostgreSQL에 수집값·설정·이벤트를 모두 저장하는 것과 대조적이다.
