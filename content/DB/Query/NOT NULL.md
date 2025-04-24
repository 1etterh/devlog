---
tags:
  - database
  - db
  - sql
  - ddl
---
> Column Level에서만 지정 가능
> 지정하지 않으면 NULLABLE(Default)상태로 지정되어 후에 NOT NULL 옵션 설정시 Modify 해야됨


```SQL

DROP TABLE if EXISTS user_notnull;
CREATE TABLE if NOT EXISTS user_notnull(
	user_no  INT NOT NULL
  ,user_id VARCHAR(255) NOT NULL
  ,user_pwd VARCHAR(255) NOT NULL
  ,user_name VARCHAR(255) NOT NULL
  ,gender VARCHAR(3) -- not null 안걸면 nullable로 자동 지정> 후에 NOT NULL: modify 해야댐
  ,phone VARCHAR(255) NOT NULL
  ,email VARCHAR(255) NOT NULL
) ENGINE = INNODB;

INSERT
  INTO  user_notnull
       (user_no, user_id, user_pwd, user_name, gender, phone, email)
VALUES 
	 	 (1, 'user_01','pass_01','홍길동','남','010-1234-5678','hong123@gmail.com')
   	,(2, 'user_02','pass_02','유관순','여','010-7777-7777','yu77@gmail.com');
SELECT * FROM user_notnull;




INSERT
  INTO  user_notnull
       (user_no, user_id, user_pwd, user_name, gender, phone, email)
VALUES 
	 	 (3, 'user_03','pass_03',NULL,'남','010-1234-5678','hong123@gmail.com');
SELECT * FROM user_notnull;

```
