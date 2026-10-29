---
title: Prometheus 위의 화면 — Grafana vs 자체 Nuxt 화면
type: archive
tags: [archive, grafana, nuxt, prometheus, monitoring]
draft: true
---

**Q**: Prometheus 위에 올릴 화면으로 Grafana와 자체 Nuxt 화면 중 무엇이 나은가?

**A**:
- 판단 기준은 "보기만 하는가, 업무 기능이 있는가"
- 보기만 하는 것이 목적이면 Grafana: 컨테이너 하나만 추가하면 되고, 공개 대시보드(node_exporter Full, ID 1860)를 가져와 바로 쓸 수 있으며 기간 선택·확대·비교가 이미 들어 있음
- 자체 화면이 필요한 경우: 사내 SSO·기존 관리 시스템 통합, 서버 등록·알림 처리·이력 같은 업무 흐름, 제품화
- 같이 쓰는 구성도 흔함: Grafana는 운영자 분석용, 자체 화면은 업무용 (Grafana 패널 iframe 임베드는 인증이 까다로워서 비추천)

작은 규모 테스트에서는 Grafana로 필요한 지표를 먼저 확인하고, 업무 요구가 생기면 자체 화면으로 넓히는 순서가 효율적이다.
