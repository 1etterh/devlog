---
title: "수집(Collection)"
tags:
  - network
  - nms
  - RFC
  - IEEE
  - 참고
draft: false
---

[[cs/network/nms/data/topology/index|토폴로지]]·[[cs/network/nms/data/monitoring/index|감시]] 데이터를 장비·서버에서 **어떻게 가져오는가**. 같은 SNMP 폴링으로 노드·인터페이스도 채우고 트래픽·CPU도 채우므로 데이터와 따로 정리한다. 수집 경로의 보안은 [[cs/network/nms/security/collection|보안 › 수집 경로]].

## 두 축: 에이전트 유무 × 방향

"에이전트를 까는가"와 "누가 먼저 연결하는가"는 다른 축이다.

| | pull (NMS가 물으러 감) | push (대상이 보냄) |
|---|---|---|
| **에이전트 없음** (장비 내장 기능) | SNMP 폴링, ping, NETCONF, SSH CLI | SNMP trap, syslog, gNMI 텔레메트리 |
| **에이전트 설치** | Prometheus `node_exporter`, Zabbix passive agent | Telegraf, Zabbix active agent, Datadog, Elastic Beats |

- 네트워크 장비 안의 SNMP도 SNMP 용어로 "에이전트"다(NMS 쪽은 "매니저"). 장비에 처음부터 들어 있어서 따로 깔지 않는다.
- 네트워크 장비에는 보통 에이전트를 깔지 않는다. 폐쇄형 OS가 많고, Linux 기반(Arista EOS, NX-OS, SONiC)이라 깔 수 있어도 자원·제조사 지원·업그레이드·보안 문제로 피한다. → 장비는 **에이전트 없이(agentless)**, 서버는 에이전트를 **선택**.

| 항목 | pull | push |
|---|---|---|
| 방화벽 · NAT | NMS → 대상 포트가 열려 있어야 한다. NAT 뒤는 어렵다 | 대상 → NMS만 열면 된다 |
| 누가 있는지 | NMS가 **대상 목록**을 알아야 한다 | 모르는 대상이 보내올 수 있다 → **등록 · 인증** 필요 |
| 죽음 감지 | 물었는데 응답이 없으면 바로 안다 | 데이터가 **안 오는 것**으로 안다 → 타임아웃을 정해야 한다 |
| 부하 조절 | NMS가 주기 · 속도를 정한다 | 대상이 많으면 한꺼번에 몰린다 |
| 보안 | 대상이 포트를 열어 둔다 | 대상이 NMS 인증 정보를 가진다 |

## 수집 방법 목록

| # | 방법 | 방향 | 어떻게 | 가져오는 것 | 근거 | 대상 쪽 요구사항 |
|---|---|---|---|---|---|---|
| 1 | SNMP 폴링 | pull | 주기적으로 장비에 물어봄(GET / WALK) | 장비 기본 정보, 인터페이스, 구성품, 상태, 카운터 | SNMPv2-MIB, IF-MIB, ENTITY-MIB, IP-MIB, Q-BRIDGE-MIB | SNMP 활성화, 접속 정보(v2c community / v3 계정), UDP 161 허용 |
| 2 | SNMP trap · inform | push | 상태가 바뀌면 장비가 먼저 보냄 | 인터페이스 up / down, 재시작 등 즉시 알림 | IF-MIB `linkUp` / `linkDown`, SNMPv2-MIB | 받을 주소 설정, UDP 162 수신 허용 |
| 3 | syslog | push | 장비 · 서버가 로그 문장을 보냄 | 로그인 실패, 설정 변경, 하드웨어 경고 | RFC 5424 | 받을 주소 설정, UDP 514(TLS면 TCP 6514) |
| 4 | LLDP 이웃 조회 | pull | SNMP로 장비의 LLDP 이웃 테이블을 읽음 | 링크(내 포트 ↔ 상대 장비 · 포트), 상대 관리 주소 | LLDP-MIB(IEEE 802.1AB) | LLDP 활성화 |
| 5 | CDP 이웃 조회 | pull | SNMP로 시스코 CDP 이웃 테이블을 읽음 | 링크(시스코 구간) | 참고: CISCO-CDP-MIB(제조사 MIB) | 시스코 장비, CDP 활성화 |
| 6 | MAC · ARP 추정 | pull | 스위치 MAC 주소 테이블과 ARP 테이블을 맞춰 "어느 포트에 누가 붙었나" 추정 | LLDP 없는 구간의 링크(서버, 비관리 스위치) | BRIDGE-MIB(RFC 4188), Q-BRIDGE-MIB `dot1qTpFdbTable`, IP-MIB `ipNetToPhysicalTable` | SNMP. 틀릴 수 있다 |
| 7 | ping | pull | ICMP echo | 살아 있는지, 지연 · 손실 | ICMP | ICMP 허용 |
| 8 | NETCONF · RESTCONF | pull | YANG 모델 데이터를 요청 | SNMP와 같은 정보(장비가 지원하면) | RFC 6241, RFC 8040 | 최신 장비, NETCONF 활성화 |
| 9 | 스트리밍 텔레메트리 | push | 구독해 두면 장비가 주기마다 보내줌 | 상태 · 트래픽을 초 단위로 | 참고: gNMI / OpenConfig(업계 명세) | 최신 장비, gNMI 지원 |
| 10 | SSH CLI | pull | SSH로 `show …`를 실행하고 결과를 파싱 | 다른 방법으로 안 나오는 정보, 설정 백업 | 표준 없음(제조사별 출력) | SSH 계정. 제조사 · 버전마다 파서 필요 → 최후 수단 |
| 11 | Docker Engine API | pull | Docker 소켓 · API로 컨테이너 조회 | [[cs/network/nms/data/topology/service|서비스]](컨테이너, 상태, 이미지, 포트) | 참고: Docker Engine API | 소켓 접근 = root 권한과 같다 → 읽기 전용 프록시나 에이전트 권장 |
| 12 | 서버 에이전트 | push / pull | 서버에 수집 프로그램 설치 | 서버 측정값, 프로세스 · 컨테이너, TCP 연결(`ss` / conntrack) | 표준 없음 | 서버마다 설치 · 배포 |
| 13 | 애플리케이션 트레이스 | push | 서비스가 호출 기록을 보냄 | [[cs/network/nms/data/topology/dependency|서비스 연결]](누가 누구를 호출하나) | 참고: OpenTelemetry | 애플리케이션 코드 수정 |
| 14 | 가져오기(import) | — | CSV 일괄 등록, CMDB · NetBox 등 외부 시스템 연동 | 사이트, 장비 목록, 수동 링크 | 제품마다 다름 | — |
| 15 | 수동 입력 | — | 관리 화면에서 사람이 입력 | 사이트, 역할, 수동 링크, 맵 좌표 | — | — |

- 트래픽 흐름("누가 누구와 얼마나")은 NetFlow / IPFIX(RFC 7011) · sFlow로 장비가 보낸다. 지금 범위 밖([[cs/network/nms/data/monitoring/metric#범위-밖|감시 › 측정값]]).

## 방법별 비교

| # | 방법 | 정확도 | 실시간성 | 대상 부담 | 구현 난이도 |
|---|---|---|---|---|---|
| 1 | SNMP 폴링 | 높음 | 분 단위 | 낮음~중간 | 낮음(라이브러리 많음) |
| 2 | SNMP trap | 높음 | 즉시 | 낮음 | 중간(수신 서버 필요, 유실 가능) |
| 3 | syslog | 중간(파싱에 달림) | 즉시 | 낮음 | 중간~높음(제조사별 파싱 규칙) |
| 4 | LLDP | 높음 | 분~시간 단위 | 낮음 | 낮음 |
| 5 | CDP | 높음 | 분~시간 단위 | 낮음 | 낮음 |
| 6 | MAC · ARP 추정 | 중간~낮음 | 분 단위 | 중간(테이블이 큼) | 높음(추정 로직) |
| 7 | ping | 살아 있는지만 | 초~분 단위 | 매우 낮음 | 매우 낮음 |
| 8 | NETCONF | 높음 | 분 단위 | 중간 | 중간 |
| 9 | gNMI | 높음 | 초 단위 | 장비 지원 필요 | 높음 |
| 10 | SSH CLI | 높음 | 느림 | 중간~높음 | 높음(제조사별 파서) |
| 11 | Docker API | 높음 | 초~분 단위 | 낮음 | 낮음 |
| 12 | 서버 에이전트 | 높음 | 초~분 단위 | 서버에 설치 | 중간 |
| 13 | OpenTelemetry | 매우 높음 | 초 단위 | 앱 수정 | 높음 |

## 데이터별 수집 방법

항목별 1순위 · 대안은 각 데이터 문서의 "수집 방법"에 있다.

| 데이터 | 문서 |
|---|---|
| 사이트 | [[cs/network/nms/data/site#수집-방법|사이트 › 수집 방법]] |
| 노드 (발견 · 등록 경로 · 중복 판별 포함) | [[cs/network/nms/data/topology/node#수집-방법|노드 › 수집 방법]] |
| 인터페이스 | [[cs/network/nms/data/topology/interface#수집-방법|인터페이스 › 수집 방법]] |
| 링크 | [[cs/network/nms/data/topology/link#수집-방법|링크 › 수집 방법]] |
| 서비스 · 서비스 연결 | [[cs/network/nms/data/topology/service#수집-방법|서비스]] · [[cs/network/nms/data/topology/dependency#수집-방법|서비스 연결]] |
| 측정값 · 이벤트 | [[cs/network/nms/data/monitoring/metric#수집-방법|측정값]] · [[cs/network/nms/data/monitoring/event#수집-방법|이벤트]] |

## 수집기(Collector)

NMS가 큰 망을 볼 때는 실제로 장비에 묻는 **수집기**(poller / proxy)를 따로 둔다.

- 수집기는 별도 데이터 단위가 아니다. 수집기가 깔린 장비도 서버 [[cs/network/nms/data/topology/node|노드]]이고, 수집기는 그 노드가 맡은 **역할**이다.
- 망 분리 · 방화벽 때문에 중앙 서버가 모든 장비에 닿기 어렵다 → 사이트(구역) 안의 수집기가 장비에 묻고 중앙에는 결과만 올린다.
- 사이트당 수집기 수는 표준으로 정해져 있지 않다. 용량(장비 수 × 지표 수 ÷ 주기), 망 도달(구역이 갈리면 구역마다), 이중화(2대)로 정한다. 한 대가 작은 사이트 여러 개를 맡기도 한다.
- **장비 1대는 수집기 1대가 맡는다.** 둘이 같이 폴링하면 장비 CPU 부하와 데이터 중복이 생긴다. 이중화는 담당을 넘기는 방식.
- 수집기 자체 상태(heartbeat)를 봐야 "수집기 끊김"과 "장비 장애"를 구분한다.

주기 · 보관 기간은 [[cs/network/nms/data/resolution|데이터 해상도]].
