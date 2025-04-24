---
tags:
  - database
  - db
  - sql
---
## SET(집합)
- 중복 제거
- 연산 결과를 세로로 붙일 때 사용
- JOIN연산: 가로로  이어 붙임

### UNION
>합집합(OR)
#### 1. UNION(DEFAULT)
 - 중복된 열은 제외하고 이어 붙인 결과를 출력

#### 2. UNION ALL
- 중복된 열을 포함하여 이어 붙인 결과를 출력

### INTERSECT
>교집합(AND)
>MySQL과 MariaDB는 INTERSECT 지원 X

1. INNER JOIN을 이용한 방법

```SQL

 -- 1) INNER JOIN 활용
 
SELECT 
		 a.menu_code
		,a.menu_name
		,a.menu_price
		,a.category_code
		,a.orderable_status
  FROM tbl_menu a
  INNER JOIN (	SELECT b.menu_code
  							,b.menu_name
  							,b.menu_price
  							,b.category_code
  							,b.orderable_status
  					  FROM tbl_menu b
  					 WHERE b.menu_price < 9000) c ON (a.menu_code = c.menu_code)
  	 WHERE a.category_code = 10
  				 ;
  				 
  				 
  				 

SELECT 
		 a.menu_code
		,a.menu_name
		,a.menu_price
		,a.category_code
		,a.orderable_status
  FROM tbl_menu a
  WHERE a.category_code = 10 AND a.menu_price<9000 ;
```
2. IN 연산자를 활용한 방법
```SQL

-- 2) in 연산자 활용

SELECT
		 a.menu_code
		,a.menu_name
		,a.menu_price
		,a.category_code
		,a.orderable_status
  FROM tbl_menu a
 WHERE a.category_code = 10
 AND a.menu_code IN (SELECT b.menu_code
 							  FROM tbl_menu b
 							 WHERE b.menu_price <9000
 );
 
 
```

### MINUS
>차집합(SUBTRACT)
>MySQL, MariaDB는 지원 X


```SQL
SELECT 
		 a.menu_code
		,a.menu_name
		,a.menu_price
		,a.category_code
		,a.orderable_status
  FROM tbl_menu a
  LEFT JOIN (	SELECT b.menu_code
  							,b.menu_name
  							,b.menu_price
  							,b.category_code
  							,b.orderable_status
  					  FROM tbl_menu b
  					 WHERE b.menu_price < 9000) c ON (a.menu_code = c.menu_code)
  	 WHERE a.category_code = 10
	   AND c.menu_code IS NULL 				 ;
  		
		  
```
