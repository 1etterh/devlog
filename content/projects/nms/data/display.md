---
title: "화면 정보(Display)"
tags:
  - project
  - nms
  - 자체정의
draft: false
---

맵에서만 의미가 있는 값. 표준이 없어 모두 자체 정의.

| 항목 | 필수 | 용도 |
|---|---|---|
| 좌표(x, y) | O | 노드·서비스 고정 배치(`layout: 'none'`). 없으면 초기 위치를 정해 저장 |
| 숨김(hidden) | - | 추후. 삭제하지 않고 맵에서만 감춤 |

화면 공통: 상태별 색·라벨, 유형별 범례·모양·크기(`TOPOLOGY_STATUS`, `TOPOLOGY_NODE_TYPES`), 상태 요약 개수(노드에서 계산), 마지막 수집 시각(`checkedAt`, 서버 값).
