---
draft: true
---

> CPU가 여러개인 경우 스케줄링은 더 복잡해짐
1. Homogeneous processor
	1. Queue에 한줄로 세워서 각 프로세서가 알아서 꺼내가게 할 수 있음
	2. 반드시 특정 프로세서에서 수행되어야 하는 프로세스가 있는 경우에는 문제가 더 복잡해짐
2. Load sharing
	1. 일부 프로세스에 job이 몰리지 않도록 부하를 적절히 공유하는 메커니즘 필요
	2. 별개의 Queue를 두는 방법 vs 공동 큐를 사용하는 방법
3. Symmetric Multiprocessing(SMP)
	각 프로세서가 각자 알아서 스케줄링 결정
4. Asymmetric multiprocessing
	하나의 프로세서가 시스템 데이터의 접근과 공유를 책임지고 나머지 프로세스는 거기에 따름
