---
tags:
  - spring
  - bean
draft: false
---
> Spring IoC Container에서 관리되는 객체 <br/>
> Bean과 그들 사이의 의존 관계는 container의 configuration metadata에 의해 규정된다.

#### Bean Factory
> Spring IoC Container의 가장 기본적인 형태로, Bean의 생성, 초기화, 연결, 제거 등의 라이프사이클을 관리함

#### Configuration Metadata
> Container에 제공된 Bean 설정 정보를 통해 Bean객체 생성

#### BeanDefinition 
> Container 내부에서 bean의 정의를 표현하는 클래스
> BeanDefinition 객체들은 아래의 메타 데이터 정보를 포함한다.



![[content/Spring/assets/IoCContainer_00.png]]


# Bean Scope
> Bean 인스턴스의 범위
#### 1. singleton(default)
> context가 초기화 된 후에 인스턴스를 생성한다.(Eager Singleton)

#### 2. prototype
> 필요시 인스턴스 생성(Lazy initialization)
#### 3. request
#### 4. session

| Bean Scope | Description                                                                   |
| ---------- | ----------------------------------------------------------------------------- |
| Singleton  | 하나의 인스턴스만을 생성하고, 모든 빈이 해당 인스턴스를 공유하여 사용한다.                                    |
| Prototype  | 매번 새로운 인스턴스를 생성한다.                                                            |
| Request    | HTTP 요청을 처리할 때마다 새로운 인스턴스를 생성하고, 요청 처리가 끝나면 인스턴스를 폐기한다. 웹 애플리케이션 컨텍스트에만 해당된다. |
| Session    | HTTP 세션 당 하나의 인스턴스를 생성하고, 세션이 종료되면 인스턴스를 폐기한다. 웹 애플리케이션 컨텍스트에만 해당된다.          |
# LifeCycle
> Bean이 생성되고 소멸될 때 자동으로 호출 될 메소드를 등록할 수 있음

```Java
@Bean(initMethod = "openShop", destroyMethod = "closeShop")  
public Owner onwer() {  
    return new Owner();  
}
```
# references
[_Introduction to the Spring IoC Container and Beans_](https://docs.spring.io/spring-framework/reference/core/beans/introduction.html)
[_Bean Overview_](https://docs.spring.io/spring-framework/reference/core/beans/definition.html)
https://docs.spring.io/spring-framework/reference/core/beans/classpath-scanning.html