---
tags:
  - java
  - class
  - oop
draft: true
---
> 하나의 인스턴스가 여러가지 타입을 가질 수 있음을 의미한다. <br/>
> 상속 관계의 객체들간의 형 변환을 의미하며, 상위 객체 배열을 통해 다수의 인스턴스를 연속 처리할 수 있다.


![[Java/Class/assets/Polymorphism_0.png]]

> Class D 는 세가지 타입으로 정의될 수 있다.(A,B,D)

![[Java/Class/assets/Polymorphism_1.png]]


### [[Dynamic Binding|동적 바인딩]]
> 컴파일 당시에는 해당 타입의 메소드와 연결되어 있다가 런타임 시점에 실제 객체가 가진 오버라이딩 된 메소드로 바인딩이 바뀌어 동작하는 것

## 관련 문서
- [[OOP|OOP]] - 다형성은 OOP 4대 특징 중 하나
- [[Inheritance|상속]] - 다형성의 전제 조건
- [[Overriding|오버라이딩]] - 다형성이 동작하는 핵심 메커니즘
- [[Interface|인터페이스]] - 다형성을 활용한 다중 타입 구현
- [[Abstract Class|추상 클래스]] - 다형성을 활용한 부분 추상화
