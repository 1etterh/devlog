---
title: Quartz 그래프 태그 노드 모양 변경 (별 → 점)
type: implementation
tags: [implementation, quartz, graph, pixi_js, ui_customization]
draft: true
---

## 배경

Quartz 블로그의 그래프 뷰에서 태그 노드가 별(star) 모양으로 렌더링되고 있었다. 일반 노드는 원(circle)인데 태그만 별 모양이라 시각적으로 통일감이 떨어져, 태그 노드도 점(원)으로 변경하기로 했다.

## 변경 내용

### 수정 파일

`quartz/components/scripts/graph.inline.ts`

### 변경 전

```typescript
if (isTagNode) {
  gfx.star(0, 0, 5, r * 2, r * 1.4).fill({ color: computedStyleMap["--tertiary"] })
} else {
  gfx.circle(0, 0, r).fill({ color: isCenterNode ? "#ffffff" : nodeColor })
}
```

### 변경 후

```typescript
if (isTagNode) {
  gfx.circle(0, 0, r).fill({ color: computedStyleMap["--tertiary"] })
} else {
  gfx.circle(0, 0, r).fill({ color: isCenterNode ? "#ffffff" : nodeColor })
}
```

### 핵심 변경점

- Pixi.js의 `Graphics.star()` → `Graphics.circle()`로 변경
- 태그 노드의 색상(`--tertiary`)은 그대로 유지하여 일반 노드와 구분 가능
- 크기(radius `r`)도 일반 노드와 동일하게 적용

## 결과

그래프 뷰에서 태그 노드가 별 모양 대신 원(점)으로 표시되어, 전체적으로 깔끔한 노드 스타일로 통일되었다.
