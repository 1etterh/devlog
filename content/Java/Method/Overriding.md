---
tags:
  - java
  - class
---
> 부모 클래스로부터 상속받은 메소드를 재정의하는 기술

# Overriding 성립 조건
###### 1. 메소드의 시그니쳐 동일
###### 2. 자식 메소드의 리턴 타입은 부모 클래스의 리턴타입과 동일하거나 하위 타입(_feat. [[Polymorphism|다형성]]_)이어야 한다.
_AClass.java_
```Java
public class AClass {

	public static void staticMethod() {}
	
    public Object method2(int num) {return null;}
    
}
```

_BClass.java_
```Java
public class BClass {

@overriding
public Integer method2(int num) {return 0;} // overriding 가능

}
```
###### 3. 접근 제어자에 의해 자식 클래스가 접근 가능 + (static, final 안됨)
###### 4. Overriding 된 함수의 접근제어자는 부모 메소드와 같거나 더 넓은 범위여야함

###### 5. 예외처리는 같은 예외이거나 더 구체적(하위)인 예외를 처리해야함
> 동적 바인딩으로 인해 자식의 오버라이딩 된 메소드가 실행되는 경우 발생할 수 있는 예외를 문법적으로 방지함.


###### 접근제어자([[Access Level Modifier]])
> 접근 가능한 범위