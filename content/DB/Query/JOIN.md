---
tags:
  - database
  - db
  - sql
---
> 1. 여러개의 Table을 한번에 조회할 때 사용
> 2. 두개 이상의 테이블을 관련있는 컬럼을 통해 결합
> 3. 연관된 컬럼이 반드시 존재해야 하며, 이를 통해 JOIN된 테이블들의 컬럼을 모두 활용할 수 있다.
> 4. JOIN 연산에는 table의 별칭([[ALIAS]])을 붙이는 것이 좋다.(a,b,c,d 순으로 순서 파악을 위해)

# INNER JOIN(Default)
1. 두 테이블의 교집합을 반환하는 SQL JOIN 
2. INNER JOIN 연산시 INNER 생략 가능
3. ON을 사용하여 연관된 Column 명시
```SQL
SELECT
       a.menu_name
     , b.category_name

  FROM tbl_menu a
--  INNER JOIN tbl_category b ON a.category_code = b.category_code;
  JOIN tbl_category b ON a.category_code = b.category_code;
```

# OUTER JOIN
1. 연관된 컬럼이 매핑되지 않아도 결과를 출력할 때 사용
2. Table 순서에 따라 LEFT JOIN, RIGHT JOIN으로 구분
3. . **_LEFT JOIN_**: A에 매핑되는 B의 행이 없어도 결과 출력

```SQL
SELECT 
		 a.category_name
		,b.menu_name
FROM 	 tbl_category a
LEFT JOIN tbl_menu b ON (a.category_code = b.category_code);
```
4. _**RIGHT JOIN**_: B에 매핑되는 A의 행이 없어도 결과 출력

```SQL
SELECT 
		 a.menu_name
		,b.category_name
  FROM tbl_menu a
 RIGHT JOIN tbl_category b ON (a.category_code = b.category_code);
 
```
# CROSS JOIN
1. 일치 조건 없이 모든 경우의 수를 출력한다(cf. Cartesian Product)
2. 의도해서 사용하기 보다는 조건을 잘못 사용해서 생기는 경우가 많다.

# SELF JOIN
1. 자기 자신을 참조하는 JOIN
2. 같은 TABLE 내에 상위 항목과 하위 항목이 같이 있는 경우 사용한다.(ex. 댓글/대댓글) 

```SQL
SELECT 
		 a.category_name
		,b.category_name
  FROM tbl_category a
  JOIN tbl_category b
    ON (a.ref_category_code = b.category_code);
```

# USING
COLUMN 명을 한번만 작성해도 되지만 COLUMN명이 일치하는 **제한된**경우에만 사용 가능하다.
```SQL
SELECT
       a.menu_name
     , b.category_name
  FROM tbl_menu a
--  INNER JOIN tbl_category b USING (category_code);
  JOIN tbl_category b 
  USING (category_code);
```



## [[JOIN 알고리즘]]
>  JOIN 연산의 알고리즘 종류
