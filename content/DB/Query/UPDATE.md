---
tags:
  - database
  - db
  - sql
---
> 기존 테이블에 있던 값을 수정
> 행의 갯수에는 영향x

#### UPDATE
```SQL

SELECT *
  FROM tbl_menu
 WHERE menu_name = '소시지맛커피';
 
UPDATE tbl_menu
   SET menu_name = '소시지맛커피'
 WHERE menu_code = 25;
 
 
```

#### UPDATE w SUBQUERY
> MySQL은 update나 delete시 자기 자신의 테이블의 데이터 사용시 에러 발생
```SQL
UPDATE tbl_menu
   SET category_code = 6
 WHERE menu_code = (SELECT menu_code
 							 FROM tbl_menu
 							WHERE menu_name = '소시지맛커피'
 ); 
```

