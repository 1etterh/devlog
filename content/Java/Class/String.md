---
tags:
  - string
  - java
  - class
---
> 문자열을 저장하고 다양한 메소드를 제공하는 클래스


# String 인스턴스 생성 방식
#### 1. 리터럴 선언
> 리터럴 형태로 선언한 인스턴스는 Heap 영역의 `constant pool`에 저장된다.(불변객체)

```Java
String str1 = "java";
String str2 = "java";
```
![[content/Java/Class/assets/constantpool.png]]
1. str1이 리터럴 형태로 생성되면 str1 객체는 Heap 영역의 `constant pool`에 저장되고 str1에는 그 주소값이 저장된다.
2. str2를 생성할 때 `constant pool`에 같은 값을 가지는 객체가 있으면(`h,e 탐색`) 새로운 객체를 생성하지 않고 str1 객체의 주소값을 복사한다(shallow copy). 
#### 2. 생성자 선언
![[content/Java/Class/assets/String_constructor.png]]

```Java
String str3 = new String("java");  
String str4 = new String("java");
```
> 생성자를 통해 생성하는 경우 두 String 객체는 각자 생성된다.


# immutable
> 문자열은 불변객체라서 변화를 주면 새 인스턴스를 만들고 그 주소값을 저장한다. <br/>
> 더 이상 참조되지 않는 인스턴스는 Garbage Collector가 알아서 처리한다.


# StringBuilder
> String 클래스를 변형한 가변객체(mutable). 길이 변화가 가능하다.
#### Syntax
```Java
        StringBuilder sb = new StringBuilder();  //16byte
        StringBuilder testSb = new StringBuilder("kotlin"); // 6 + 16 => 22byte
//        StringBuilder sb = "java";            // 리터럴 형태로 초기화 불가
```


#### String Buidler 동작 방식
1. StringBuilder를 생성하면 파라미터 길이 + 16byte의 공간을 할당받는다.
2. 후에 할당받은 공간이 부족하면 `용량` \* 2 + 2의 공간을 새로운 객체에 할당받으며, 이 때는 주소값이 바뀐다. 
