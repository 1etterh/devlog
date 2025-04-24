---
tags:
  - java
  - bean
  - spring
  - di
---
> Type를 통한 DI에 사용하는 어노테이션 <br/>
> Spring 컨테이너가 알아서 해당 타입의 Bean을 찾아서 주입


# DI Annotations

#### 1. Qualifier
> 여러개의 Bean 객체중에서 이름을 지정하여 식별하는 Annotation

#### 2. Primary
> 여러개의 Bean 객체 중 우선순위가 가장 높은 빈 객체를 지정

#### 3. Collection
> 같은 타입의 Bean을 여러개 주입받고 싶을 때 사용

#### 4. Resource
> 주입할 빈 객체의 이름을 지정

#### 5. Inject
> Type으로 Bean을 주입


|            | @Autowired                         | @Resource              | @Inject                     |
| ---------- | ---------------------------------- | ---------------------- | --------------------------- |
| 제공         | Spring                             | Java                   | Java                        |
| 지원 방식      | 필드, 생성자, 세터                        | 필드, 세터                 | 필드, 생성자, 세터                 |
| 빈 검색 우선 순위 | 타입 → 이름                            | 이름 → 타입                | 타입 → 이름                     |
| 빈 지정 문법    | @Autowired  <br>@Qualifier(”name”) | @Resource(name=”name”) | @Inject  <br>@Named(”name”) |
