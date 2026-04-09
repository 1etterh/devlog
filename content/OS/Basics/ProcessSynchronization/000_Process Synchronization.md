---
draft: true
---


# 1. Synchronization 문제
1. 공유 데이터(shared data)의 동시 접근(concurrent access)은 데이터의 불일치(inconsistency)를 발생시킬 수 있다.
2. 일관성(consistency) 유지를 위해서는 협력 프로세스(cooperating process) 간의 실행 순서(orderly execution)를 정해주는 메커니즘이 필요함


# 2. Race condition
1. 여러 프로세스들이 동시에 공유 데이터를 접근하는 상황
2. 데이터의 최종 연산 결과는 마지막에 그 데이터를 다룬 프로세스에 따라 달라짐

> Race condition을 막기 위해서 concurrent process는 동기화(synchronize) 되어야 한다.

