---
draft: true
tags:
  - spring
  - websocket
  - controller
---
> 참고 자료 정리

# @Controller vs @RestController
## 공식 문서

1. **Spring 공식 문서**
    
    - [Spring Web MVC 문서](https://docs.spring.io/spring-framework/reference/web/webmvc.html) - 컨트롤러의 기본 개념 설명
    - [@RestController 어노테이션 API 문서](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html) - 공식 JavaDoc
2. **Baeldung 튜토리얼**
    
    - [Spring @Controller vs @RestController](https://www.baeldung.com/spring-controller-vs-restcontroller) - 두 어노테이션의 차이점에 대한 명확한 설명과 예제 코드
3. **Spring 가이드**
    
    - [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/) - REST 서비스 구축 가이드
    - [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/) - MVC 패턴 설명

## 블로그 및 커뮤니티 자료

1. **Callicoder**
    
    - [RESTful APIs with Spring Boot, Spring WebSocket and Angular](https://www.callicoder.com/spring-boot-websocket-chat-example/) - WebSocket과 REST의 조합에 대한 설명
2. **DZone**
    
    - [REST vs MVC in Spring](https://dzone.com/articles/spring-framework-restcontroller-vs-controller) - 더 심층적인 비교 분석
3. **StackOverflow**
    
    - [What's the difference between @RestController and @Controller?](https://stackoverflow.com/questions/25242321/difference-between-spring-controller-and-restcontroller-annotation) - 실무자들의 다양한 견해와 예시

## 핵심 요약

- **@Controller**
    
    - 전통적인 Spring MVC 컨트롤러
    - View 이름을 반환하거나 `@ResponseBody`로 데이터 직접 반환
    - WebSocket, STOMP 메시징 등에 적합
- **@RestController**
    
    - `@Controller` + `@ResponseBody`의 조합
    - 모든 핸들러 메서드에 `@ResponseBody` 자동 적용
    - REST API 개발에 최적화

WebSocket과 REST API를 함께 사용하는 애플리케이션에서는 두 유형의 컨트롤러를 각각의 목적에 맞게 구분해서 사용하는 것이 코드 구조를 명확하게 만드는 데 도움이 됩니다.