---
title: Grafana는 어떤 DB를 사용하나
type: archive
tags: [archive, grafana, sqlite, database]
draft: true
---

**Q**: Grafana 백엔드는 설정·대시보드를 무슨 DB에 저장하나?

**A**:
- 기본값은 **SQLite** — `/var/lib/grafana/grafana.db` 파일 하나 (별도 DB 서버 불필요)
- 설정으로 **MySQL / PostgreSQL** 로 교체 가능 (`[database]` 섹션 또는 `GF_DATABASE_TYPE`, `GF_DATABASE_HOST` 등 환경변수)
- 단일 인스턴스면 SQLite로 충분, **HA(여러 Grafana 인스턴스)**를 구성하려면 공유 DB(MySQL/PostgreSQL)가 필요
- 저장 대상: 대시보드, 사용자/조직/팀, 데이터소스, 알림 규칙·상태, API 키, 세션 등 — 메트릭 값은 저장하지 않음
- Docker로 띄울 때 `/var/lib/grafana`를 볼륨으로 잡지 않으면 컨테이너 삭제 시 grafana.db도 사라짐
