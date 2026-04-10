---
title: Quartz 그래프 태그 라벨 조건부 표시
type: implementation
tags: [implementation, quartz, graph, pixi_js, ui_customization]
draft: true
---

## 배경

Quartz 그래프에서 모든 태그 노드의 라벨이 표시되어 화면이 지저분했다. 현재 페이지에 연결된 태그와 hover 중인 노드의 이웃 태그만 라벨을 보여주고, 나머지는 점(노드)만 표시하도록 수정했다.

## 변경 내용

### 수정 파일

`quartz/components/scripts/graph.inline.ts`

### 핵심 로직

1. **centerAdjacentTags 사전 계산**: 현재 페이지 노드에 직접 연결된 태그 목록을 미리 계산

```typescript
const centerAdjacentTags = new Set<string>()
for (const l of graphData.links) {
  if (l.source.id === slug && l.target.id.startsWith("tags/")) {
    centerAdjacentTags.add(l.target.id)
  }
  if (l.target.id === slug && l.source.id.startsWith("tags/")) {
    centerAdjacentTags.add(l.source.id)
  }
}
```

2. **초기 라벨 alpha**: 현재 노드 + 인접 태그만 1, 나머지 0
3. **renderLabels()**: hover 시 이웃 태그도 라벨 표시, 해제 시 복원
4. **zoom 핸들러**: 비활성 태그 라벨은 zoom 레벨과 무관하게 숨김 유지

### 라벨 표시 조건 정리

| 상태  | 현재 노드 인접 태그 | hover 이웃 태그 | 그 외 태그 |
| ----- | ------------------- | --------------- | ---------- |
| 기본  | ✅ 표시             | ❌ 숨김         | ❌ 숨김    |
| hover | ✅ 표시             | ✅ 표시         | ❌ 숨김    |
| zoom  | ✅ 표시             | 상태 유지       | ❌ 숨김    |

## 결과

태그 노드 자체는 모두 표시되지만, 라벨은 관련 있는 태그만 조건부로 표시되어 그래프가 훨씬 깔끔해졌다.
