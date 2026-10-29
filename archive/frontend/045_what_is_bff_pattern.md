---
title: BFF(Backend For Frontend)란 무엇인가
type: archive
tags: [archive, bff, api_gateway, architecture]
draft: true
---

**Q**: BFF(Backend For Frontend)는 무엇인가?

**A**:
- 특정 프론트엔드 하나를 위해 만든 얇은 전용 백엔드. 프론트와 실제 백엔드(오픈소스 API, 마이크로서비스 등) 사이에 위치
- 역할: 토큰·비밀키 은닉, CORS 회피(같은 origin), 여러 API 호출 묶기, 화면에 맞는 응답 가공, 자체 인증·권한 적용
- 비즈니스 로직의 중심이 아니라 "프론트 전용 어댑터"라는 점이 일반 백엔드와 다름
- API Gateway는 모든 클라이언트 공용 진입점, BFF는 클라이언트(웹/모바일)별 전용이라는 차이

오픈소스 모니터링 엔진 위에 자체 UI를 올릴 때, 엔진 API를 브라우저에 직접 노출하지 않기 위해 흔히 둔다.
