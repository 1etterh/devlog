---
tags: 
draft: true
description: 
title:
---
> HyperText Transfer Protocol Secure <br>
> HTTP protocol의 암호화된 버전 <br>
> 클라이언트 - 서버 간의 모든 커뮤니케이션을 암호화 하기 위하여 SSL 또는 TLS 사용


# 1. SSL
> Secure Sockets Layer
1. 보안 소켓 계층
2. 클라이언트-서버의 안전한 링크를 통해 송수신 되는 모든 데이터를 안전하게 보장하는 과거의 보안 표준 기술
3. Netscape에 의해 v3.0가 발표되었고, 현재는 TLS로 대체됨


# 2. TLS
> Transport Layer Security Protocol
### 1. TLS가 제공하는 3가지 주요 기능
#### 인증
> 인증을 통해 통신의 각 당사자는 상대방의 신원을 파악할 수 있음

#### 암호화
> 권한이 없는 사람이 데이터를 읽고 해석하는 것을 방지하기 위해 사용자 에이전트와 서버 사이에 데이터가 전송되는 동안 데이터가 암호화됨

#### 무결성
> TLS는 데이터를 암호화, 전송, 복호화하는 동안 정보가 사라지거나, 손실되거나, 변조되지 않는 것을 보장함
### 2. TLS Handshake
> 서버와 클라이언트가 공유 암호에 동의하고, 암호화 스위트와 같은 중요한 매개변수가 협상되는 Handshake 단계

#### 암호화 스위트
> Cypher suite <br>
> TLS 핸드쉐이크가 협상하는 주요 파라미터
#### HSTS
> HTTP Strict Transport Security<br>
> 사이트가 HTTPS를 통해서만 접근되어야 하며, 향후 HTTP를 사용하여 사이트에 접근하려는 모든 시도는 자동으로 HTTPS로 변환되어야 함을 Browser에 알리는 Header


# Terms

# Syntax

# References
1. [Mozilla 웹 보안 가이드라인](https://wiki.mozilla.org/Security/Guidelines/Web_Security)
2. 