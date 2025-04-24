---
tags:
  - database
  - db
  - sql
  - ddl
---
> NOT NULL + UNIQUE 제약 조건이라고 볼 수 있다.
> 모든 테이블은 반드시 Primary Key를 가지고 있어야 한다.(레어닉)
> Column Level, Table Level 모두 지정 가능

```SQL
DROP TABLE if EXISTS user_primarykey;
CREATE TABLE if NOT EXISTS user_primarykey(
	user_no  INT PRIMARY KEY 
  ,user_id VARCHAR(255) NOT NULL
  ,user_pwd VARCHAR(255) NOT NULL
  ,user_name VARCHAR(255) NOT NULL
  ,gender VARCHAR(3) -- not null 안걸면 nullable로 자동 지정> 후에 NOT NULL: modify 해야댐
  ,phone VARCHAR(255) NOT NULL
  ,email VARCHAR(255) NOT NULL
  ,UNIQUE(phone)
--   ,PRIMARY KEY (user_no)
) ENGINE = INNODB;

INSERT
  INTO  user_primarykey
       (user_no, user_id, user_pwd, user_name, gender, phone, email)
VALUES 
	 	 (1, 'user_01','pass_01','홍길동','남','010-1234-5678','hong123@gmail.com')
   	,(2, 'user_02','pass_02','유관순','여','010-7777-7777','yu77@gmail.com');
SELECT * FROM user_primarykey;


INSERT
  INTO  user_primarykey
       (user_no, user_id, user_pwd, user_name, gender, phone, email)
VALUES 
	 	 (1, 'user_03','pass_03','홍길동2','남','010-1233-5678','hong124@gmail.com');
SELECT * FROM user_primarykey;


```
