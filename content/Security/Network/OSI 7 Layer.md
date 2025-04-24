---
tags:
  - security
---

| 계층  | 이름                                         |     | 데이터 단위                   | 특징                                                                     | 예                                                                                |                                   |
| --- | ------------------------------------------ | --- | ------------------------ | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------- |
| 7   | 응용<br/>(Application)                       |     | 메시지<br/>(Message)        | 각종 응용서비스 제공<br/>네트워크 관리                                                | HTTP, Telnet, FTP, TFTP, SNMP, SMTP, SET, Kerberos, PGP, S/MIME, SSH, DHCP, IMAP | [[Gateway]]                       |
| 6   | 표현<br/>(Presentation)                      |     | 메시지<br/>(Message)        | 데이터 표현형식 변환<br/>부호화, 데이터 압축, 암호화                                       | ASCII, MPEG, JPG                                                                 |                                   |
| 5   | 세션<br/>(Session)                           |     | 메시지<br/>(Message)        | 동기 제공<br/>세션연결/관리/종료                                                   | 전송모드(전이중, 반이중 등), NFS, SQL, RPC                                                  |                                   |
| 4   | 전송<br/>(Transport)                         | TCP | 세그먼트<br/>      (Segment) | 종단-대-종단에 대한 흐름제어<br/>메시지 분할 및 조립, 순서화<br/>포트주소 지정, 연결제어<br/>다중화와 역 다중화 | TCP, UDP, SCTP, RSVP, SSL/TLS                                                    |                                   |
| 3   | 네트워크<br/>(Network)                         | IP  | 패킷<br/>(Packet)          | 통신경로 설정, 중계기능 담당<br/>라우팅 수행<br/>IPv4와 IPv6                             | IP, [[ICMP]], IGMP, ARP/RARP IPSec, VPN(3계층), X.25                               | [[Router]]<br/>end to end         |
| 2   | 데이터링크<br/>([[Data Link Layer\|Data Link]]) | MAC | 프레임<br/>(Frame)          | 오류제어, Frame화<br/>메체제어(MAC)<br/>흐름제어<br/>오류제어(에러검출, 에러정정)               | MAC, PPP, SLIP, L2TP, VPN(2계층)                                                   | Link<br/>스위치,<br/>[[Bridge\|브릿지]] |
| 1   | 물리<br/>(Physical)                          | Bit | 스트림<br/>(Stream)         | 물리적 연결 설정 및 해제<br/>전송 방식, 전송 매체                                        | RS-232, RS-422, RS-485                                                           | [[HUB\|허브]]<br/>리피터               |
