---
draft: true
---

S-box를 공유하는 E-box가 여럿 있는 경우 Race Condition의 가능성이 있음

1. S-box: Memory Address Space
2. E-box: CPU Process
3. Multiprocessor system
	1. 공유 메모리를 사용하는 프로세스들
	2. 커널 내부 데이터를 접근하는 루틴들 간
	예: 커널 모드 수행 중 인터럽트로 커널 모드 다른 루틴 수행시


### Race Condition 발생 시점
1. Kernel 수행 중 인터럽트 발생시
2. Process가 system call을 하여 kernel mode로 수행 중인데 context switch가 일어나는 경우
3. Multiprocessor에서 shared memory 내의 kernel data