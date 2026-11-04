---
title: "토폴로지 데이터 표준(Standard)"
tags:
  - project
  - nms
  - RFC
  - IEEE
  - 자체정의
draft: false
---

토폴로지 **구조**는 IETF **RFC 8345**를 따르고, 각 항목의 **값**은 수집 표준(SNMPv2-MIB, IF-MIB, ENTITY-MIB, LLDP-MIB)을 따른다. 화면 표시·분류는 자체 정의.

## RFC 8345 구조

| 객체                | 표준 필드                                                                                                     | 우리 모델                                                     |
| ----------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| network           | `network-id`, `network-types`, `supporting-network`                                                       | 물리 맵 / 서비스 맵 (API로 나눔, 층 정보 없음)                           |
| node              | `node-id`, `supporting-node`                                                                              | [[projects/nms/data/topology/node|노드]] `id`. 서비스의 `hostNodeId` = `supporting-node` |
| termination-point | `tp-id`, `supporting-termination-point`                                                                   | [[projects/nms/data/topology/interface|인터페이스]] `id`, `ifName`                      |
| link              | `link-id`, `source`(`source-node`, `source-tp`), `destination`(`dest-node`, `dest-tp`), `supporting-link` | [[projects/nms/data/topology/link|링크]]. **표준은 단방향 2개, 우리는 무방향 1개**(변환 가능)          |

- **층 구조**: `supporting-*`로 위층 → 아래층을 잇는다(서비스 맵의 `svc-db` → 물리 맵의 `relay-01`). 장애 영향을 위아래로 따라가는 근거.
- **정하지 않는 것**: 상태, 유형, 위치, 화면 좌표. 수집 표준·자체 정의로 채운다.
- **계층별 확장**: RFC 8346(L3), RFC 8944(L2: VLAN·LAG, 우리에게 가장 가까움), RFC 8795(TE, 통신사용).
- **공신력**: Proposed Standard, 대체·갱신 없음(2026-11-03 확인). 구조·용어의 근거로는 충분하지만, 장비도 일반 NMS(Zabbix, LibreNMS)도 이 형식을 강제하지 않는다. 주로 SDN 컨트롤러·오케스트레이터끼리 주고받는 형식이다.

## 출처 문서

각 파일의 **출처** 열과 `tags`가 쓰는 문서. 상태는 rfc-editor.org 각 정보 페이지 기준(2026-11-03~04 확인).

### 공식 표준

IETF 표준 트랙 RFC, IEEE 표준, ITU-T 권고만 둔다.

| 약어 | 풀이 | 문서 | 상태 | 쓰는 곳 |
|---|---|---|---|---|
| SNMPv2-MIB | SNMP version 2 MIB | [RFC 3418](https://www.rfc-editor.org/rfc/rfc3418) | Internet Standard (STD 62) | 노드 `sysName`, `sysLocation` |
| IF-MIB | Interfaces MIB | [RFC 2863](https://www.rfc-editor.org/rfc/rfc2863) | Draft Standard | 인터페이스, 링크 상태·속도·트래픽 |
| ENTITY-MIB | Entity MIB (물리 구성품) | [RFC 6933](https://www.rfc-editor.org/rfc/rfc6933) | Proposed Standard | 노드 모델·제조사·일련번호, 구성품 |
| LLDP-MIB | Link Layer Discovery Protocol MIB | IEEE 802.1AB | IEEE 표준 | 링크 양 끝(이웃 장비) |
| IP-MIB | Internet Protocol MIB | [RFC 4293](https://www.rfc-editor.org/rfc/rfc4293) | Proposed Standard | 인터페이스 IP |
| Q-BRIDGE-MIB | IEEE 802.1Q (VLAN) Bridge MIB | [RFC 4363](https://www.rfc-editor.org/rfc/rfc4363) | Proposed Standard | 인터페이스 VLAN |
| MAU-MIB | Medium Attachment Unit MIB | [RFC 4836](https://www.rfc-editor.org/rfc/rfc4836) | Proposed Standard | 인터페이스 매체 유형 |
| RFC 8345 | — | [Network Topologies](https://www.rfc-editor.org/rfc/rfc8345) | Proposed Standard | 구조 전체 |
| RFC 8346 · 8944 · 8795 | L3 · L2 = Layer 3 · 2, TE = Traffic Engineering | [L3](https://www.rfc-editor.org/rfc/rfc8346) · [L2](https://www.rfc-editor.org/rfc/rfc8944) · [TE](https://www.rfc-editor.org/rfc/rfc8795) Topologies | Proposed Standard | 네트워크 층(범위 밖) |
| RFC 9179 | — | [Geographic Locations](https://www.rfc-editor.org/rfc/rfc9179) | Proposed Standard | 사이트 좌표 |
| RFC 8299 · 8466 | L3VPN · L2VPN = Layer 3 · 2 Virtual Private Network | [L3VPN](https://www.rfc-editor.org/rfc/rfc8299) · [L2VPN](https://www.rfc-editor.org/rfc/rfc8466) Service Delivery | Proposed Standard | 사이트 주소, 네트워크 서비스(범위 밖) |
| M.3100 | ITU-T 권고 M 시리즈(통신망 관리) 3100번 | [ITU-T M.3100](https://www.itu.int/rec/T-REC-M.3100) (2005-04 + 개정) | ITU-T 권고 | 사이트(장비 위치 `locationName`) |
| RFC 8632 · 3877 | — | [Alarm YANG](https://www.rfc-editor.org/rfc/rfc8632) · [Alarm MIB](https://www.rfc-editor.org/rfc/rfc3877) | Proposed Standard | 경보(범위 밖) |
| RFC 8343 · IEEE 802.1AX | — | [Interface Management](https://www.rfc-editor.org/rfc/rfc8343) · Link Aggregation | Proposed Standard · IEEE 표준 | 인터페이스 계층·LAG(범위 밖) |
| RFC 8348 · 4268 · 3433 | — | [Hardware YANG](https://www.rfc-editor.org/rfc/rfc8348) · [ENTITY-STATE-MIB](https://www.rfc-editor.org/rfc/rfc4268) · [ENTITY-SENSOR-MIB](https://www.rfc-editor.org/rfc/rfc3433) | Proposed Standard | 구성품(범위 밖) |
| RFC 9418 | — | [Service Assurance YANG](https://www.rfc-editor.org/rfc/rfc9418) | Proposed Standard | 네트워크 서비스 의존(범위 밖) |

### 참고 (표준 아님)

출처 열에서 `참고:`로 표시한다.

| 약어 | 풀이 | 문서 | 성격 | 쓰는 곳 |
|---|---|---|---|---|
| TMForum | TeleManagement Forum (통신 사업자 업계 단체). TMF = TM Forum 명세 번호 | [TMF674 Geographic Site](https://www.tmforum.org/oda/open-apis/directory/TMF674) (+ TMF673) | 업계 포럼 명세 | 사이트 |
| MEF | Metro Ethernet Forum (현 Mplify) | [MEF 79](https://www.mplify.net/resources/mef-79-address-service-site-and-product-offering-qualification-management-requirements-and-use-cases/) · MEF 122(현 Mplify 122.1) | 업계 포럼 명세 | 사이트(사업자 간, 범위 밖) |
| NetBox | — (제품명) | [Facilities](https://netbox.readthedocs.io/en/feature/features/facilities/) | 오픈소스 제품 모델 | 사이트 계층 |
| Docker | — (제품명) | [Engine API](https://docs.docker.com/reference/api/engine/) | 제조사 문서 | 서비스 |
| OpenTelemetry | — (CNCF = Cloud Native Computing Foundation) | [Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/) | CNCF 명세 | 서비스 연결 |
| Cisco | — (제조사명) | 캠퍼스 3계층(Core / Distribution / Access) 설계 가이드 | 제조사 가이드 | 노드 유형 |
| 행정구역코드 | SGIS = Statistical Geographic Information Service (통계지리정보서비스) | 행정안전부 법정동 코드 · 통계청 SGIS 코드 | 국가 코드 체계 | 사이트 지역 |
| RFC 9417, X.733, ivy 초안 | X.733 = ITU-T X 시리즈 733번(경보 보고), ivy = IETF Network Inventory YANG 작업 그룹 | Informational RFC · ITU-T 경보 분류 · `draft-ietf-ivy-network-inventory-yang` | 비표준 트랙 · 초안 | 범위 밖 단위 |

### 태그 규칙

- 출처 종류만 단다: `#RFC`(IETF) · `#IEEE` · `#ITU-T` = 공식 표준, `#참고` = 표준 아님, `#자체정의` = 이 프로젝트에서 정한 값이 있음.
- 문서 번호는 태그에 넣지 않고 본문 출처 열에 둔다.

## 용어

| 용어 | 풀이 | 뜻 |
|---|---|---|
| RFC / IETF | Request for Comments / Internet Engineering Task Force | 인터넷 표준 문서 / 그 문서를 만드는 표준화 기구 |
| IEEE / ITU-T | Institute of Electrical and Electronics Engineers / International Telecommunication Union – Telecommunication Standardization Sector | 이더넷·LLDP 표준 기구 / 국제전기통신연합 통신표준화 부문 |
| SNMP / MIB / trap | Simple Network Management Protocol / Management Information Base / — | 장비 정보를 읽는 프로토콜 / 읽을 수 있는 항목 정의 / 장비가 먼저 보내는 알림 |
| LLDP (CDP) | Link Layer Discovery Protocol (Cisco Discovery Protocol) | 장비끼리 "내 몇 번 포트에 누가 붙어 있다"를 주고받는 표준 (시스코 전용판) |
| YANG / gNMI | Yet Another Next Generation / gRPC Network Management Interface | 네트워크 데이터 모델 언어 / 장비가 데이터를 계속 보내는 스트리밍 방식 |
| SDN | Software-Defined Networking | 컨트롤러가 망 설정을 중앙에서 프로그램으로 제어하는 방식 |
| LAG | Link Aggregation Group | 여러 링크를 하나로 묶은 것 (Port-channel) |
| VLAN / SVI | Virtual LAN (Local Area Network) / Switched Virtual Interface | 스위치 안의 논리 네트워크 / VLAN에 IP를 주는 논리 인터페이스 |
| L2 / L3 / L4 | Layer 2 / 3 / 4 (MAC = Media Access Control, IP = Internet Protocol, TCP · UDP = Transmission Control · User Datagram Protocol) | MAC / IP / TCP·UDP 포트 계층 ([[cs/network/001_osi_layers|OSI 7계층과 TCP/IP 4계층]]) |
| `if` · `ifHC` · `ent` · `lldpLoc`·`lldpRem` · `tp` | interface · interface High Capacity · entity · LLDP local · LLDP remote · termination point | IF-MIB · 64비트 카운터 · ENTITY-MIB · LLDP 내 장비·상대 장비 · RFC 8345 termination point |
| Admin / Oper | Administrative / Operational | 관리자가 정한 상태 / 실제 동작 상태 |
| Octets | — | 바이트 |
