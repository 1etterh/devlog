---
title: 동적 사이트는 React, 정적 사이트는 Vue인가
type: archive
tags: [archive, react, vue, ssg, frontend]
draft: true
---

**Q**: SNS 같은 동적 사이트는 React, 정적 사이트는 Vue 계열이 최적화에 유리하다는 말이 맞나?

**A**:
- 기술적 근거는 약함. 두 프레임워크 모두 SPA·SSR·SSG를 다 지원 (Next.js ↔ Nuxt, Docusaurus ↔ VitePress)
- SNS가 React인 건 **Meta가 React를 만들었고**(Facebook·Instagram·Threads) React Native와 코드·인력 공유, 대규모 채용 풀 때문
- 고빈도 갱신 성능만 보면 오히려 Vue의 세밀한 반응성이 유리한 면도 있음. React는 Concurrent 렌더링(`useTransition`)으로 우선순위 스케줄링에 강점
- 정적·콘텐츠 사이트 최적화의 핵심은 프레임워크가 아니라 **렌더링 전략**(SSG/SSR, JS 전송량 최소화, Astro의 island 등)
- 실제 선택 기준은 팀 숙련도·생태계·조직 규모가 더 큼 (Vue도 Bilibili, GitLab 같은 동적 서비스에서 사용)
