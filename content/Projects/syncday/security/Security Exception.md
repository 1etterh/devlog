---
tags:
  - spring
  - security
  - springsecurity
  - syncday
draft: false
description:
---
> Spring Security Filter Chain에서 발생한 예외 처리

# Error Handling
### 1. Security Error Code
> EnumType으로 정의

```Java title="SecurityErrorCode.Java"
@Getter  
@AllArgsConstructor  
public enum SecurityErrorCode {  
    // 인증 실패 (401)    AUTHENTICATION_FAILED(4010001, HttpStatus.UNAUTHORIZED, "인증에 실패했습니다"),  
    INVALID_TOKEN(4010002, HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다"),  
    EXPIRED_TOKEN(4010003, HttpStatus.UNAUTHORIZED, "만료된 토큰입니다"),  
    BAD_CREDENTIALS(4010004, HttpStatus.UNAUTHORIZED, "아이디와 비밀번호가 일치하지 않습니다."),  
    TOKEN_NOT_FOUND(4010005, HttpStatus.UNAUTHORIZED, "토큰이 존재하지 않습니다"),  
    ACCESS_TOKEN_BLACKLISTED(4010006, HttpStatus.FORBIDDEN,"블랙리스트된 토큰입니다")
```

### 2. SecurityException
> RuntimeException을 상속받아 Throwable하게 정의함

```Java title="SecurityException.Java"
ublic class SecurityException extends RuntimeException {  
    private final SecurityErrorCode errorCode;  
  
    public SecurityException(SecurityErrorCode errorCode) {  
        super(errorCode.getMessage());  
        this.errorCode = errorCode;  
    }    
}
```

### 3. Security Error Response
> SecurityException 발생시 다음과 같이 ErrorCode, HttpStatus, ErrorMessage, 요청 경로를 포함하는 응답 DTO 정의

```Java title="SecurityErrorResponse.Java"
public class SecurityErrorResponse {  
  
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")  
    private final LocalDateTime timestamp;  
  
    private final Integer code;  
    private final HttpStatus status;  
    private final String message;  
    private final String path;
```


### 4. SecurityExceptionHandler
> Security Exception 발생시 Catch하여 응답을 작성하는 역할
```Java title="SecurityExceptionHandler.Java"
public void handleSecurityException(HttpServletRequest request, HttpServletResponse response,  
                                    SecurityErrorCode errorCode) throws IOException {  
    log.debug("Security error occurred: {}", errorCode.getMessage());  
    writeErrorResponse(request, response, errorCode);  
}
```


# 기존 처리 방식 대비 개선점

### 1. 이전 프로젝트의 Security Error Handling
```Java title="CustomAuthenticationFailureHandler.Java"

CommonException customException;
        if (exception.getMessage().equals("아이디를 잘못 입력하셨습니다.")) {
            customException = new CommonException(ErrorCode.NOT_FOUND_USER_ID); // 사용자 정의 에러코드로 설정
        } else if (exception.getMessage().equals("비밀번호를 잘못 입력하셨습니다.")) {
            customException = new CommonException(ErrorCode.INVALID_PASSWORD); // 사용자 정의 에러코드로 설정
        } else if (exception.getMessage().equals("퇴사한 사원 입니다.")) {
            customException = new CommonException(ErrorCode.INACTIVE_USER); // 사용자 정의 에러코드로 설정
        }
        else {
            customException = new CommonException(ErrorCode.LOGIN_FAILURE); // 기본적으로 비밀번호 틀림 처리
        }

        ResponseDTO<Object> errorResponse = ResponseDTO.fail(customException);

```
> Spring FIlter Chain을 통해 에러가 전파되어 에러 메시지를 비교해야 하는 번거로움이 있었음

### 2. 개선된 ErrorHandling
다음과 같이 throw된 Exception을 바로 Catch하여 바로 응답을 반환

```Java title="JwtFilter.Java"
} catch (SecurityException e){  
    securityExceptionHandler.handleSecurityException(request, response, e.getErrorCode());  
}
```
