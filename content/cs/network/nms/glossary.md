---
title: "용어(Glossary)"
tags:
  - network
  - nms
  - RFC
  - IEEE
  - ITU-T
  - 참고
draft: false
---

NMS 문서에 나오는 약어·용어를 한곳에 모은다. 주제별로 나누고, 각 표 안은 가나다·알파벳 순. 출처 문서의 상태·링크는 [[cs/network/nms/data/topology/index#출처-문서|토폴로지 데이터 표준 › 출처 문서]].

| 분류 | 담는 것 |
|---|---|
| [표준 기구](#표준-기구) | RFC, IETF, IEEE, ITU-T |
| [SNMP](#snmp) | 매니저·에이전트, OID, PDU, trap, community, v3 보안 |
| [MIB](#mib) | SNMPv2-MIB, IF-MIB, ENTITY-MIB, LLDP-MIB 등 |
| [MIB 항목 이름](#mib-항목-이름) | `if`, `ifHC`, `lldpRem`, Admin / Oper 등 접두어·약어 |
| [측정값](#측정값) | 카운터, 게이지, 임계값, RTT, 손실률, 지터 |
| [수집·관리 프로토콜](#수집관리-프로토콜) | ICMP, ARP, traceroute, syslog, LLDP, NETCONF, YANG, gNMI, NetFlow |
| [망 구조](#망-구조) | L2 / L3 / L4, TTL, VLAN, LAG, MPLS, NAT, SDN, OOB |
| [하드웨어](#하드웨어) | PSU, SFP, DOM |
| [보안](#보안) | TLS, ACL, RBAC, MFA, IDS, CVE |

## 표준 기구

| 용어 | 풀이 | 뜻 |
|---|---|---|
| IEEE | Institute of Electrical and Electronics Engineers | 이더넷·LLDP 표준 기구 |
| IETF | Internet Engineering Task Force | RFC를 만드는 표준화 기구 |
| ITU-T | International Telecommunication Union – Telecommunication Standardization Sector | 국제전기통신연합 통신표준화 부문 |
| RFC | Request for Comments | 인터넷 표준 문서 |

## SNMP

자세한 동작은 [[cs/network/nms/collection/snmp|SNMP]].

| 용어           | 풀이                                  | 뜻                                                               |
| ------------ | ----------------------------------- | --------------------------------------------------------------- |
| community    | —                                   | SNMPv1/v2c의 비밀번호 역할 문자열. 평문으로 오간다. 기본값 public(읽기)·private(쓰기)   |
| GetBulk      | GetBulkRequest                      | 다음 OID N개를 한 번에 읽는 요청(v2c+). 테이블 읽기에 쓴다                         |
| inform       | InformRequest                       | 응답(확인)을 받는 trap. 잃어버리면 다시 보낸다(v2c+)                             |
| MIB          | Management Information Base         | SNMP로 읽을 수 있는 항목 정의(스키마). 목록은 [MIB](#mib)                       |
| OID          | Object Identifier                   | OID 트리에서 MIB 항목(노드) 하나를 가리키는 경로. 루트부터 번호를 점으로 이어 쓴다(예: `1.3.6.1.2.1.1.5.0` = `sysName`). 트리는 ITU-T X.660 등록 트리 |
| PDU          | Protocol Data Unit                  | SNMP 메시지 종류(Get, GetNext, GetBulk, Set, Response, Trap, Inform) |
| SMI          | Structure of Management Information | MIB를 쓰는 문법과 값 타입(Counter, Gauge 등). SMIv2 = RFC 2578            |
| SNMP         | Simple Network Management Protocol  | 장비 정보를 읽고(GET) 바꾸고(SET) 알림을 받는(TRAP) 관리 프로토콜. UDP 161 / 162     |
| trap         | —                                   | 장비가 NMS로 먼저 보내는 SNMP 알림. 응답을 받지 않는다(유실 가능)                      |
| USM          | User-based Security Model           | SNMPv3의 사용자 인증·암호화. RFC 3414                                    |
| VACM         | View-based Access Control Model     | SNMP로 읽을 수 있는 MIB 범위를 제한. RFC 3415                              |
| WALK         | —                                   | GetNext / GetBulk를 반복해 테이블·하위 트리 전체를 읽는 것                       |
| 매니저(Manager) | —                                   | 묻고 알림을 받는 쪽(NMS, 수집기)                                           |
| 에이전트(Agent)  | —                                   | 장비 안에서 SNMP 질문에 답하는 기능. 장비에 내장돼 따로 깔지 않는다                       |

## MIB

| 용어 | 풀이 | 뜻 |
|---|---|---|
| BRIDGE-MIB | Bridge MIB | 스위치 MAC 주소 테이블(어느 포트에 어떤 MAC). RFC 4188 |
| ENTITY-MIB | Entity MIB | 물리 구성품(섀시·모듈·포트)과 모델·제조사·일련번호. RFC 6933 |
| ENTITY-SENSOR-MIB | Entity Sensor MIB | 온도·전압 등 센서 값. RFC 3433 |
| ENTITY-STATE-MIB | Entity State MIB | 구성품의 운용·경보 상태. RFC 4268 |
| HOST-RESOURCES-MIB | Host Resources MIB | 서버 CPU·메모리·디스크·가동 시간. RFC 2790 |
| IF-MIB | Interfaces MIB | 포트 목록·상태·속도·트래픽 카운터. RFC 2863 |
| IP-MIB | Internet Protocol MIB | 인터페이스 IP 주소, ARP 테이블. RFC 4293 |
| LLDP-MIB | Link Layer Discovery Protocol MIB | 내 장비·이웃 장비 정보(링크 양 끝). IEEE 802.1AB |
| MAU-MIB | Medium Attachment Unit MIB | 포트 매체 유형(구리·광). RFC 4836 |
| Q-BRIDGE-MIB | IEEE 802.1Q (VLAN) Bridge MIB | VLAN 정보, VLAN별 MAC 테이블. RFC 4363 |
| SNMPv2-MIB | SNMP version 2 MIB | 장비 기본 정보(`sysName`, `sysLocation`, `sysObjectID`, `sysUpTime`). RFC 3418 |
| UCD-SNMP-MIB | UC Davis SNMP MIB | Linux load average·메모리. Net-SNMP 제공, 표준 아님 |
| 제조사 MIB | — | 제조사 전용 MIB(`1.3.6.1.4.1` 아래). 예: CISCO-PROCESS-MIB, CISCO-MEMORY-POOL-MIB. 네트워크 장비 CPU·메모리·환경 |

## MIB 항목 이름

| 용어 | 풀이 | 뜻 |
|---|---|---|
| `ent` | entity | ENTITY-MIB 항목 접두어 |
| `hr` | host resources | HOST-RESOURCES-MIB 항목 접두어 |
| `if` | interface | IF-MIB 항목 접두어 |
| `ifHC` | interface High Capacity | IF-MIB 64비트 카운터(예: `ifHCInOctets`) |
| `lldpLoc` | LLDP local | LLDP-MIB의 내 장비 정보 |
| `lldpLocManAddr` | LLDP local Management Address | LLDP-MIB의 내 장비 관리 주소. NMS가 장비에 접속할 때 쓰는 주소 |
| `lldpRem` | LLDP remote | LLDP-MIB의 상대 장비 정보 |
| `lldpRemManAddr` | LLDP remote Management Address | LLDP-MIB의 상대(이웃) 장비 관리 주소. 자동 발견 때 다음에 조회할 장비 주소로 쓴다 |
| `tp` | termination point | RFC 8345의 연결 끝점(= 인터페이스) |
| Admin | Administrative | 관리자가 정한 상태(예: `ifAdminStatus`) |
| Octets | — | 바이트. 네트워크 표준은 정확히 8비트를 뜻하는 octet을 쓴다 |
| Oper | Operational | 실제 동작 상태(예: `ifOperStatus`) |

## 측정값

| 용어 | 풀이 | 뜻 |
|---|---|---|
| RTT | Round-Trip Time | 요청을 보내고 응답이 올 때까지 걸린 시간. ping 지연 |
| 게이지(Gauge) | — | 지금 이 순간의 값(예: CPU %, 온도). 읽은 값 그대로 쓴다 |
| 랩(wrap) | counter wrap | 카운터가 최댓값을 넘어 0으로 돌아가는 것. 32비트 `ifInOctets`는 1Gbps에서 약 34초 |
| 손실률(packet loss) | — | 보낸 요청 중 응답이 안 온 비율. (보낸 수 - 받은 수) ÷ 보낸 수 |
| 임계값(Threshold) | — | 넘으면 경보를 내는 기준 값(예: CPU 90%가 5분 지속) |
| 지터(jitter) | — | 지연(RTT)이 얼마나 흔들리는가. 음성·영상 품질 지표. Linux `ping`의 `mdev` |
| 카운터(Counter) | — | 계속 늘어나기만 하는 누적값(예: 받은 바이트 수). 두 번 읽은 **차이 ÷ 시간**으로 속도를 구한다 |

## 수집·관리 프로토콜

| 용어 | 풀이 | 뜻 |
|---|---|---|
| ARP | Address Resolution Protocol | 같은 L2 망에서 IP 주소로 MAC 주소를 찾는 프로토콜. RFC 826 |
| CDP | Cisco Discovery Protocol | LLDP의 시스코 전용판 |
| Echo Request / Reply | — | ping이 보내는 ICMP 요청(type 8)과 응답(type 0). ICMPv6는 128 / 129 |
| gNMI | gRPC Network Management Interface | 구독해 두면 장비가 데이터를 계속 보내는 스트리밍 텔레메트리 프로토콜 |
| ICMP | Internet Control Message Protocol | ping(echo request / reply)이 쓰는 프로토콜. L3 |
| IPFIX | IP Flow Information Export | NetFlow를 표준화한 흐름 정보 형식. RFC 7011 |
| LLDP | Link Layer Discovery Protocol | 장비끼리 "내 몇 번 포트에 누가 붙어 있다"를 주고받는 표준. IEEE 802.1AB |
| NACM | NETCONF Access Control Model | YANG 데이터에 노드·경로 단위 접근 제어. RFC 8341 |
| NETCONF | Network Configuration Protocol | YANG 모델 데이터를 읽고 설정하는 프로토콜(SSH 위). RFC 6241 |
| NetFlow | — | 장비가 "누가 누구와 얼마나" 통신했는지 흐름 정보를 보내는 시스코 형식 |
| NTP | Network Time Protocol | 장비 시계를 맞추는 프로토콜. 이벤트 순서의 근거 |
| OWAMP · TWAMP | One-Way / Two-Way Active Measurement Protocol | 단방향 · 양방향 지연·손실을 정밀 측정하는 표준. RFC 4656, RFC 5357 |
| RESTCONF | — | NETCONF와 같은 YANG 데이터를 HTTP로 다루는 프로토콜. RFC 8040 |
| sFlow | sampled Flow | 패킷을 샘플링해 흐름 정보를 보내는 방식 |
| syslog | system log | 장비·서버가 로그 문장을 보내는 표준 형식(RFC 5424). 보통 UDP 514 |
| traceroute | — | TTL을 1씩 늘려 보내 Time Exceeded를 돌려준 라우터들로 경로를 찾는 도구 |
| UDLD | UniDirectional Link Detection | 시스코 기능. 광 링크에서 한쪽 방향만 통하는 상태(한 가닥 고장)를 감지해 포트를 막는다 |
| YANG | Yet Another Next Generation | 네트워크 데이터 모델 언어 |

## 망 구조

| 용어 | 풀이 | 뜻 |
|---|---|---|
| CoPP | Control Plane Policing | 장비 자신(CPU)에게 오는 트래픽(ICMP 등)의 속도를 제한하는 기능. ping RTT가 높게 보이는 원인 |
| L2 / L3 / L4 | Layer 2 / 3 / 4 (데이터 링크 / 네트워크 / 전송 계층) | MAC(Media Access Control) 주소 / IP(Internet Protocol) 주소 / TCP(Transmission Control Protocol)·UDP(User Datagram Protocol) 포트로 전달 ([[cs/network/001_osi_layers\|OSI 7계층과 TCP/IP 4계층]]) |
| LAG | Link Aggregation Group | 여러 링크를 하나로 묶은 것(Port-channel) |
| LSP | Label Switched Path | MPLS에서 라벨로 정한 경로. **단방향**이라 왕복하려면 LSP 2개가 필요하다 |
| MPLS | Multi-Protocol Label Switching | IP 주소 대신 짧은 라벨을 붙여 정해 둔 경로로 패킷을 보내는 방식. 통신사·대형 망에서 쓴다 |
| NAT | Network Address Translation | 라우터·방화벽이 패킷의 IP 주소(와 포트)를 바꿔 내보내는 것. 사설망 여러 대가 공인 IP 하나를 나눠 쓴다. NAT 뒤 장비는 바깥에서 먼저 접속하기 어려워 pull 수집이 막힌다. RFC 3022 |
| OOB | Out-of-Band | 사용자망과 분리된 관리 전용 망 |
| SDN | Software-Defined Networking | 컨트롤러가 망 설정을 중앙에서 프로그램으로 제어하는 방식 |
| SVI | Switched Virtual Interface | VLAN에 IP를 주는 논리 인터페이스 |
| TTL | Time To Live | IP 패킷이 거칠 수 있는 남은 홉 수. 라우터마다 1씩 줄고 0이면 버려진다 |
| VLAN | Virtual LAN (Local Area Network) | 스위치 안의 논리 네트워크 |

## 하드웨어

| 용어 | 풀이 | 뜻 |
|---|---|---|
| DOM | Digital Optical Monitoring | 광 모듈(SFP)이 알려주는 수신·송신 세기, 온도. SFF-8472 |
| PSU | Power Supply Unit | 전원 공급장치 |
| SFP | Small Form-factor Pluggable | 포트에 꽂는 광·구리 모듈 |

## 보안

자세한 내용은 [[cs/network/nms/security/index|보안]].

| 용어 | 풀이 | 뜻 |
|---|---|---|
| ACL | Access Control List | 허용·차단할 주소·포트 목록 |
| CVE | Common Vulnerabilities and Exposures | 공개된 취약점 번호(예: CVE-2023-20198) |
| IDS | Intrusion Detection System | 침입 탐지 시스템. 스캔을 공격으로 볼 수 있다 |
| MFA | Multi-Factor Authentication | 비밀번호 외 수단을 더하는 다중 인증 |
| mTLS | mutual TLS | 서버와 클라이언트가 서로 인증서를 확인하는 TLS |
| RBAC | Role-Based Access Control | 역할별로 볼 수 있는 범위·권한을 나누는 방식 |
| TLS | Transport Layer Security | 통신 암호화·인증 프로토콜(HTTPS의 S) |
