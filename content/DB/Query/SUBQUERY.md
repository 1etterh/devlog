---
tags:
  - database
  - db
  - sql
---
1. QUERY의 결과에 다시 한번 QUERY를 작성하는 경우 사용
2. SUBQUERY 바깥에 있는 QUERY를 MAIN QUERY라고 한다.
3. SUBQUERY의 유형: (다중/단일)행 (다중/단일)열
4. MARIADB는 FROM 에서 SUBQUERY를 사용할 때 반드시 별칭을 달아줘야 함(인라인 뷰라고 함)




```SQL
SELECT 																													-- main query
		  a.menu_name
-- 		 ,category_code
  FROM tbl_menu a
 WHERE category_code = ( SELECT category_code																		-- sub query
 							  	   FROM tbl_menu
 							 	  WHERE menu_name = '민트미역국' -- subquery 전용 들여쓰기 convention
); -- 4

```


