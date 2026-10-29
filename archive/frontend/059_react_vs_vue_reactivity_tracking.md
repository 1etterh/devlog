---
title: 반응형 데이터 추적은 React가 더 유리한가
type: archive
tags: [archive, react, vue, reactivity, frontend]
draft: true
---

**Q**: 반응형 데이터 추적은 React가 더 유리하다는데 사실인가?

**A**:
- "자동 의존성 추적(reactivity)"만 보면 **반대**: Vue/Solid/Svelte 5/Angular Signals는 값을 읽는 순간 의존성을 자동 등록하고 바뀐 곳만 갱신(fine-grained). React는 추적하지 않고 `setState` → 컴포넌트 재실행 → Virtual DOM diff
- React가 유리한 쪽은 **"변경을 사람이 추적·디버깅하기"**: 불변 업데이트 + 단방향 흐름이라 누가 언제 바꿨는지 명시적이고 예측 가능 (Redux DevTools 타임트래블 등)
- 그래서 "난이도는 더 어렵다"는 말은 맞음: 자동 추적이 없어서 `useMemo`/`useCallback`/`memo`, 의존성 배열, 불변 복사를 직접 관리해야 함 (React Compiler가 일부 자동화)
- 고빈도 실시간 데이터(대시보드)는 React 렌더 사이클을 우회하는 경우가 많음: Grafana는 RxJS 스트림 + 캔버스 차트(uPlot)를 직접 갱신
