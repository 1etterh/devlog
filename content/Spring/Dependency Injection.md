---
tags:
  - spring
  - di
  - java
draft: false
---
> 객체의 의존관계를  factory method 를 통해서 정의 내리는 것 <br/>
> IoC의 특화된 형태

# Dependencies(의존성)
> 한 객체(A)가 다른 객체(B)와 함께 작업하는 것 <br/>
> 한 객체가 변경되면 이에 의존하는 다른 객체들도 함께 변경되어야 한다는 것을 의미함. <br/>
> class A가 class B를 필드로 가질 때 A는 B에 의존하게 된다.

## Dependency Injection
> 객체간의 의존관계를 빈 설정 정보를 바탕으로 컨테이너가 자동적으로 연결해주는 것. <br/>
> 객체간의 결합도를 낮출 수 있으며 이를 통해 유지보수성과 유연성이 증가한다.

# DI Variants(의존성 주입 방식)
> 의존성  주입에는 다양한 방식이 있다.
#### 1. 생성자 주입(권장)
> 연관된 Bean 객체를 생성자를 통해 주입받는 것.

##### 생성자 주입의 이점
1. 필드에 final 키워드를 사용할 수 있다.
2. 순환 참조를 스프링 시작 시점에 파악하여 방지할 수 있다.
3. 필드 주입과 setter 주입의 단점(@Autowired 남용, Java Reflection 기술을 통한 캡슐화 무효화, 불변객체(final)의 사용 불가 등등)
4. 테스트 코드 시에 생성자를 통해 편하게 테스트할 수 있다.(Mock 객체 불필요)
##### Syntax
###### @Autowired를 통한 생성자 주입
```JAVA
  
@Autowired  
public BookService(BookDAO bookDAO) {  
    this.bookDAO = bookDAO;  
}
```



#### 2. Setter() 주입
> 연관된 빈 객체를 Setter를 통해 주입받는 것.
##### Syntax

###### @Autowired를 통한 Setter 주입
```Java
public class BookService {  
  
    BookDAO bookDAO;  
    public BookService(){  
    }  
  
    @Autowired  
    public void setBookDAO(BookDAO bookDAO) {  
        this.bookDAO = bookDAO;  
    }  
    public List<BookDTO> findAllBook() {  
        return bookDAO.findAllBook();  
    }  
  
    public BookDTO searchBookSequence(int sequence) {  
        return bookDAO.searchBookBySequence(sequence);  
    }  
}
```

### 3. Field 주입
> 연관된 빈 객체를 Field를 통해 주입받는 것.
##### Syntax
###### @Autowired를 통한 필드 주입 방식

```Java
  
@Service("bookService")  
public class BookService {  
  
    @Autowired         
    BookDAO bookDAO;  
  
    public List<BookDTO> findAllBook() {  
      return bookDAO.findAllBook();  
    }  
  
    public BookDTO searchBookSequence(int sequence) {  
        return bookDAO.searchBookBySequence(sequence);  
    }  
}
```




# references:
[_Introduction to Spring IoC Container and Beans_](https://docs.spring.io/spring-framework/reference/core/beans/introduction.html), 
[_Dependencies_](https://docs.spring.io/spring-framework/reference/core/beans/dependencies.html),
[Constructor-based DI](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html#beans-constructor-injection),