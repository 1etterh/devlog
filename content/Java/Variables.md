---
tags:
  - java
---
> 데이터를 저장하기 위해 할당받은 메모리 공간<br/>
# 변수의 범위
1. 지역변수
2. 전역변수(필드)
3. 매개변수
4. 클래스(static) 변수


# Data Type(자료형)
> 기본 자료형(primitive)과 참조 자료형(reference)이 있다.

| 유형  | 자료형 | 이름      | 크기  | 비고                      | 선언 및 초기화              |
| --- | --- | ------- | --- | ----------------------- | --------------------- |
| 기본  | 정수  | byte    | 1   |                         |                       |
| 기본  | 정수  | short   | 2   |                         |                       |
| 기본  | 정수  | int     | 4   | _default_               |                       |
| 기본  | 정수  | long    | 8   | 자료형 명시                  | long num1 = 1000000L; |
| 기본  | 실수  | float   | 4   | 자료형 명시                  | float num2 = 4.12f;   |
| 기본  | 실수  | double  | 8   | _default_               |                       |
| 기본  | 문자  | char    | 2   | INT와 호환 가능              | 'Single Quotation'    |
| 기본  | 논리  | boolean | 1   | true, false만 가능(0,1 안됨) |                       |
| 참조  | 문자열 | String  | 4   | 사실 Class임               | "Double Quotation"    |

> 같은 자료형끼리 연산하면 결과도 같은 자료형으로 나온다.

```Java
double fNum = 10/3;  //3
double fNum2 = 10/3.0 // 3.333333...
```

- 실수형은 정수형보다 부정확하지만(버림처리) 큰 범위의 값을 저장할 수 있다.
- char은 예외적으로 INT와 같이 사용이 가능하다.
# Literal
> 변하지 않는 값

```
//x는 변수, 5는 리터럴
int x = 5;
```


# CONSTANT(상수)
> 한번 저장하면 변하지 않는 값(뚜껑을 닫아버리는거임...)

# references

### [[content/JAVA/Convention|Convention]]
> 변수의 명명규칙

### [[Overflow]]
> 용량이 초과돼서 생기는 Runtime Error

#### [[Type Casting]]
> 자료형 변환(값을 넣는 박스를 바꾸는거임)
