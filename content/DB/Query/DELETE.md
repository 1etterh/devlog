---
tags:
  - database
  - db
  - sql
  - dml
---
> 테이블의 행을 삭제하는 구문
 >테이블의 행의 갯수가 줄어듦
 


### 개수 지정 DELETE
```SQL
DELETE 
  FROM tbl_menu
 ORDER BY menu_price -- 메뉴 가격 기준 오름차순
 LIMIT 2; -- 정렬된 첫 행부터 두개의 행을 삭제
```



