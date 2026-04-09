---
tags:
  - spring
  - security
  - springsecurity
  - syncday
draft: true
description:
---
# Security Properties
1. AT, RT 만료 시간
2. Public Paths 저장

```Java
@RequiredArgsConstructor  
@Getter
@ConfigurationProperties("security")  
public class SecurityProperties {  
    private final long accessExpirationTime;  
    private final long refreshExpirationTime;  
    private final List<String> skipPaths;   
}
```

# Web Security
> Security 설정

```Java title="WebSecurity.Java"
// ... 생략

// SecurityProperties의 public path 
List<AntPathRequestMatcher> skipPathMatchers = securityProperties.getSkipPaths().stream()  
        .map(AntPathRequestMatcher::new)  
        .toList();

// ... 중간 생략

http.authorizeHttpRequests(auth -> {  
			// skipPathMatchers의 경로로 요청이 들어오면 permitAll
            skipPathMatchers.forEach(matcher -> 
	        auth.requestMatchers(matcher).permitAll());  
            auth.anyRequest().authenticated();  
        })

```


![[Spring Security.png]]