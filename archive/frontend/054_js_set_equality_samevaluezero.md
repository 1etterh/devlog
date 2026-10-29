---
title: JS Set은 객체의 동일성을 어떻게 판단하는가
type: archive
tags: [archive, javascript, set, same_value_zero, hash_table]
draft: true
---

**Q**: 브라우저(JS)에서 Set에 들어가는 객체는 어떤 방식으로 같은지 판단하나?

**A**:
- 스펙상 비교 알고리즘은 **SameValueZero** — `===`와 같지만 `NaN`끼리는 같다고 봄 (`+0`/`-0`도 같음)
- 객체는 **참조(identity)**로만 비교. 내용이 같은 `{a:1}` 두 개는 서로 다른 원소
- Java의 `equals()/hashCode()` 같은 사용자 정의 동일성 훅이 없음 → 값 기반 키가 필요하면 문자열 직렬화 키나 `Map<key, obj>` 사용
- V8 내부는 해시 테이블(OrderedHashTable, 삽입 순서 유지). 객체는 처음 해싱될 때 **랜덤 identity hash**를 부여받아 저장, 문자열은 내용 기반 해시(시드 적용)
- Map의 키 비교도 동일하게 SameValueZero
