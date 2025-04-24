---
tags:
  - database
  - db
  - sql
  - rdbms
  - references
  - foreignkey
---
> 다른 테이블의 Primary Key 를 참조하는 Column을 Foreign Key로 선언
> 다른 두 테이블의 상호 연관 관계 명시 
> 데이터의 참조 무결성을 보장


# 테이블 참조 관계
> 부모(1): Primary  Key 
> 자식(N): Foreign Key
> 한 부모가 자식을 여러 개 가질 수는 있지만 한 자식이 부모를 여러 개 가질 수는 없음

#### Syntax

```SQL
CREATE TABLE IF NOT EXISTS USER_FOREIGNKEY1(
 user_no INT PRIMARY KEY
,user_id VARCHAR(255) NOT NULL
,user_pwd VARCHAR(255) NOT NULL
,user_name VARCHAR(255) NOT NULL
,gender VARCHAR(3) NOT NULL
,phone VARCHAR(255) NOT NULL
,email VARCHAR(255) NOT NULL
,grade_code INT
,FOREIGN KEY (grade_code) REFERENCES user_grade(grade_code)
-- 부모 테이블의 PK는 생략 가능 
-- FOREIGN KEY (grade_code) REFERENCES user_grade
)ENGINE = INNODB;
```


#### Foreign Key 제약 조건
> _foreign key_ 제약 조건이 걸린 Column은 부모 테이블의 PK값+ NULL까지 들어갈 수 있다. 
> 부모 테이블의 PK값에 없는 값은 들어갈 수 없음
#### 부모 테이블의 값 삭제 시
> 참조되지 않은 값은 삭제 가능
> 이미 참조된 값은 삭제 불가(or 삭제 rule 적용)


#### 삭제 룰을 적용한 Foreign Key 제약 조건 작성

1. 부모 테이블의 값이 삭제되면 NULL로 수정(ON DELETE SET NULL)
2. 연쇄적으로 삭제(CASCADE)
3. [_foreign-keys documentation_](https://mariadb.com/kb/en/foreign-keys/)

```SQL
CREATE TABLE if NOT EXISTS user_foreignkey2(
	user_no  INT PRIMARY KEY 
  ,user_id VARCHAR(255) NOT NULL
  ,user_pwd VARCHAR(255) NOT NULL
  ,user_name VARCHAR(255) NOT NULL
  ,gender VARCHAR(3) 
  ,phone VARCHAR(255) NOT NULL
  ,email VARCHAR(255) NOT NULL
  ,grade_code INT
  ,FOREIGN KEY  (grade_code) REFERENCES user_grade(grade_code) -- 삭제 룰 추가
  ON DELETE SET NULL -- 삭제되면 NULL값으로 세팅되게 해라 
  -- SET NULL 대신 CASCADE: 연쇄작용으로 다같이 삭제됨
) ENGINE = INNODB;
```





