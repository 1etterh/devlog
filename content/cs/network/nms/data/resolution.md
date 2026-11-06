---
title: "데이터 해상도(Resolution)"
tags:
  - network
  - nms
  - RFC
  - IEEE
draft: false
---

데이터를 **얼마나 잘게**(상세도), **자주**(시간), **정밀하게**(값) 다루는가. 올릴수록 정확하지만 수집 부하·저장량·화면 복잡도가 함께 는다.

## 상세도

| 수준 | 단위 | 링크 표현 |
|---|---|---|
| 그룹 | [[cs/network/nms/data/site\|사이트]] · 건물 · 층 | 묶어서(사이트 간 회선) |
| 장비 | [[cs/network/nms/data/topology/node\|노드]] | 장비 쌍당 1개, 이중화 구분 불가 |
| 인터페이스 | [[cs/network/nms/data/topology/interface\|인터페이스]] | 케이블당 1개, 이중화 구분 |
| LAG 멤버 | Port-channel + 멤버 | 논리 링크 1개 + 멤버 목록 |
| 서비스 | [[cs/network/nms/data/topology/service\|서비스]] | 호출 방향 화살표 |

**저장은 가장 잘게, 화면은 묶어서.** 잘게 저장한 것은 묶을 수 있지만 거칠게 저장한 것은 다시 쪼갤 수 없다.

## 시간

| 데이터 | 일반적인 수집 주기 | 수집 방식 |
|---|---|---|
| 토폴로지(링크 유무) | 수십 분 ~ 하루 | LLDP-MIB 이웃 테이블 |
| 장비 정보 | 하루 1회 / 변경 시 | ENTITY-MIB |
| 상태 | 1 ~ 5분 + 즉시 알림 | IF-MIB `ifOperStatus`, linkUp/linkDown trap |
| 트래픽·사용률 | 1 ~ 5분 | IF-MIB 64비트 카운터 두 번 읽은 차이 |

- **화면은 수집보다 새로울 수 없다.** 화면 갱신 주기는 수집 주기에 맞추고, 마지막 수집 시각을 함께 보여준다.
- 사용률은 수집 간격의 평균이라 순간 피크가 묻힌다. 이력은 오래될수록 평균으로 묶어(롤업) 저장한다.

## 값

| 항목 | 기준 | 근거 |
|---|---|---|
| 인터페이스 속도 | `ifHighSpeed`(Mbps). `ifSpeed`는 32비트 bps라 약 4.29Gbps에서 막힌다 | RFC 2863 |
| 트래픽 카운터 | 64비트 `ifHCInOctets`/`ifHCOutOctets`. 32비트는 10Gbps에서 약 3.4초에 한 바퀴 돈다(20Mbps 초과 인터페이스는 64비트 필수) | RFC 2863 3.1.6 |
| 상태 | 표준 값은 up / down / testing / dormant 등뿐. "경고" 같은 중간 단계는 제품마다 자체 기준 | IF-MIB `ifOperStatus` |
