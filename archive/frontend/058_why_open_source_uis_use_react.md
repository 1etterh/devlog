---
title: 오픈소스 프론트엔드는 왜 대부분 React인가
type: archive
tags: [archive, react, frontend, open_source]
draft: true
---

**Q**: 오픈소스 프로젝트의 웹 UI는 왜 대부분 React로 되어 있나?

**A**:
- **기여자 풀**: 가장 많은 개발자가 아는 프레임워크라서 외부 기여 진입장벽이 낮음 (오픈소스에 결정적)
- **시기**: 2016~2018년 AngularJS 1.x 지원 종료 시점에 마이그레이션 대상으로 React가 가장 유력했음 (Grafana도 AngularJS → React 전환)
- **라이브러리 성격**: 뷰 레이어만 담당해서 기존 앱에 점진적으로 넣기 쉽고, 플러그인을 "React 컴포넌트"로 받는 확장 구조를 만들기 좋음
- **생태계**: 차트·테이블·에디터·디자인 시스템 라이브러리가 가장 풍부, TypeScript 지원도 성숙
- **예외도 많음**: GitLab(Vue), Zabbix(PHP 서버 렌더링), Prometheus도 초기엔 Go 템플릿 → 이후 React로 교체. "대부분"은 유명 프로젝트 위주로 본 생존자 편향도 섞여 있음
