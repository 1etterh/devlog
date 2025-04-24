---
tags:
  - java
  - spring
  - springboot
draft: false
---
# 1. Mapping Annotations
> 요청에 따라 실행할 메소드를 지정하는 annotation
#### 1. @RequestMapping
> 다양한 방식의 요청을 처리할 수 있는 어노테이션
> value, method를 지정할 수 있다.
##### Syntax
```Java
@RequestMapping(value = "/menu/regist", method = RequestMethod.GET)     
public String registMenu(Model model) {   
    System.out.println("/menu/regist 경로의 GET 요청 받아보기");  
    model.addAttribute("message", "신규 메뉴 등록용 핸들러 메소드 호출하고 응답한 페이지");  
  
    return "mappingResult";     
    }
```

#### 2.  @GetMapping
> GET 요청을 처리하는 어노테이션
##### Syntax
```Java
@GetMapping("/menu/delete")  
public String getDeleteMenu(Model model) {  
    model.addAttribute("message","GET 방식의 메뉴 삭제용 핸들러 메소드 호출함..."); 
    return "mappingResult";  
}
```

#### @PostMapping
> POST 요청을 처리하는 어노테이션

```Java
@PostMapping("/menu/delete")  
public String postDeleteMenu(Model model) {  
    model.addAttribute("message","POST 방식의 메뉴 삭제용 핸들러 메소드 호출함...");  
  
    return "mappingResult";  
}
```
# 2. Parameters

#### Model
#### ModelAndView

#### RedirectAttribute


# Return Type
1. void: 경로에 해당하는 view를 매핑해줌
2. String: 경로를 지정할 수 있음