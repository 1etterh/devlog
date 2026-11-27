---
title: xyflow는 왜 d3를 쓰는가 — 그리는 엔진이 아니라 입력 처리 엔진
type: question
tags: [question, xyflow, d3, pan_zoom, drag, css_transform]
draft: true
---

## 의문

노드 그래프 라이브러리 xyflow(React Flow / Vue Flow)는 내부에서 d3를 쓴다. 그런데 노드는 여전히 노드마다 DOM 요소 하나씩이다. 그렇다면 d3 덕분에 가벼워진 게 아니라면, **d3는 어디에 필요해서 들어간 걸까?**

## 답

xyflow는 d3로 **아무것도 그리지 않는다.** 노드는 프레임워크 컴포넌트(div)가 그리고, 연결선은 프레임워크가 만드는 SVG `<path>`다. d3에서 가져온 건 **마우스·휠·터치 입력을 화면 이동·확대·끌기로 바꿔 주는 부분**뿐이다. 그래서 d3를 쓴다고 DOM이 가벼워지지는 않는다. 대신 **화면 이동·확대 비용**이 작아진다.

### 가져다 쓰는 d3 모듈 (`@xyflow/system` 의존성)

| 모듈 | 하는 일 | xyflow에서 쓰는 곳 |
|---|---|---|
| `d3-zoom` | 휠·트랙패드 핀치·끌기·터치 → `{x, y, k}` 변환값 | 캔버스 화면 이동·확대, min/max 배율, 이동 범위 제한 |
| `d3-drag` | 포인터 끌기 시작·이동·끝, 클릭과 끌기 구분 | 노드 끌기 |
| `d3-interpolate` | 두 화면 상태 사이 보간(`interpolateZoom`) | `fitView`·`setCenter`의 부드러운 이동 애니메이션 |
| `d3-selection` | DOM 요소에 위 동작 붙이기, `pointer()` 좌표 계산 | 연결 코드 |

d3 하면 떠오르는 데이터 바인딩(`enter/update/exit`), 스케일, 축, force 레이아웃은 쓰지 않는다.

### 가벼워지는 곳: 화면 이동·확대

d3-zoom이 계산한 변환값은 **뷰포트 요소 하나의 CSS `transform`**으로만 들어간다.

```html
<div class="vue-flow__viewport" style="transform: translate(81px, 107px) scale(0.69)">
  <!-- 노드 div · 연결선 svg 전부 이 안에 -->
</div>
```

- 화면을 끌거나 확대해도 노드 좌표는 바뀌지 않는다. 스타일 하나만 바뀐다
- 브라우저는 레이아웃을 다시 계산하지 않고 합성(compositing)만 다시 한다 → 노드가 많아도 이동·확대가 부드럽다
- 노드 하나를 끌 때만 그 노드의 `transform`이 바뀐다

```mermaid
flowchart LR
  I[휠 · 핀치 · 끌기 · 터치] --> Z[d3-zoom<br/>입력 정규화 + 배율 계산]
  Z --> T["transform {x, y, k}"]
  T --> V[뷰포트 div 1개의 CSS transform]
  V --> N[노드 div N개 · 연결선 svg<br/>다시 그리지 않음]
```

### 직접 짜지 않는 이유: 입력 처리의 예외 상황

| 직접 짜면 걸리는 것 | d3-zoom / d3-drag가 처리 |
|---|---|
| 트랙패드 핀치는 `ctrlKey`가 붙은 wheel 이벤트로 들어온다 | 확대로 해석 |
| 브라우저마다 wheel `deltaMode`(픽셀/줄/페이지)가 다르다 | 값 정규화 |
| 마우스 포인터 위치를 중심으로 확대 | 변환값 계산에 포함 |
| 두 손가락 터치(핀치·이동) | 멀티 포인터 처리 |
| 조금 움직였을 때 클릭인지 끌기인지 | `clickDistance`로 구분 |
| 끄는 동안 글자가 선택되는 문제 | 기본 동작 막음 |

### 대가: d3의 기본 동작을 알아야 우회할 수 있다

입력 처리를 d3가 쥐고 있어서, 앱에서 클릭·끌기 규칙을 바꾸려면 d3 동작을 알아야 한다.

- 노드를 끌고 놓으면 click이 그대로 온다 → xyflow가 d3-drag의 클릭 억제를 꺼 두었기 때문 (`clickDistance`를 아주 큰 값으로 설정)
- 빈 곳에서 mousedown하면 d3-zoom이 화면 이동을 시작한다 → 직접 만든 박스 선택은 그보다 먼저 이벤트를 잡아야 했다
- xyflow 내장 선택 키를 켜면 그 키를 누르는 동안 d3-zoom의 끌기 이동이 꺼진다

## 비교: Canvas 기반 그래프와 무엇이 다른가

| | xyflow (DOM + d3) | ECharts (Canvas) |
|---|---|---|
| 그리기 | 노드마다 DOM 요소 | `<canvas>` 하나에 직접 그림 |
| 화면 이동·확대 | CSS transform 하나 (d3-zoom) | 매 프레임 캔버스를 다시 그림 (자체 엔진) |
| 노드 수가 많을 때 | DOM 수가 부담 (수천 개부터 느려짐) | 유리 |
| 노드 내용 | 프레임워크 템플릿·CSS 그대로 | 그림 요소로 다시 표현 |

## 정리

- xyflow에서 d3는 **그리기 엔진이 아니라 입력 엔진**이다. DOM 수는 그대로다
- 가벼워지는 곳은 화면 이동·확대다. 노드를 다시 그리지 않고 CSS transform 하나만 바꾼다. d3-zoom은 그 transform 값을 정확하게 만들어 준다
- 도입한 이유는 성능보다 **휠·핀치·터치·클릭과 끌기 구분 같은 입력 예외 상황을 직접 짜지 않기 위해서**다
