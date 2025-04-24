---
tags:
  - database
  - db
  - sql
  - ddl
---
# GROUP BY

1. 특정 행을 기준으로 GROUP을 만들어준다.
2. GROUP BY를 사용하여 GROUP 함수를 사용할 수 있다.(SUM, AVG, COUNT, ...)
3. GROUP 지정 없이 함수를 사용하면 표 전체를 GROUP으로 간주한다.
4. COUNT(컬럼명): 해당 컬럼의 NULL이 아닌 행의 갯수
5. COUNT(*): NULL을 포함한 모든 행의 갯수
6. 2개 이상의 COLUMN을 기준으로 그룹 생성 가능


# [[HAVING]]
그룹에 대한 조건

## ROLL UP
1. 중간 합계를 계산할 때 사용
2. GROUP BY _A, B_ WITH _ROLL UP_ :  _A_에 대한 중간 합계 계산 후 에 대한 _A,B_에 대한 최종 합계 계산. 


## CUBE
롤업을 두번 한거