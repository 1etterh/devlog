---
title: Vue/Nuxt에는 React Native 같은 게 있나
type: archive
tags: [archive, vue, nuxt, mobile, cross_platform]
draft: true
---

**Q**: Vue/Nuxt 진영에도 React Native 같은 네이티브 앱 프레임워크가 있나?

**A**:
- **공식 대응물은 없음**. React Native처럼 대규모 기업이 밀어주는 Vue 네이티브 렌더러는 부재
- 진짜 네이티브 UI: **NativeScript-Vue** (커뮤니티, 생태계 작음). Alibaba의 **Weex**는 사실상 중단
- 가장 흔한 선택: **Capacitor(+ Ionic Vue / Quasar)** — 웹뷰 안에서 Vue 앱을 돌리고 네이티브 API는 플러그인으로 호출하는 하이브리드
- 중국권: **uni-app** — Vue 문법으로 앱·미니프로그램·웹 동시 빌드
- Nuxt는 SSR 프레임워크라 앱으로 쓸 땐 `ssr: false`(SPA/정적 생성) 후 Capacitor로 감싸는 방식
