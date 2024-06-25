> 1. 두개 이상의 테이블을 관련있는 컬럼을 통해 결합
> 2. 연관된 컬럼이 반드시 존재해야 하며 이를 통해 JOIN된 테이블들의 컬럼을 모두 활용할 수 있다.

### INNER JOIN(Default)
1. 두 테이블의 교집합을 반환하는 SQL JOIN 유형
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

4. USING을 사용하면 COLUMN 명을 한번만 작성해도 되지만 COLUMN명이 일치하는 경우에만 사용 가능
```SQL
SELECT
       a.menu_name
     , b.category_name
  FROM tbl_menu a
--  INNER JOIN tbl_category b USING (category_code);
  JOIN tbl_category b 
  USING (category_code);
```