---
title:
tags:
draft: true
---
## 1. OpenSSL
> Open Secure Socket Layer

SSL: 암호화 기반 인터넷 보안 프로토콜이며, 현재 사용중인 TLS 암호화의 전신
SSL/TLS를 사용하는 웹사이트의 URL에는 http 대신 https가 사용됨.

## 2. 암호화 목적
1. 평문을 암호화하여 공격자가 알아볼 수 없는 형태로 변환
2. 통신장치 사이에 handshake라는 인증 프로세스를 시작하여 각 장치의 id를 확인
3. 디지털 서명을 통해 데이터가 조작되지 않음을 확인

## 3. SSL 인증
SSL은 CA(인증 기관) 에서 발급한 [[002_SSL인증서, 비밀키 생성|SSL 인증서]]가 있는 웹사이트만 실행할 수 있음.
## refs
1. [cloudflare - what is https](https://www.cloudflare.com/ko-kr/learning/ssl/what-is-https/)
2. [Microsoft - 디지털 서명](https://learn.microsoft.com/ko-kr/windows/win32/seccrypto/digital-signatures)
3. 