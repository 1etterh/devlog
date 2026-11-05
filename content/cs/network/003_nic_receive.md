---
title: 패킷은 NIC에서 프로세스까지 어떻게 가나?
type: question
tags: [question, network, nic, kernel, packet]
draft: false
---

## NIC는 무엇을 보나?

패킷을 받는 카드는 **NIC**(Network Interface Card)다. NAC은 보통 Network Access Control(802.1X 등으로 단말의 망 접속을 허용·차단하는 보안 기능)을 뜻해 다른 것이다.

NIC로는 **물리 포트**(`eth0`)로 들어온다. NIC는 **포트 번호를 모른다.** 포트 번호를 보고 프로세스를 고르는 건 OS 커널이다.

## 수신 과정

| 단계 | 누가 | 보는 것 | 하는 일 |
|---|---|---|---|
| ① 케이블 → 물리 포트 | NIC | 전기·광 신호 (L1) | 비트를 프레임으로 복원 |
| ② 프레임 필터 | NIC | 목적지 **MAC** (L2) | 내 MAC·브로드캐스트·멀티캐스트만 받고 나머지는 버림 (promiscuous 모드면 다 받음) |
| ③ 메모리로 | NIC → RAM | — | DMA로 메모리에 복사, 인터럽트로 CPU에 알림 |
| ④ IP 처리 | 커널 | 목적지 **IP** (L3) | 내 IP면 위로, 아니면 포워딩·버림. Docker의 DNAT(`호스트IP:A` → `컨테이너IP:B`)가 여기서 일어남 |
| ⑤ 소켓 찾기 | 커널 | 목적지 **포트 번호** + TCP/UDP (L4) | 그 포트에서 listen 중인 소켓을 찾음. 없으면 TCP는 RST, UDP는 ICMP port unreachable |
| ⑥ 프로세스 | 앱 | 데이터 (L7) | `recv()`로 읽음 (HTTP 파싱 등) |

계층마다 보는 주소가 다르다.

| 주소 | 질문 | 보는 쪽 |
|---|---|---|
| 물리 포트 (`eth0`) | 어디로 들어왔나 | NIC |
| MAC | 이 카드 앞이 맞나 | NIC |
| IP | 이 장비 앞이 맞나 | 커널 |
| 포트 번호 | 이 장비의 어느 프로세스인가 | 커널 |

Docker 컨테이너라면 물리 포트(`eth0`) → 논리 포트(`docker0` → `veth`) → 포트 번호로 프로세스를 찾아간다. [[cs/network/002_port_kinds|세 가지 포트]]를 차례로 지나는 셈이다.

## NIC가 포트 번호를 보는 경우

요즘 NIC는 성능을 위해 L3·L4 헤더를 일부 본다. 그래도 프로세스를 정하는 건 커널이다.

- RSS(Receive Side Scaling): IP·포트로 해시를 만들어 패킷을 여러 CPU 큐로 나눈다.
- 체크섬 오프로드: TCP/UDP 체크섬을 NIC가 대신 계산한다.
- SmartNIC / DPU: 방화벽·로드밸런싱까지 카드에서 처리한다(예외적인 경우).

계층 번호는 [[cs/network/001_osi_layers|OSI 7계층과 TCP/IP 4계층]] 참고.
