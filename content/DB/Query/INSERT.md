---
tags:
  - database
  - db
  - sql
  - dml
---
>새로운 행을 추가할 때 사용
>테이블의 행의 수가 증가


## INSERT INTO
#### Syntax
```SQL
INSERT 
  INTO *테이블명*
  (
   컬럼1
  ,컬럼2
  ,컬럼3
  
  ) -- 컬럼 명시
  
```

```SQL

INSERT 
  INTO tbl_menu
(				 		 -- menu_code는 auto increment 라서 생략 가능
						 -- column명 생략시 null
  menu_name 
 ,menu_price
 ,category_code
 ,orderable_status
) -- columns, 생략시 전체 column 순서
VALUES
(
	 '초콜릿죽'
	,6500
	,7
	,'Y'
); -- values
```


#### MULTI INSERT
> 여러 개의 행을 한번에 삽입 가능
```SQL

/* MULTI INSERT */

INSERT 
  INTO tbl_menu
VALUES 
(NULL, '참치맛아이스크림',1700,12,'Y'),
(NULL, '멸치맛아이스크림',1500,11,'Y'),
(NULL, '소시지맛아이스크림',2500,8,'Y');



```


#### INSERT DATA 순서
> 기본: Column순
> Column 명시: 명시된  Column 순서대로