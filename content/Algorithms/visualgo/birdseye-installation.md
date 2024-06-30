---
title: "[Python] birdseye 설치/실행"
tags:
  - algorithms
  - python
  - birdseye
---
#### birdseye
1. _Python_ 알고리즘 시각화 라이브러리
2. 함수 추적 가능

#### 사용법

###### 1. 설치

```
pip install birdseye
```

###### 2. 테스트 코드 작성 / 실행

```
#example.py
from birdseye import eye

@eye
def calculate_sum(a, b):
    total = a + b
    return total

result = calculate_sum(5, 3)

```

###### 3. cmd에 birdseye 실행

```
>birdseye
```


###### 4. [로컬 서버](http://127.0.0.1:7777/)로 접속



#### 작동 원리
#### Tracking Execution

###### 1. Tracking Functions & Local Variables & Expressions
>*함수 내 지역변수와 선언문 추적*

1. AST 수정
	1. _Code Instrumentation_ : AST의 일부 노드 수정
	2. _Function Wrapping_ :  target 함수를 birdseye에서 생성한 함수를 통해 기능 확장
2. Data 수집
	1. _Recording Values_ : 코드 실행시 target 함수 내의 모든 변수, 선언문 저장
	2. _Serialization_ : 웹페이지에서 랜더링하기 위해 저장된 변수를 직렬화


###### 2. Tracking Loops and Conditionals

> *반복문과 조건 추적*

1. AST 변환
	1. _LoopNodes_ : Loop노드를 수정하여 tracking log를 반복문의 앞뒤로 추가
	2. _Conditional Nodes_ : 조건문 추적을 위해 tracking log를 추가
2. 실행값 추적
	1. _Branch Execution Count_ : 분기점 실행 횟수 추적
	2. _Condition Evaluation_ : 조건문 추적을 통해 코드 실행 분석

