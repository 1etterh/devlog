---
tags:
  - spring
  - security
  - springsecurity
  - syncday
---
> Security 관련 요청(login, 새로 고침)의 경우 SecurityFilterChain 내에서 응답을 반환하였음.

# Response Handling
## LoginResponseDTO
```Java title="LoginResponseDTO.java"
@Data  
public class LoginResponseDTO {  
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")  
    @JsonProperty("time_stamp")  
    private final LocalDateTime timestamp;  
  
    @JsonProperty("user_id")  
    private Long userId;  
  
    @JsonProperty("email")  
    private String userEmail;  
  
    @JsonProperty("user_login")  
    private String userLogin;  
  
    @JsonProperty("user_type")  
    private String userType;  
  
    @JsonProperty("success")  
    private boolean success;  
  
}
```

## SecurityResponseHandler
> Authentication 성공시 수행하는 작업을 담당하는 클래스
1. UserEntity의 LastActivatedAt 업데이트
2. tokenService에 refreshToken 저장요청 
3. LoginResponseDTO를 통한 응답 작성
## 활용

```Java title="AuthenticationFilter.Java"
@Override  
protected void successfulAuthentication(  
        HttpServletRequest request,  
        HttpServletResponse response,  
        FilterChain chain,  
        Authentication authResult  
) throws IOException, ServletException {  
        securityResponseHandler.onAuthenticationSuccess(request, response, authResult);  
}
```

