---
tags:
  - security
  - jwt
  - syncday
  - spring
draft: true
description:
---
> JWT 관련 설명

## 1. Token Life Cycle
### 1. AccessToken(AT)
1. 생성: 로그인, 혹은 RT를 통한 재발급
2. 무효화: 로그아웃시 RedisTokenStore에 BlackList처리
### 2. RefreshToken(RT)
1. 생성: 로그인
2. 무효화: 로그아웃시 RedisTokenStore에서 삭제
## 2. Components
### 1. Jwt Util
> SyncDay의 Secret Key에 관련된 작업 수행

```Java title="JwtUtil.Java"
public class JwtUtil {  
    private final Key secretKey;  
    private final AppUserService appUserService;  
  
    public JwtUtil(@Value("${security.secret}") String secret, AppUserService appUserService) {  
        byte[] keyBytes = Decoders.BASE64.decode(secret);  
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);  
        this.appUserService = appUserService;  
    }  
  
    public String signToken(JwtBuilder builder) {  
        return builder.signWith(secretKey, SignatureAlgorithm.HS512).compact();  
    }
```

### 2. Token Extractor
> Request에서 토큰을 추출하는 역할 수행

```Java title="TokenAuthenticator.Java"
@Slf4j  
@Component  
public class TokenExtractor {  
  
    public String extractAccessToken(HttpServletRequest request) {  
        String bearerToken = request.getHeader("Authorization");  
        log.debug("extract access Token: {}", bearerToken);  
  
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {  
            return bearerToken.substring(7).trim();  
        }  
        return null;  
    }
```

### 3. Token Service
> 토큰의 생명주기 관리
```Java title="TokenService.Java"
@RequiredArgsConstructor  
@Service  
public class TokenService {  
    private final TokenStore tokenStore;  
    private final JwtUtil jwtUtil;  
    private final TokenProvider tokenProvider;  
  
  
    public String refreshAccessToken(String refreshToken) {  
        String email = jwtUtil.getSubject(refreshToken);  
        if (email == null) {  
            throw new SecurityException(SecurityErrorCode.INVALID_REFRESH_TOKEN);  
        }  
        return tokenProvider.generateAccessToken(email);  
    }
```

