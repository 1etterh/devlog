---
title: SQL
description: Structured Query Language
tags:
  - database
  - sql
  - db
---
# SQL
>_Structured Query Language_
>SQL: DBMS에 데이터 요청 하는 방법
>사용자는 DB에 직접 데이터를 요청하지 않고 DBMS에 SQL을 사용하여 데이터를 요청

![[DBMS 1.png]]

| QUERY        | PRIORITY | OPTIONAL  | DEFAULT | ETC                     |
| ------------ | -------- | --------- | ------- | ----------------------- |
| [[SELECT]]   | 5        | DISTINCT  |         |                         |
| [[FROM]]     | 1        | [[JOIN]]  |         |                         |
| [[WHERE]]    | 2        |           |         | Condition for **ROW**   |
| [[GROUP BY]] | 3        |           |         |                         |
| [[HAVING]]   | 4        |           |         | Condition for **GROUP** |
| [[ORDER BY]] | 6        | [[LIMIT]] | ASC     |                         |


### [[content/DB/Query/Convention|Convention]]
>SQL의 가독성을 위해 지키는 형식


### [[FIELD]]
> 특정 값 우선 정렬

```SQL
SELECT 
       FIELD(orderable_status, 'N', 'Y')
  FROM tbl_menu;
```


### [[SUBQUERY]]
>_SQL의 RESULT SET에서 다시 한번 SQL을 하는 연산_

### [[SET OPERATOR]]


### ANSI
>_DBMS가 지켜야 될 표준_

### [[DML]]
>_Data Manipulation Language_
### [[DDL]]
>_Data Definition Language_
### [[TRANSACTION]]
> 논리적인 일의 단위
### [[VIEW]]

### [[content/DB/Query/INDEX|INDEX]]

### [[TRIGGER]]

### [[CONSTRAINTS]]
> _enforce data integrity_