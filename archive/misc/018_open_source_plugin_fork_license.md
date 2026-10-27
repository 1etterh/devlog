---
title: 오픈소스 플러그인을 포크해 새 플러그인으로 만들 때의 저작권
type: archive
tags: [archive, open_source_license, plugin_fork, copyright]
draft: true
---

**Q**: 오픈소스 에디터 플러그인 두 개를 커스텀해서 새 플러그인으로 만들면 저작권 문제가 생기는가?

**A**:
- 원본 LICENSE가 기준: MIT/BSD는 고지만 유지하면 수정·재배포 가능, Apache는 NOTICE 유지와 변경 표시, GPL은 파생물도 GPL로 공개
- LICENSE 파일이 없으면 기본은 "모든 권리 보유" → 포크해서 배포하면 위험
- 두 코드를 합치면 라이선스 호환성 확인 (MIT + GPL → 전체 GPL)
- 개인 사용만 하면 사실상 무관, 배포 시 원작자 표기와 이름·ID 변경 필요
- 아이디어·기능은 저작권 대상이 아님 → 직접 재구현은 자유
