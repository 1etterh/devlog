---
tags:
  - oop
  - java
  - class
  - inheritance
---
> 부모 클래스를 확장하여 사용하는 기술.<br/> 
> 상속 클래스를 작성할 때는 extends 키워드를 사용한다.

# 상속으로 전달되는 속성
> 접근 가능한(by 접근제어자) 변수 + _생성자를 제외_ 한 메소드 <br/>
> 부모클래스의 타입(다형성의 토대가 된다.)
# 단일 상속
> 자바는 하나의 클래스만 상속받을 수 있다.
# Syntax

###### Car.java - 부모 클래스
```Java
public class Car {  
    private boolean runningStatus;  
  
    public Car() {  
        System.out.println("Car 클래스의 기본 생성자 호출됨...");  
    }  
  
    public Car(boolean runningStatus) {  
        this.runningStatus = runningStatus;  
    }  
    public void run(){  
        this.runningStatus = true;  
        System.out.println("자동차가 달리기 시작합니다.");  
    }  
  
    public void soundHorn(){  
        if(runningStatus){  
            System.out.println("빵빵");  
        }  
        else{  
            System.out.println("주행중이 아닐 때는 경적을 울릴 수 없습니다.");  
        }  
    }  
    public boolean isRunning(){  
        return this.runningStatus;  
    }  
  
    public void stop(){  
        this.runningStatus = false;  
        System.out.println("자동차가 멈춥니다.");  
    }  
}
```

###### FireCar.java - 자식 클래스
```
public class FireCar extends Car {  
    public FireCar() {  
        System.out.println("FireCar 클래스의 기본 생성자 호출됨...");  
    }  
  
    @Override  // @Override : 오버라이드라는 것을 명시 + 가독성 + 오타방지
	public void soundHorn() {  
        System.out.println("빠아아ㅏ아아ㅏㅏ아ㅏ아아ㅏ아ㅏ아");  
    }  
  
    public void sprayWater() {  
        System.out.println("소방차: 물을 뿌립니다============3");  
    }  
}
```

###### RacingCar.java - 자식 클래스
```Java 
public class RacingCar extends Car {  
    @Override  
    public void run() {  
        System.out.println("레이싱 자동차: 쌔에에에에ㅔ에에엥!~");  
    }  
  
    @Override
    public void soundHorn() {  
        System.out.println("레이싱카는 경적따위 울리지 않는다.");  
    }  
}
```



# Class Diagram
> Intellij IDEA는 작성된 코드를 토대로 Class Diagram을 보여주는 기능이 있다. <br/>
> (`ctrl` + `alt` + `shift` + `U`)

![[content/Java/Class/assets/IntelliJ_ClassDiagram.png]]


# Object
> 모든 클래스의 조상

# [[Super]]
> 부모 클래스의 멤버/생성자를 활용하기 위해 사용하는 변수
##### [[Overriding]]
> 부모 클래스로부터 상속받은 메소드를 재정의하는 것