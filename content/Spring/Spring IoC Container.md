---
tags:
  - spring
  - ioc
draft: false
---
# IoC
> 프로그램의 제어 흐름 구조가 뒤바뀌는 것 <br/>
> Inversion of Control

## IoC Container
> IoC를 구현한 구체적인 프레임워크 <br/>
> IoC Container를 사용하면 Bean 객체의 생성, 초기화, 의존성 처리등을 자동으로 수행할 수 있다. <br/>
> IoC Container의 기반 패키지: `org.springframework.beans`, `org.springframework.context` 


## IoC Container 구현체
1. Bean Factory
2. Application Context
#### 1. Bean Factory
> 가장 기본적인 IoC 구현체
#### 2. Application Context
> bean factory에 enterprise 특화적인 기능을 추가한 서브 인터페이스

1. Spring의 [[AOP]]와 통합
2. 메시지 리소스 관리(국제화, internationalization)
3. 이벤트 발행
4. Application-layer 컨텍스트(ex. WebApplicationContext)

![[content/Spring/assets/IoCContainer_00.png]]
### references
[_Container Overview_](https://docs.spring.io/spring-framework/reference/core/beans/basics.html)
