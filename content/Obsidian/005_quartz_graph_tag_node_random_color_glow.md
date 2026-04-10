---
title: Quartz 그래프 태그 노드 랜덤 색상 및 Glow 효과 강화
type: implementation
tags: [implementation, quartz, graph, pixi_js, ui_customization]
draft: true
---

## 배경

Quartz 그래프의 태그 노드가 단일 색상(`--tertiary`)으로 표시되어 단조로웠다. 태그 노드를 흰색/파랑/보라 사이의 랜덤 색상으로 변경하고, 기존 glow 효과도 해당 색상에 맞춰 강화하기로 했다.

## 변경 내용

### 수정 파일

`quartz/components/scripts/graph.inline.ts`

### 랜덤 색상 로직

```typescript
function randomTagColor(): string {
  const palette = [
    [255, 255, 255], // white
    [100, 140, 255], // blue
    [180, 120, 255], // purple
  ]
  const base = palette[Math.floor(Math.random() * palette.length)]
  const brightness = 0.6 + Math.random() * 0.4 // 60% ~ 100%
  // RGB 각 채널에 brightness 적용
}
```

- 3가지 기본색(흰, 파랑, 보라) 중 랜덤 선택
- 밝기를 60~100% 사이에서 랜덤 적용하여 다양한 톤 생성

### Glow 효과 변경

- 기존: `--light` CSS 변수 색상, alpha `0.008`
- 변경: 태그 노드의 랜덤 색상과 동일한 색상, alpha `0.015`로 강화
- 태그 노드의 glow가 자신의 색상과 일치하여 자연스러운 발광 효과

## 결과

태그 노드가 흰색/파랑/보라 계열의 다양한 밝기로 표시되며, 각 색상에 맞는 glow 효과가 적용되어 별자리 테마에 어울리는 시각적 효과를 가지게 되었다.
