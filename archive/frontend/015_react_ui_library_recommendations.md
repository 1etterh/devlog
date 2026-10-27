---
title: React UI 라이브러리·템플릿 추천 정리
type: archive
tags: [archive, react, ui_library, frontend]
draft: true
---

**Q**: React UI 템플릿/라이브러리는 뭘 쓰면 좋은가?

**A**:
- **shadcn/ui** (+ Tailwind, Radix 기반): 코드를 복사해 소유하는 방식. 커스터마이징 자유도 최고, 현재 사실상 기본 선택지
- **MUI / Ant Design / Mantine**: 완성형 컴포넌트 세트. 관리자·대시보드·사내툴을 빠르게 만들 때 유리 (AntD는 테이블·폼 강함, Mantine은 훅·DX 좋음)
- **Headless (Radix UI, React Aria, Headless UI)**: 접근성·동작만 제공, 디자인 시스템 직접 구축 시
- **Chakra UI / HeroUI(구 NextUI)**: 스타일 props 기반, 빠른 프로토타이핑
- 템플릿: shadcn 블록·Tailwind UI(유료)·Refine/React-admin(관리자 CRUD)·Tremor(대시보드 차트)

선택 기준: 디자인 자유도 필요 → shadcn/headless, 속도·기능 많은 어드민 → AntD/MUI/Mantine.
