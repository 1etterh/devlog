---
title: "측정값(Metric)"
tags:
  - network
  - nms
  - RFC
  - 참고
draft: false
---

**대상 + 지표 + 시각 + 값** 하나. 주기마다 쌓이는 시계열(time series) 데이터다. 링크 "트래픽"·노드 "CPU"는 토폴로지 속성이 아니라 이 단위다.

## 정보

| 항목 | 뜻 | 예 |
|---|---|---|
| 대상 | 무엇을 쟀나. 토폴로지 객체를 참조 | 노드, 인터페이스, 구성품(센서), 서비스 |
| 지표 | 무엇을 쟀나 | `cpu`, `inOctets`, `temperature` |
| 시각 | 언제 쟀나 | 수집 시각 |
| 값 | 숫자 하나 | 37.5 |
| 종류 | 카운터 / 게이지 | 카운터는 차이로 속도를 구함, 게이지는 그대로 씀 |

## 가용성

| 지표 | 뜻 | 출처 | 비고 |
|---|---|---|---|
| ping 응답 | 응답했나 | ICMP echo | 가장 기본. 방화벽이 ICMP를 막으면 살아 있어도 실패 |
| ping 지연(RTT) · 손실률 | 얼마나 빨리, 몇 % 잃었나 | ICMP echo 여러 번 | 보통 한 번에 3~5개 보내 평균 |
| SNMP 응답 | 관리 응답이 오나 | SNMP GET 성공 여부 | ping은 되고 SNMP가 안 되면 **수집 실패**(장비 장애와 구분) |
| 가동 시간 | 켜진 뒤 지난 시간 | SNMPv2-MIB `sysUpTime`, 서버는 HOST-RESOURCES-MIB `hrSystemUptime` | 값이 줄면 그 사이 재시작. `sysUpTime`은 SNMP 에이전트 재시작으로도 0이 된다 |

## 성능

| 지표 | 대상 | 출처 | 종류 |
|---|---|---|---|
| CPU 사용률 | 서버 | HOST-RESOURCES-MIB `hrProcessorLoad`(코어별 최근 1분 평균 %) | 게이지 |
| | 네트워크 장비 | 제조사 MIB(예: CISCO-PROCESS-MIB `cpmCPUTotal5minRev`) | 게이지 |
| load average | 서버(Linux) | UCD-SNMP-MIB `laLoad` | 게이지 |
| 메모리 · 디스크 사용량 | 서버 | HOST-RESOURCES-MIB `hrStorageTable`(`hrStorageSize` · `hrStorageUsed` × `hrStorageAllocationUnits`) | 게이지 |
| | 네트워크 장비 | 제조사 MIB(예: CISCO-MEMORY-POOL-MIB) | 게이지 |
| 트래픽 | 인터페이스 | IF-MIB `ifHCInOctets` · `ifHCOutOctets`(64비트) | 카운터 |
| 오류 · 폐기 | 인터페이스 | IF-MIB `ifInErrors` · `ifOutErrors` · `ifInDiscards` · `ifOutDiscards` | 카운터 |

- **사용률** = (트래픽 카운터 증가량 × 8) ÷ 경과 초 ÷ (`ifHighSpeed` × 10⁶). 카운터는 바이트, 속도는 비트([[cs/network/nms/data/topology/index#왜-gigabit비트인가|왜 Gigabit인가]]).
- **64비트 카운터를 쓴다.** 32비트 `ifInOctets`는 1 Gbps에서 약 34초면 한 바퀴 돌아(2³² 바이트 ÷ 125 MB/s) 5분 주기로는 몇 바퀴 돌았는지 알 수 없다.
- **카운터가 0으로 돌아가면** 재시작이나 카운터 초기화다. 음수 속도를 그리지 않도록 버린다(IF-MIB `ifCounterDiscontinuityTime`).
- **오류**는 케이블·광 모듈 불량, **폐기**는 버퍼가 넘친 혼잡의 신호다.

## 하드웨어

주로 네트워크 장비. 값은 [[cs/network/nms/extension#하드웨어-구성품component|하드웨어 구성품]](센서·팬·전원)에 붙는다.

| 지표 | 출처 | 비고 |
|---|---|---|
| 온도 · 전압 · 팬 속도 | ENTITY-SENSOR-MIB `entPhySensorValue`(+ `entPhySensorType` · `entPhySensorScale`로 단위) | 지원 장비가 적어 제조사 MIB(예: CISCO-ENVMON-MIB)를 많이 쓴다 |
| 팬 · 전원 공급장치 상태 | ENTITY-STATE-MIB `entStateOper`, 제조사 MIB | 정상 / 고장 같은 상태값 |
| 광 모듈 수신 · 송신 세기 | 제조사 MIB(DOM 값) | dBm. 낮아지면 케이블·모듈 열화. 끊기기 전에 미리 알 수 있다 |

## 수집 방법

| 항목 | 방식 | 1순위 | 대안 | 비고 |
|---|---|---|---|---|
| 가용성 | 자동 | ping + SNMP GET | TCP 포트 접속 확인 | 보통 1분 주기 |
| 성능 · 하드웨어 | 자동 | SNMP 폴링 | 스트리밍 텔레메트리(gNMI), 서버 에이전트 | 보통 1~5분 주기 |

## 범위 밖

- **플로우(Flow)**: "누가 누구와 얼마나" 주고받았나. NetFlow / IPFIX(RFC 7011)·sFlow로 장비가 보낸다. 인터페이스 카운터는 양만 알려준다.
- **서비스 응답**: HTTP 응답 코드·시간, DB 쿼리 시간. 애플리케이션 감시(APM) 영역.
