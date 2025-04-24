---
tags:
  - database
  - db
  - sql
  - ddl
---
1. GROUP에 대한 조건을 걸기 위해 사용한다.
2. WHERE은 행에 대한 조건, HAVING은 그룹에 대한 조건인 점에서 차이가 난다.

```SQL
SELECT                               
       category_code                 
  FROM tbl_menu                      
 GROUP BY category_code              
HAVING category_code BETWEEN 5 AND 8;
```
