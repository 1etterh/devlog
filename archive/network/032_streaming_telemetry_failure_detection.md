---
title: Streaming telemetry를 쓰면 장애를 즉시 감지할 수 있나
type: archive
tags: [archive, network, streaming_telemetry, monitoring, failure_detection]
draft: true
---

**Q**: Streaming telemetry를 쓰면 서버·장비 이상을 바로 감지할 수 있나?

**A**:
- 값·상태 변화(인터페이스 down, CPU 급증)는 장비가 바로 보내서(push, on-change) 폴링보다 훨씬 빨리 잡힌다
- 장비가 죽은 경우는 보낼 주체가 없으므로, 받는 쪽이 "일정 시간 데이터 없음"으로 판단해야 한다 → 0초 감지는 불가
- 정상 종료는 세션이 끊긴 걸 수 초 안에 감지하고, 전원 차단·네트워크 단절은 keepalive 타임아웃만큼 늦다
- 감지 지연 = 수집 주기 + 판정 시간. 폴링 방식도 이 두 값을 줄이면 30초~1분 수준이 된다

Streaming telemetry(gNMI, gRPC)는 주로 네트워크 장비 기능이고, 서버에서는 OpenTelemetry·Telegraf 같은 push 에이전트가 비슷한 역할을 한다.
