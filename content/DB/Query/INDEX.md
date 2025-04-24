---
tags:
  - database
  - db
  - sql
  - ddl
---
> 검색 속도를 향상 시키는 데이터 구조
> 데이터를 빠르게 조회할 수 있는 포인터를 제공
> 주로 WHERE절의 조건이나 JOIN 연산에 사용되는 컬럼에 생성
> PRIMARY KEY는 자동으로 인덱스가 부여됨(고유 식별자)


#### Syntax

1. 인덱스 생성
> CREATE INDEX 인덱스이름 ON 테이블(컬럼명);

```SQL
CREATE INDEX idx_name ON phone(phone_name);
```

2. 인덱스 확인

> SHOW INDEX FROM 테이블

```SQL
SHOW INDEX FROM phone;
```

3. 검색에 인덱스 사용 여부 확인
> EXPLAIN SELECT ~ FROM 테이블 WHERE ~

```SQL
-- 다시 index가 걸린 column으로 조회해서 index를 태웠(활용)는지 확인.
SELECT * FROM phone WHERE phone_name = 'galaxyS24';
EXPLAIN SELECT * FROM phone WHERE phone_name = 'galaxyS24';
```

4. REBUILD를 통한 최적화
> MariaDB는  Optimize 키워드 사용

```SQL
OPTIMIZE TABLE phone;
```

5. INDEX 삭제
> DROP INDEX 인덱스이름 ON 테이블이름

```SQL
DROP INDEX idx_name ON phone;
```
