---
tags:
  - database
  - db
  - sql
---
1.  조회할 Column을 지정
2. SELECT * : 모든 Column을 추출
3. [[ALIAS]]
	1. 별명같은거
	2. as는 생략 가능
	3. ex) SELECT X as Y
	4. ex) SELECT X Y
		
4. , 로 구분
5. 후에 SELECT에 나열된 column의 인덱스를 사용하여 ORDER BY 가능

```SQL
SELECT category_code
	  ,category_name
  FROM tbl_category
  ORDER BY 1; -- === order by category_code
```


## DISTINCT

1. 중복되지 않는 값을 출력
2. 다중 행을 사용한 DISTINCT도 사용 가능

```SQL
SELECT	 
			 category_code
			,orderable_status
FROM		 tbl_menu;
```

```SQL
SELECT	 
			 DISTINCT
			 category_code
			,orderable_status
FROM		 tbl_menu;
```