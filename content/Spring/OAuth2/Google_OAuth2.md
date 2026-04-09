---
tags:
  - challengerstory
  - google
  - springboot
  - oauth
draft: true
description: 
title: "[Google OAuth2.0] Spring Boot 에서 Google OAuth설정"
---
# 1. Google API Console 접속

![[Pasted image 20250304165928.png]]
OAuth 동의화면 이동
![[Pasted image 20250304170021.png]]
프로젝트 정보 작성
1. 앱 정보: ChattingStory
2. 문의 이메일: 내 이메일
3. 대상: 외부 사용자
4. 연락처 정보: 내 이메일

# 2. OAuth Client 생성
> Google 인증 플랫폼 > 클라이언트 > 클라이언트 만들기

![[Pasted image 20250304170254.png]]
> 승인된 Redirection URI는 Frontend/oauth2/google로 했다. 

# OAuth2.0 Endpoint

Google OAuth2.0의 승인 요청 경로는 다음과 같다.
```
https://accounts.google.com/o/oauth2/v2/auth
```

