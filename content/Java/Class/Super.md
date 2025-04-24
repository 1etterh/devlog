---
tags:
  - super
  - inheritance
  - class
  - java
---
> super 키워드는 `super()`과 `super.` 로 나뉜다.

1. `super.` : 자식 클래스 타입의 객체가 생성될 때 먼저 생성된 부모 클래스 타입의 객체의 주소값
2. `super()` : 부모로부터 물려받지 못한 [[Constructor|생성자]]를 활용하기 위해 사용하는 함수

# `super.` vs `super()`
###### Product.java - 부모 클래스
```Java
public class Product {  
    private String code;  
    private String brand;  
    private String name;  
    private int price;  
    private java.util.Date manufacturedDate;
   
	@Override  
	public String toString() {  // Object클래스의 toString() Override
	    return "Product{" +  
	            "code='" + code + '\'' +  
	            ", brand='" + brand + '\'' +  
	            ", name='" + name + '\'' +  
	            ", price=" + price +  
	            ", manufacturedDate=" + manufacturedDate +  
	            '}';  
}
}
```

###### Computer - 자식 클래스
```Java
public class Computer extends Product {  
    private String cpu;  
    private int hdd;  
    private int ram;  
    private String operatingSystem;
	}
```


###### 1. `super.` : 부모 클래스의 속성에 접근할 때 사용한다.
```Java
    @Override  
    public String toString() {   
        return "Computer{" +  
                super.toString() // product.toString()
                + ", cpu='" + cpu + '\'' +  
                ", hdd=" + hdd +  
                ", ram=" + ram +  
                ", operatingSystem='" + operatingSystem + '\'' +  
                '}';  
    }
```

###### 2. `super()` : 부모 클래스의 생성자를 호출할 때 사용된다.
```Java
public Computer() {  
    super();  //부모 클래스의 생성자를 호출
}
```


### `super.` 호출 구조
##### 이론적 구조

![[content/Java/Class/assets/super_0.png]]

##### 물리적 구조

![[content/Java/Class/assets/super_2.png]]

### `super()` 호출 구조

# 자식 객체 생성 과정
1. 자식 객체 변수 선언
```Java
Dog dog;
```
![[content/Java/Class/assets/super_3.png]]

2. 자식 객체 생성시 자식의 Constructor는 `super()`를 사용하여 부모 객체 먼저 생성
```Java
Dog dog = new Dog();
```
![[content/Java/Class/assets/super_4.png]]

3. Dog(){} 생성자 함수가 끝나면 자식 객체 생성

![[content/Java/Class/assets/super5.png]]