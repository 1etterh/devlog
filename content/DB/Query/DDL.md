---
tags:
  - database
  - db
  - sql
  - ddl
---

> Data Definition Language
> 공식 정의가 아닌 개발자들끼리 쓰는 관용어

# DDL Commands
## CREATE TABLE
>테이블 생성

```SQL
CREATE TABLE if NOT EXISTS tb1(
 pk INT PRIMARY KEY -- 제약조건
,fk INT
,col1 VARCHAR(255) -- '' 255 byte, varchar: 최대 길이가 255인 문자열
,CHECK(col1 IN ('Y','N')) -- 제약조건 : col1에는 이 두가지 값 중 하나만 들어갈 수 있음
) ENGINE = INNODB;
```

## ALTER
> TABLE 수정

#### Column 추가 

```SQL
ALTER TABLE tb2 ADD col2 INT NOT NULL;
```


#### Column 삭제
```SQL
ALTER TABLE tb2 DROP COLUMN col2;
```

#### Column 이름 및 데이터 형식 변경
```SQL
ALTER TABLE tb2 CHANGE COLUMN fk changed_fk INT NOT NULL;
```


#### 제약 조건 제거
```SQL
ALTER TABLE tb2 DROP PRIMARY KEY; -- 에러남: Auto Increment 어쩌구
-- auto increment 먼저 제거(drop이 아닌 modify)

-- 제약조건 제거(primary key 제약조건 제거 도전)

ALTER TABLE tb2 DROP PRIMARY KEY; -- 에러남: Auto Increment 어쩌구
-- auto increment 먼저 제거(drop이 아닌 modify)
ALTER TABLE tb2 MODIFY pk INT;

DESC tb2;

-- 다시 primary key 제거

ALTER TABLE tb2 DROP PRIMARY KEY;
```


#### Column 여러개 추가하기
```SQL
ALTER TABLE tb2
ADD col3 DATE NOT NULL,			
ADD col4 TINYINT NOT NULL; 

DESC tb2;
```
## TRUNCATE
> TABLE 틀은 남겨두고 데이터만 밀어버릴 때 사용
> 테이블의 초기화
> 테이블 자체 삭제(DROP)과 차이


## DROP
>Table 삭제