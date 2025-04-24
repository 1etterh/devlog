---
tags:
  - oop
  - class
  - abstraction
  - java
---
> 추상메소드를 0개 이상 포함하는 클래스 <br/>
> 객체 생성이 불가능하다.

# 추상 메소드
> 메소드의 헤드(head) 부분만 있고 바디(body) 부분이 없는 메소드 <br/>
> 추상 메소드가 하나 이상 존재하면 해당 클래스는 반드시 추상 클래스가 된다.(객체 생성을 문법적으로 방지)

# Syntax
```Java
public abstract class Product { 
    private int nonStaticField;  
    private static int staticField;  
    public Product(){}    
    public void nonStaticMethod(){}  
    public static void staticMethod(){}  
    public abstract void abstractMethod(); 
}
```

# Instance
1. Overriding을 활용하여 모든 abstract를 제거한 자식 클래스는 객체 생성이 가능하다.
2. 자식 클래스가 객체를 생성하면 Heap 영역에 SuperClass의 객체도 생성된다.
3. 내부의 익명 클래스를 작성하여 추상 메서드를 구현하면 객체를 생성할 수 있다.

###### [[content/Java/Class/Interface|Interface]] vs [[Abstract Class]]




