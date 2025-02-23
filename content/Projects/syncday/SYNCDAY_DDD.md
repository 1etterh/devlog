---
tags:
  - ddd
  - domain
draft: false
description:
---
> SyncDay의 DDD 설계 방식 정리
# SyncDay [[DDD]] 설계

1. 진행 플랫폼: Confluence
2. Confluence 사용 이유:  Sticker의 색으로 각 이벤트를 정의하고, DDD가 1차적으로 완료되면 JIRA의 이슈로 변형할 수 있으며, 이후 해당 이슈를 GitHub과 연동하여 기획 단계와 개발 사이의 일치성을 확대하고자 함.


_Confluence 화이트보드 캡쳐_
![[01.Domain Event Deduction.png]]
> 이렇게 정의된 Event를 하나의 이슈로 생성하면 JIRA에 자동으로 생성된다.

_JIRA의 목록 페이지_
![[Pasted image 20250223140639.png]]

