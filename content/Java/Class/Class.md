---
tags:
  - java
  - class
  - oop
---
> 서로 다른 타입의 데이터와 메소드를 정의하여 만든 사용자 정의 자료형(Data type)<br/>
> C++의 Struct와 유사하지만 기능이 추가되었다는 차이점이 있다.

# Syntax
```Java
public class Member {  
    String id;  
    String pwd;  
    String name;  
    int age;  
    char gender;  
    String[] hobby;  
}
```

![[content/Java/Class/assets/class_0.png]]

- stack 영역의 member 변수는 heap 영역에 있는 객체의 주소값을 저장한다.
- 만약 heap 영역의 객체의 자료형이 참조형이라면 객체에는 해당 참조형의 주소값이 저장된다.


# Terms
#### Field
> 클래스 내의 변수<br/>
> [[Encapsulation|캡슐화]]를 통해 직접 접근을 제한할 수 있다.

##### [[Method]]
> 클래스 내의 함수

##### [[Instance]]
> Class 데이터 타입을 통해 생성한 객체

##### [[Abstraction]]
> 공통된 부분을 추출하고 공통되지 않은 부분을 제거함

##### [[Singleton]]
> 어플리케이션이 시작되고 난 후 어떤 클래스의 객체가 최초 한번만 메모리에 할당되고 그 메모리에 인스턴스가 단 하나만 생성되어 공유되게 하는 것

##### [[Inheritance]]
> 부모 클래스를 확장하여 사용하는 기술

##### [[Abstract Class]]
> 추상 메소드를 0개 이상 포함하는 클래스

##### [[content/Java/Class/Interface]]
> 클래스의 변형, 다수의 개발자가 미리 정의된 규칙을 따르도록 하거나 다형성을 적용하여 동적 바인딩을 하기 위해 사용한다.

##### [[content/JAVA/Class/Object]]
> 모든 클래스의 조상