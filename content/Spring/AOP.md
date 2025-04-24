---
tags:
  - java
  - spring
  - aop
---
> Aspect Oriented Programming

## AOP
> 중복되는 공통 코드를 분리하고 코드 실행 전이나 후의 시점에 해당 코드를 삽입함으로써 소스 코드의 중복을 줄이고 필요할 때마다 가져다 쓸 수 있게 객체화하는 기술

## Terms
#### 1. Aspect
> 횡단 관심사 <br/>
> ex. Logging, Security, Transaction

#### 2. Advice
> Aspect의 기능(메소드) 자체를 의미한다.

#### 3. Joint
> Advice가 적용될 수 있는 모든 지점

#### 4. Pointcut
> Joinpoint 중 advice를 적용할 곳을 지정한 것 <br/>
> 해당 조인포인트에서 어드바이스가 동작함.



| 용어         | 설명                                                 |
| ---------- | -------------------------------------------------- |
| Aspect     | 핵심 비즈니스 로직과는 별도로 수행되는 횡단 관심사를 말한다.                 |
| Advice     | Aspect의 기능(메소드) 자체를 말한다.                           |
| Join point | Advice가 적용될 수 있는 위치를 말한다.                          |
| Pointcut   | Join point 중에서 Advice가 적용될 가능성이 있는 부분을 선별한 것을 말한다. |
| Weaving    | Advice를 핵심 비즈니스 로직에 적용하는 것을 말한다.                   |

## Pointcut
>  execution(\[수식어] 리턴타입 \[클래스 이름], 이름(파라미터)) 

#### Syntax
1. 수식어: public, private등 수식어를 명시(생략 가능)  
2. 리턴 타입: 리턴 타입을 명시  
3. 클래스 이름(패키지명 포함) 및 메소드 이름: 클래스 이름과 메소드 이름을 명시  
4. 파라미터(매개변수): 메소드의 파라미터를 명시  
5. " * ": 1개면서 모든 값이 올 수있음  
6. " .. ": 0개 이상의 모든 값이 올 수 있음
#### 표현식 예시
![[content/Spring/assets/Pointcut_00.png]]

## Advice
1. Before Advice: 대상 메소드가 실행되기 이전에 실행
2. After Advice: 대상 메소드가 실행된 후 실행(정상, 예외 관계 X)
3. After Returning Advice: 대상 메소드가 정상적으로 실행된 후 실행
4. After Throwing Advice: 대상 메소드에 예외가 발생한 경우
5. Around Advice: 대상 메소드 실행 전/후에 적용
