---
tags:
  - java
  - class
  - oop
---
> 하나의 인스턴스가 여러가지 타입을 가질 수 있음을 의미한다. <br/>
> 상속 관계의 객체들간의 형 변환을 의미하며, 상위 객체 배열을 통해 다수의 인스턴스를 연속 처리할 수 있다.


![[content/Java/Class/assets/Polymorphism_0.png]]

> Class D 는 세가지 타입으로 정의될 수 있다.(A,B,D)

![[content/Java/Class/assets/Polymorphism_1.png]]


### [[Dynamic Binding|동적 바인딩]]
> 컴파일 당시에는 해당 타입의 메소드와 연결되어 있다가 런타임 시점에 실제 객체가 가진 오버라이딩 된 메소드로 바인딩이 바뀌어 동작하는 것
