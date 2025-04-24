---
description: 조건부 조회
tags:
  - database
  - db
  - sql
---
# WHERE
1. 조건부 조회
2. WHERE ~를 만족하는 Tuple만 추출
3. FROM에서 지정한 테이블 이후에 추출
4. AND, OR을 사용하여 여러개의 조건 사용 가능
5. 각 행마다 WHERE 조건 검사
## 비교 연산
1. `=` : 두 값이 같은 경우
2. `!=`  `<>`: 두 값이 다른 경우
3. `IS NULL`: NULL인 경우
4. `BETWEEN A and B`: 닫힌 구간 [A, B]에 속해있는 경우
## NOT 연산
1. NOT을 붙이면 조건의 부정이 가능
2. IS NULL : IS NOT NULL을 사용
3. BETWEEN : NOT BETWEEN
## LIKE 연산
1. 문자열을 포함하는 경우나 특정 조건을 만족하는지 검사(완전히 일치하지 않아도 됨)
2. 검색에 많이 쓰인다.(제목 검색, 작성자 검색, 등등)
3. 약간 정규식같음
4. %: wild card(아무 문자열)
5. `_`: 1개의 character
6. `%밥_`: 밥 뒤에 한글자만 오는 아무 문자열

## IN 연산
1. ~~~ 중에 하나를 만족하는 경우
2. or 여러번 쓰는 대신 사용하기 좋음
3.` WHERE x IN (a,b,c)` : x가 a,b,c 중에 하나인 경우