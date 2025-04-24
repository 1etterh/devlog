---
title: CHECK
description: Structured Query Language
tags:
  - sql
---
> Column의 값을 지정된 범위 내에서만 허용

#### Syntax

```SQL
 CREATE TABLE if NOT EXISTS user_check(
  user_no INT AUTO_INCREMENT PRIMARY KEY 
 ,user_name VARCHAR(255) NOT null
 ,gender VARCHAR(3) CHECK (gender IN('남','여')) -- 남, 여 둘 중에 하나만 허용
 ,age INT CHECK(age>=19) -- 19세 이상만 가입 가능하도록 설정
 ) ENGINE = INNODB;
```
