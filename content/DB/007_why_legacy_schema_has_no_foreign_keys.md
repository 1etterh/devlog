---
title: 왜 레거시 스키마에는 FK가 없나
type: question
tags: [question, db, mariadb, mysql, innodb, foreign_key, schema_design, polymorphic_association, partitioning]
draft: false
---

## 의문

외부에서 받은 업무 DB 덤프에 테이블이 40개 가까이 있는데 `FOREIGN KEY`가 단 하나도 없다. 로그·큐 테이블이라면 이유를 알겠다([[006_why_no_foreign_key_on_queue_and_audit_log|왜 큐·감사 로그 테이블엔 FK가 없나]]). 그런데 사용자, 조직, 매핑 같은 평범한 테이블까지 FK가 없는 건 왜일까?

## 답

스키마를 자세히 보면 **"FK 없음"을 전제로 설계했다는 단서**가 여러 곳에 남아 있다. 유형별로 나누면 다음과 같다.

### 1. 타입이 달라서 FK를 걸 수가 없다

```sql
CREATE TABLE users       ( seq_id INT    AUTO_INCREMENT PRIMARY KEY, ... );
CREATE TABLE group_user  ( group_id BIGINT, user_id BIGINT, ... );   -- users.seq_id 는 INT
CREATE TABLE groups      ( seq_id BIGINT AUTO_INCREMENT PRIMARY KEY, ... );
CREATE TABLE service_group ( service_id INT, group_id INT, ... );    -- groups.seq_id 는 BIGINT
```

InnoDB는 FK 양쪽 컬럼의 **정수 타입·크기·부호가 같아야** 한다. 다르면 `errno: 150 Foreign key constraint is incorrectly formed`로 거부된다. 처음부터 FK를 걸 생각이었다면 이런 불일치는 생길 수 없다.

### 2. 참조 대상 테이블이 존재하지 않는다

주석에는 `menu_group.seq_id`를 참조한다고 적혀 있는데, 덤프에 그 테이블이 없다. 이름을 바꿨거나 제거한 흔적이다. FK가 있었다면 제거 시점에 에러가 났을 텐데, 없으니 **조용히 깨진 참조**로 남았다.

### 3. 다형(polymorphic) 참조 — FK로 표현이 불가능

```sql
CREATE TABLE attach ( type VARCHAR(255), ref_id BIGINT, ... , KEY (type, ref_id) );
```

`type` 값에 따라 `ref_id`가 공지·Q&A·FAQ 등 서로 다른 테이블을 가리킨다. FK는 테이블 하나만 가리킬 수 있으므로 원천적으로 걸 수 없다.

### 4. 파티션 테이블

```sql
CREATE TABLE log_connect ( ... ) PARTITION BY RANGE COLUMNS(reg_dt) ( ... 월별 ... );
```

MySQL/MariaDB InnoDB는 **파티션 테이블의 FK를 지원하지 않는다**(참조하는 쪽도, 참조되는 쪽도 안 됨). 오래된 월 파티션을 `DROP PARTITION`으로 지우는 운영 방식과도 맞지 않는다.

### 5. 외부 원천에서 일괄 동기화되는 마스터

조직·사용자 테이블에 `org_id`, `org_upper_id`, `src_cd`(출처 코드)가 있고 `group_bulk` 같은 스테이징 테이블도 있다. 외부 인사 시스템에서 **통째로 다시 적재**하는 구조라는 뜻이다. 자기 참조 FK(`upper_group_id → seq_id`)가 있으면 부모부터 순서대로 넣어야 하고, 지우고 다시 넣는 작업도 막힌다.

### 6. 감사 컬럼(`reg_id`, `mod_id`)

거의 모든 테이블에 등록자·수정자 컬럼이 있다. 이걸 사용자 테이블에 FK로 걸면 다음 문제가 생긴다.
- 사용자를 삭제하는 순간 모든 테이블이 막힌다.
- 시스템이나 배치가 쓴 행(`reg_id = 0`)은 넣을 수 없다.

실제로 일부 테이블은 `reg_id`가 `VARCHAR(64)`라서 타입부터 다르다.

### 7. 소프트 삭제 + 애플리케이션 무결성

`status CHAR(1)`, `deleted_dt` 같은 논리 삭제 컬럼이 기본이다. 물리 삭제를 거의 하지 않으니, FK의 핵심 효용인 "삭제 시 고아 행 방지"가 작아진다. 매핑 관계는 서비스 레이어(MyBatis SQL 등)에서 관리한다.

## 정리

| 단서 | 의미 | FK 가능 여부 |
|---|---|---|
| PK `INT` ↔ 참조 컬럼 `BIGINT` | FK 없이 설계됨 | ❌ (타입 불일치) |
| 주석의 참조 테이블이 없음 | 깨진 참조가 방치됨 | ❌ |
| `(type, ref_id)` 쌍 | 다형 참조 | ❌ (구조적 불가) |
| `PARTITION BY` | 파티션 관리 우선 | ❌ (엔진 미지원) |
| `src_cd`, `org_id`, `*_bulk` | 외부 일괄 동기화 | △ (적재 순서 문제) |
| `reg_id`/`mod_id` | 감사 메타데이터 | △ (거의 안 거는 게 관례) |
| 일반 1:N (`notice ↔ reply`) | 순수 컨벤션 | ✅ 걸 수는 있었음 |

마지막 행처럼 FK를 걸 수 있었던 관계도 있지만, 결국 **"무결성은 애플리케이션이 책임진다"는 팀 컨벤션**이 DB 전체에 일관되게 적용된 것이다. 그래서 이런 스키마를 다룰 때 다음 두 가지를 기본으로 전제해야 한다.
- 고아 id나 깨진 참조가 이미 있을 수 있다 → `LEFT JOIN`, NULL 방어.
- 새 테이블을 붙일 때 기존 PK 타입(`INT`인지 `BIGINT`인지)을 먼저 확인한다.
