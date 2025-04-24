---
tags:
  - bean
  - java
  - spring
---
> bean factory에 enterprise 특화적인 기능을 추가한 서브 인터페이스(상속) <br/>

# Overview
> Spring IoC container을 의미하며, bean 객체를 초기화, 설정, 모으는 기능을 수행함.

# ApplicationContext
> BeanFactory의 하위 인터페이스로, 아래의 기능을 추가적으로 제공한다. 
1. Spring의 [[AOP]]와 통합
2. 메시지 리소스 관리(국제화, internationalization)
3. 이벤트 발행
4. Application-layer 컨텍스트(ex. WebApplicationContext)

