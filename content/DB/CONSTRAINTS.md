
> Column의 값에 부여되는 제약 조건
> 조건 부여 위치에 따라 COLUMN LEVEL, TABLE LEVEL 으로 구분 가능  


## NOT NULL
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


## UNIQUE
> 중복 값이 들어가지 않도록 하는 제약 조건
> Column Level, Table Level 모두 가능


```SQL

DROP TABLE if EXISTS user_unique;
CREATE TABLE if NOT EXISTS user_unique(
	user_no  INT NOT NULL UNIQUE
  ,user_id VARCHAR(255) NOT NULL
  ,user_pwd VARCHAR(255) NOT NULL
  ,user_name VARCHAR(255) NOT NULL
  ,gender VARCHAR(3) -- not null 안걸면 nullable로 자동 지정> 후에 NOT NULL: modify 해야댐
  ,phone VARCHAR(255) NOT NULL
  ,email VARCHAR(255) NOT NULL
  ,UNIQUE(phone)
) ENGINE = INNODB;

INSERT
  INTO  user_unique
       (user_no, user_id, user_pwd, user_name, gender, phone, email)
VALUES 
	 	 (1, 'user_01','pass_01','홍길동','남','010-1234-5678','hong123@gmail.com')
   	,(2, 'user_02','pass_02','유관순','여','010-7777-7777','yu77@gmail.com');
SELECT * FROM user_notnull;


INSERT
  INTO  user_unique
       (user_no, user_id, user_pwd, user_name, gender, phone, email)
VALUES 
	 	 (3, 'user_03','pass_03','홍길동2','남','010-1234-5678','hong123@gmail.com');
SELECT * FROM user_unique;

```


## PRIMARY KEY
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

## FOREIGN KEY

