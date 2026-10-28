---
title: 왜 레거시 스키마엔 FK가 없나
type: archive
tags: [archive, db, mariadb, mysql, innodb, foreign_key, schema_design, polymorphic_association, partitioning]
draft: true
---

**Q**: 로그·큐 테이블도 아닌 사용자·조직·매핑 같은 평범한 테이블까지 레거시 스키마 전체에 FK가 하나도 없는 이유는?

**A**:
- **타입 불일치**: PK는 `INT`, 참조 컬럼은 `BIGINT`처럼 서로 달라 InnoDB가 FK를 거부함 (`errno: 150`). 처음부터 FK를 쓸 생각이 없었다는 단서
- **구조적으로 불가능**: `(type, ref_id)` 다형 참조는 테이블 하나만 가리킬 수 있는 FK로 표현할 수 없고, 파티션 테이블은 InnoDB가 FK를 지원하지 않음
- **운영 방식과 충돌**: 외부 원천에서 통째로 다시 적재하는 마스터 테이블은 자기 참조 FK가 있으면 적재 순서가 막힘. `reg_id`·`mod_id` 같은 감사 컬럼은 FK를 걸지 않는 것이 관례
- **소프트 삭제 + 애플리케이션 무결성**: 물리 삭제를 거의 하지 않아 FK의 효용이 작고, 무결성은 서비스 레이어가 책임지는 팀 컨벤션
- **결과**: 참조 대상 테이블이 사라져도 에러 없이 깨진 참조로 남음

이런 스키마를 다룰 때는 고아 id가 이미 있다고 가정하고(`LEFT JOIN`, NULL 방어), 새 테이블을 붙이기 전에 기존 PK 타입부터 확인한다.
