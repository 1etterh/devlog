---
tags:
  - spring
  - security
  - springsecurity
  - syncday
---
> Security 관련 요청(login, 새로 고침)의 경우 SecurityFilterChain 내에서 응답을 바로 전달할 수 있도록 SecurityResponseHandler을 통해 응답을 반환하였음

```Java title="JwtFilter.Java"
if(request.getRequestURI().equals("/api/users/refresh")){  
        securityResponseHandler.onAuthenticationSuccess(request, response, authentication);  
    }  
  
        SecurityContextHolder.getContext().setAuthentication(authentication);  
        log.debug("Authentication set in SecurityContext: {}", authentication);  
  
}
