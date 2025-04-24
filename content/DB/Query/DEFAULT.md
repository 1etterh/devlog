---
tags:
  - database
  - db
  - sql
  - ddl
---
> COLUMN의 기본 값을 설정하여 NULL값을 방지할 수 있음


#### Syntax
```SQL
CREATE TABLE if NOT EXISTS tbl_country(
	 country_code INT AUTO_INCREMENT PRIMARY KEY
	,country_name VARCHAR(255) DEFAULT '한국'
	,population VARCHAR(255) DEFAULT '0명'
	,add_day DATE DEFAULT (CURRENT_DATE)
	,add_time DATETIME DEFAULT (CURRENT_TIME)
	) ENGINE = INNODB;
```
