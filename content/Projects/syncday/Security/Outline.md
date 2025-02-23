---
tags:
  - spring
  - security
  - springsecurity
  - syncday
draft: false
description:
---
> Syncday의 Spring Security 개요

# SyncDay 요청별 인증

### 1. Public 요청
1. application.yml에 public path 정의
2. SecurityProperties에 Public Path 목록 저장
3. 해당 목록은 permitAll
### 2. 로그인 요청
1. ID, PW를 통한 로그인
2. 로그인 성공
	1. RefreshToken(RT): Http Only Cookie
	2. AccessToken(AT): Response Header에 반환
3. 생성된 RefreshToken은 Redis Token Store에 저장
### 3. 인증 필요 요청
1. JWT Filter에서 AT 검증
	1. 유효한 AT: Security Context에 인증 객체 등록
	2. 만료된 AT: RT 검증 후
		1. 유효한 RT: AT 재발급 후 RequestHeader에 저장, IoC Container 내부로 API 요청 전달
		2. 유효하지 않은 RT: 401 에러 반환
2. refresh 요청: SecurityRepsonseHandler를 통해 AT와 RT 반환
3. 그 외 요청: IoC Container 내부로 API 요청 전달
### 4. 로그아웃 요청
1. RedisTokenStore에서 RT 삭제
2. RedisTokenStore에 AT 블랙리스트 처리

# Security 상세 구현
1. [[Configuration]]
2. [[Response Handling]]
3. [[content/Projects/syncday/security/Exception|Exception]]
4. [[JWT]]