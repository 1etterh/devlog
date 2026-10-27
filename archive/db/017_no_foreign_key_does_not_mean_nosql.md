---
title: FK를 안 쓰면 차라리 NoSQL이 낫지 않은가
type: archive
tags: [archive, db, foreign_key, nosql, rdbms, schema_design]
draft: true
---

**Q**: FK를 안 쓰는 스키마라면 차라리 NoSQL을 쓰면 안 되나?

**A**:
- FK를 빼는 것과 관계형을 포기하는 것은 다르다. UNIQUE, 트랜잭션, 행 잠금 기반 큐 claim, JOIN, 스키마 강제는 FK 없이도 계속 쓴다
- 사용자-그룹-서비스 N:M 매핑처럼 데이터 자체가 관계형이면, NoSQL로 옮겨도 사라지는 건 FK뿐이고 나머지 기능은 애플리케이션에서 다시 구현해야 한다
- 데이터 규모가 작고 운영 중인 RDB가 이미 있으면 전환 이득이 없다
- NoSQL은 대량 append-only 로그·이벤트, 가변 스키마 문서, 캐시·세션처럼 일부 워크로드만 분리할 때 적합하다

결론: RDB를 중심에 두고, 필요한 워크로드만 떼어내는 하이브리드가 정석이다.
