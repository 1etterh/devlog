---
title: Grafana Node Graph에 Join으로 상태를 합치면 노드가 회색이 되는 문제
type: archive
tags: [archive, grafana, node_graph, infinity_datasource, jsonata]
draft: true
---

**Q**: Node Graph에 인라인 nodes와 Prometheus 상태를 Join by field로 합쳤더니 노드가 모두 회색 빈 원이다. 왜?

**A**:
- Node Graph는 프레임 이름(`nodes`/`edges`)으로 노드 목록을 찾는데, Join이 새 프레임을 만들면서 이름이 사라짐 → edges만으로 노드를 만들어 회색으로 표시
- 해결: Infinity(backend 파서 = JSONata)가 Prometheus API를 직접 호출해서 고정 노드 + 서버 상태를 쿼리 하나로 만들면 프레임 이름이 `nodes`로 유지됨
- Infinity의 JSONata는 Go 구현이라 `data.result.{...}` 문법이 안 됨 → `$map` 사용
- 숫자 color는 반영되지 않음 → `"#73bf69"` 같은 색 문자열을 직접 반환, 단위는 mainstat를 문자열로 만들어 해결
