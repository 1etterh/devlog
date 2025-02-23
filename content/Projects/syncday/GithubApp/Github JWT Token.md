---
tags:
  - troubleshooting
  - github
  - syncday
draft: false
---
### 문제
1. GitHub API For Java 공식 문서를 통해 JWT 생성
2. 시간 관련 문제 발생(Expiration Time is too far in the future 에러 발생)

### 해결 방법
1. Github 서버시간과 내 컴퓨터의 서버 시간의 차이를 JWT 발급 과정에 고려하였음

### 구현
```Java
Key privateKey = getPrivateKey(privateKeyPath);  
RestTemplate restTemplate = new RestTemplate();  
ResponseEntity<String> response = restTemplate.getForEntity("https://api.github.com/", String.class);  
HttpHeaders headers = response.getHeaders();  
long githubTime = headers.getDate();  
long timeDiff = System.currentTimeMillis() - githubTime;  
  
log.info("timeDiff: {}", timeDiff);  
System.out.println("Time difference with GitHub (ms): " + timeDiff);  

// github 서버시간과 내 컴퓨터의 시간의 차이를 반영하여 jwt 발급
long nowMillis = System.currentTimeMillis() - timeDiff;  
long expMillis = nowMillis + 10 * 60 * 1000;  
 
String token = Jwts.builder()  
        .setHeaderParam("alg", "RS256")  
        .claim("iat", new Date(nowMillis))        // Unix timestamp in seconds  
        .claim("exp", new Date(expMillis)) // Unix timestamp in seconds  
        .claim("iss", githubAppId)                       // GitHub App ID  
        .signWith(privateKey, SignatureAlgorithm.RS256)  
        .compact();
```

