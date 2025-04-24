---
tags:
  - database
  - db
  - sql
---
# ORDER BY ASC(default)
- 오름차순 정렬
- ORDER BY를 입력하면 기본적으로 오름차순 정렬값이 결과로 출력됨
- column명 대신 별명([[ALIAS]])나 select절의 column 순서(1,2,3, ...)를 써도 됨
- NULL값의 경우 기본적으로  맨 앞에 배치
- 여러개의 column을 기준으로 정렬할 경우 왼쪽부터 우선 적용
# ORDER BY DESC
1. 내림차순으로 정렬
2. NULL값은 기본적으로 맨 뒤에 배치



# NULL 순서 바꾸기(참고)

###### 오름차순에서 NULL이 나중에 나오도록 하려면
```SQL
SELECT 
		 *
FROM 	 tbl_category
ORDER BY -ref_category_code DESC; -- desc를 통해 NULL을 뒤로 보내고 '-'로 desc와 반대로 진행(asc)
	
```
	
###### 내림차순에서 NULL이 먼저 나오도록 하려면
```SQL
SELECT 
		*
FROM 	 tbl_category
ORDER BY -ref_category_code ASC;				
```