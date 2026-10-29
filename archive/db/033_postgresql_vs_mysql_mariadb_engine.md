---
title: PostgreSQL vs MySQL/MariaDB 엔진 구조 비교
type: archive
tags: [archive, db, postgresql, mysql, mariadb, innodb, mvcc]
draft: true
---

**Q**: PostgreSQL과 MySQL(MariaDB)은 엔진 구조가 어떻게 다른가?

**A**:
- 연결 모델: PG는 연결당 프로세스를 띄우므로 연결이 많으면 PgBouncer 같은 풀러가 필요하다. MySQL은 연결당 스레드를 쓴다
- MVCC: PG는 UPDATE 때 heap에 새 튜플을 추가하고 VACUUM으로 회수한다(bloat, XID wraparound 주의). InnoDB는 행을 제자리에서 갱신하고 이전 값을 undo log에 둔 뒤 purge로 정리한다(긴 트랜잭션이 있으면 undo가 쌓임)
- 저장 구조: InnoDB는 클러스터드 인덱스(PK가 곧 테이블)이고 보조 인덱스는 PK를 가리킨다. PG는 heap 테이블에 인덱스가 ctid를 가리키며, UPDATE 때마다 모든 인덱스를 갱신한다(HOT이면 예외)
- 로그·복제: PG는 WAL 하나로 물리 복제와 논리 복제를 모두 한다. MySQL은 redo + undo + binlog를 2PC로 맞추고, 복제는 binlog 기반이다
- 격리 수준: PG 기본은 RC이고 Serializable은 SSI로 구현한다. 트랜잭셔널 DDL을 지원한다. InnoDB 기본은 RR이며 gap/next-key lock을 쓰고, UPDATE는 최신값을 읽는 current read로 동작한다

선택 기준: 복잡한 쿼리, 확장(PostGIS, pgvector, TimescaleDB), 엄격한 정합성이 필요하면 PG가 유리하다. PK 위주의 단순 OLTP, 연결이 많은 환경, binlog/Galera 생태계가 필요하면 MySQL 계열이 유리하다. MariaDB는 JSON 타입, GTID 형식, 엔진 구성이 달라서 MySQL의 드롭인 대체로 볼 수 없다.
