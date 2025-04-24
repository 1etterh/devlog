---
tags:
  - java
  - class
  - interface
---
> 추상 메소드(abstract method)와 상수 필드(public static final)만 가질 수 있는 클래스의 변형체<br/>
> 객체를 생성할 수 없다.

# Interface
> 다수의 개발자가 협업 시 통일성을 위해 미리 정의된 인터페이스에 따라 코드를 작성한다.
# Syntax
```Java
public interface InterProduct extends ParentInterProduct, AnotherParentInterProduct{  
    public static final int MAX_NUM = 100; 
    void nonStaticMethod();  
}
```
#### static, default
> JDK 1.8부터 static, default, private 메소드에 한하여 메소드의 body 부분을 작성하는 것을 허용했다. (예외사항)

```Java
	public static void staticMethod(){}  
  
    public default void defaultMethod() {}  
  
    /* 설명. private도 abstract, default 없이 온전한 메소드로 사용은 가능하다 */  
    private void privateMethod(){  
        /* 설명. 다른 public default 메소드에서 활용만 할 수 있는 기능 */  
    }  
```

# inheritance
#### implements
> 인터페이스를 상속하려면 **implements** 키워드를 사용한다.<br/>
> 클래스와 달리 인터페이스는 다중 상속이 가능하다.(_feat. [[Polymorphism|다형성]]_)

# Marker Interface
> 내용은 없고 이름만 있는 인터페이스이다.(_feat. 다형성_) <br/>
> 다수이의 클래스를 한번에 처리하기 위해 사용한다.<br/>
> ex) _Serializable_ 

![[content/Java/Class/assets/marker_interface.png]]

# [[Abstract Class]] vs Interface
> 추상클래스가 부분적 규약이라면, 인터페이스는 규약 그 자체라고 이해할 수 있다.


|                       | Abstract Class | Interface |
| --------------------- | -------------- | --------- |
| 추상 메소드 갯수             | 0개 이상          | 전체        |
| abstract 키워드 명시       | 명시적            | 묵시적       |
| 인스턴스 생성               | X              | X         |
| 다형성 적용시 상위타입 활용 가능 유무 | O              | O         |
