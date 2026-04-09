---
tags:
  - ddd
  - domain
draft: true
description:
---
> SyncDay의 DDD 설계 방식 정리
# SyncDay [[DDD]] 설계

1. 진행 플랫폼: Confluence
2. Confluence를 통한 DDD 진행
	1. Sticker를 통해 이벤트 스토밍 진행
	2. DDD가 1차적으로 완료되면 JIRA의 이슈로 변형
	3. 이후 GitHub과 연동하여 기획 단계와 개발 사이의 일치성을 확보하고자 함.


_Confluence 화이트보드 캡쳐_
![[01.Domain Event Deduction.png]]
> Sticker형태로 정의된 Event를 우클릭하여 이슈 생성을 누르면 JIRA이슈로 변형된다.

_JIRA의 목록 페이지_
![[Pasted image 20250223140639.png]]

