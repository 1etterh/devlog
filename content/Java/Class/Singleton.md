---
tags:
  - java
  - class
  - designpattern
  - singleton
---
> 어플리케이션이 시작되고 난 후 어떤 클래스가 최초 한번만 메모리에 할당(객체)되고 그 메모리에 인스턴스가 단 하나만 생성되어 공유되게 하는 것을 싱글톤 패턴이라고 한다. <br/>
> (메모리 및 리소스 낭비 방지 목적)

# Initialization Type
#### Eager Initialization
> 프로그램을 시작할 때 Singleton 객체를 생성하는 방식

```Java
public class EagerSingleton {  
    private static EagerSingleton eager = new EagerSingleton();  // static: 프로그램이 시작될 때 생성되며, new EagerSingleton()을 통해 heap 영역에 객체를 생성한다.
  
    private EagerSingleton() { //생성자를 private으로 설정하여 객체 생성을 방지 
    }  
  
    public static EagerSingleton getInstance() {  
        return eager;  
    }  
}

```
#### Lazy Initialization 
> Singleton 객체를 사용하는 시점에 한번만 생성하는 방식

```Java
public class LazySingleton {  
  
    private static LazySingleton lazy;  //static 영역에 참조변수만 선언하고 heap영역에 객체 생성은 후에 함
  
    private LazySingleton(){}  
    public static LazySingleton getInstance() { 
        if(lazy == null){  
            lazy = new LazySingleton();  //heap 영역에 객체 생성
        }  
  
        return lazy;  
    }  
}
```
# Singleton의 장단점
##### 장점
1. 첫번째 이용시에는 인스턴스를 생성해야 하므로 속도 차이가 나지 않지만 두번째 이용부터는 인스턴스 생성 시간 없이 바로 사용할 수 있다.(재사용)
2. 인스턴스가 절대적으로 한개만 생성되는 것을 보증할 수 있다.

##### 단점
1. 싱글톤 인스턴스가 너무 많은 일을 하거나 너무 많은 데이터를 공유하면 결합도가 높아진다.
2. 동시성 문제를 고려해서 설계해야 하기 때문에 난이도가 높다.


# Syntax
```Java
public static void main(String[] args) {  
        EagerSingleton eager1 = EagerSingleton.getInstance(); 
        EagerSingleton eager2 = EagerSingleton.getInstance(); 
        System.out.println("System.identityHashCode(eager1) = " + System.identityHashCode(eager1)); // System.identityHashCode(eager1) = 617901222
        System.out.println("System.identityHashCode(eager2) = " + System.identityHashCode(eager2)); // System.identityHashCode(eager1) = 617901222
  
  
        LazySingleton lazy1 = LazySingleton.getInstance(); 
        // 이 시점에 lazySingleton 객체 생성  
        LazySingleton lazy2 = LazySingleton.getInstance();  
        System.out.println();  
        System.out.println("System.identityHashCode(lazy1) = " + System.identityHashCode(lazy1)); // System.identityHashCode(lazy1) = 1528902577
        System.out.println("System.identityHashCode(lazy2) = " + System.identityHashCode(lazy2)); // System.identityHashCode(lazy1) = 1528902577
    }
```