---
title: MariaDB 덤프 Unknown collation
type: archive
tags: [archive, mariadb, mysql, collation, mysqldump, docker]
draft: true
---

**Q**: MariaDB 덤프를 다른 DB에 복원할 때 `ERROR 1273: Unknown collation: 'utf8mb4_uca1400_ai_ci'`가 나는 이유와 해결 방법은?

**A**:
- **원인**: collation 이름은 엔진·버전마다 다름. 덤프에는 원본 서버의 collation이 그대로 적혀 있어 대상 서버에 없으면 실패
- `utf8mb4_uca1400_ai_ci`는 MariaDB 10.10+ 전용, `utf8mb4_0900_ai_ci`는 MySQL 8.0+ 전용. 공통으로 쓸 수 있는 것은 `utf8mb4_unicode_ci`·`utf8mb4_general_ci`
- MariaDB 11.x 덤프 첫 줄의 `/*M!999999\- enable the sandbox mode */`는 구버전 클라이언트나 MySQL에서 문법 에러를 냄
- **임시 해결**: `sed -e 's/utf8mb4_uca1400_ai_ci/utf8mb4_unicode_ci/g' -e 's/utf8mb4_0900_ai_ci/utf8mb4_unicode_ci/g' -e '/enable the sandbox mode/d' dump.sql > dump_fixed.sql`
- **근본 해결**: 대상 DB 버전을 원본과 맞추거나, 테이블을 처음부터 `utf8mb4_unicode_ci`로 생성

덤프에 어떤 collation이 들어 있는지는 `grep -oE "COLLATE[= ]+[a-z0-9_]+" dump.sql | sort | uniq -c`로 먼저 확인한다.
