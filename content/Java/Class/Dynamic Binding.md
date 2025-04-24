---
tags:
  - java
  - oop
  - class
  - overriding
  - polymorphism
---
> 컴파일 당시에는 해당 타입의 메소드와 연결되어 있다가 런타임 시점에 실제 객체가 가진 오버라이딩 된 메소드로 바인딩이 바뀌어 동작하는 것

# 조건
##### 1. 상속
##### 2. 오버라이딩
> 오버라이딩 되지 않은 메소드는 `down casting`을 해야 실행할 수 있다.

# Type Casting

#### auto up-casting
> 자동 형변환 된다.(묵시적 형변환, 생략 가능)
```Java
// 자식 클래스의 객체 주소를 상위 클래스타입의 변수에 저장할 수 있다.
Animal an1 = new Rabbit();
Animal an2 = new Tiger();
```

#### down casting
> 명시적으로 강제적 형변환이 가능은 하지만, 소속 클래스가 다른 경우 런타임 에러가 발생한다. <br/>
```Java
Rabbit rabbit = (Rabbit) an1;
/* Runtime Error 발생 */
// Rabbit rabbit = (Rabbit) an2;  
```


![[content/Java/Class/assets/dynamic_binding_0.png]]

> method2, method3은 오버라이딩 된 메소드가 아니므로 다운 캐스팅을 해줘야 실행이 가능하다.

### instanceof
> 객체의 타입을 런타임 시점에 확인하는 연산자.<br/>
> downcasting시 발생하는 런타임 에러를 방지하기 위해 `instanceof` 함수를 사용할 수 있다. <br/>
> 오버라이딩 되지 않은 메소드를 실행하려면 다운캐스팅을 해줘야 하는데, 이 때 `instanceof`을 사용하여 런타임 에러를 방지할 수 있다.
```Java
if(an2 instanceof Tiger){  
    ((Tiger)an2).bite();  
} // 타입 확인 후 down casting
```




