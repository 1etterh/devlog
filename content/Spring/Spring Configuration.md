---
tags:
  - java
  - spring
---
# @Configuration
> 해당 클래스 이하의 범위는 자동 스캔

## Configuration 방식
1. Java based
2. Annotation based
3. XML based

#### 1. Java Based Configuration
> @Configuration 클래스 안에 @Bean 메소드를 사용

```Java
@Configuration
public class AppConfig {

	@Bean
	public TransferService transferService() {
		return new TransferServiceImpl();
	}
}
```
1. @Configuration: 해당 클래스 이하의 범위는 자동 스캔
2. @Bean: 메소드를 통해 객체를 생성 및 Spring Container에 등록

#### 2. Annotation Based Configuration
> @Component, @Service, @Repository, @Controller 등의 annotation을 직접 사용하여 Spring bean으로 설정

```Java
@Component
public class MyService {
    // service logic
}

@Repository
public class MyRepository {
    // repository logic
}

```
1. @Component Scan을 통해 Spring Container에 등록됨
2. @Configuration 사용안함

#### 3. XML Based Configuration
> XML을 통해 Bean 객체의 정보를 설정

```Java
  
ApplicationContext context = new GenericXmlApplicationContext("section03/annotationconfig/subsection02/xml/spring-context.xml");  
String[] beanNames = context.getBeanDefinitionNames();  

```

# @Component
> 컴포넌트 스캐닝에 의해 자동으로 감지 및 등록되는 Bean의 변형체

#### @ComponentScan
> 지정된 패키지를 스캔하여 Bean을 등록함

#### Variants
> 내부의 특정 역할을 표시하기 위해 사용하는 @Component의 변형

1. @Service: Service Layer
2. @Repository: DAO Component
3. @Controller: MVC Controller


# References
1. [Container Overview#beans-factory-metadata](https://docs.spring.io/spring-framework/reference/core/beans/basics.html#beans-factory-metadata)
