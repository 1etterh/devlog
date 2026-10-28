---
title: 로그성 테이블에 FK를 걸지 말지 판단하는 기준
type: archive
tags: [archive, db, foreign_key, audit_log, innodb, partitioning]
draft: true
---

**Q**: 로그성 테이블은 FK 사용 여부를 tradeoff로 계산해야 하는가?

**A**:
- 맞지만 로그성 테이블은 "FK 없음이 기본값, 예외만 검토"에 가깝다
- FK를 빼야 하는 신호: 로그가 부모보다 오래 살아야 함 / 파티셔닝 예정(InnoDB 파티션 테이블은 FK 미지원) / 부모가 쓰기 핫스팟(S lock 경쟁) / 실패·롤백도 기록 / 부모가 외부 DB
- 전부 해당 없을 때만 FK 고려 (부모가 soft delete만 하고, 쓰기가 드문 이력 테이블)
- FK를 빼면 LEFT JOIN, 애플리케이션 검증, 필요한 값을 스냅샷 컬럼으로 복사하는 것으로 보완한다

핵심 기준: "로그와 부모의 생명주기를 묶을 것인가?"
