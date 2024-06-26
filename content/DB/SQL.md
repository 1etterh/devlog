---
title: SQL
description: Structured Query Language
tags:
  - database
  - sql
  - db
---



- [[DBMS]]: 창고지기 같은거
- DB: 창고
- SQL: DBMS에 데이터 요청 하는 방법
- 사용자는 DB에 직접 데이터를 요청하지 않고 DBMS를 통해 요청
- 아무래도 권한 문제나 다양한 문제가 있으니 DBMS를 사용하는듯 


![[DBMS.png]]

| QUERY        | PRIORITY | OPTIONAL  | DEFAULT | ETC                     |
| ------------ | -------- | --------- | ------- | ----------------------- |
| [[SELECT]]   | 5        | DISTINCT  |         |                         |
| [[FROM]]     | 1        | [[JOIN]]  |         |                         |
| [[WHERE]]    | 2        |           |         | Condition for **ROW**   |
| [[GROUP BY]] | 3        |           |         |                         |
| [[HAVING]]   | 4        |           |         | Condition for **GROUP** |
| [[ORDER BY]] | 6        | [[LIMIT]] | ASC     |                         |


### [[Convention]]
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

