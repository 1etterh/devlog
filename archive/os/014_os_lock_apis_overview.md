---
title: OS가 제공하는 락 API 종류
type: archive
tags: [archive, os, lock, mutex, semaphore, concurrency, synchronization]
draft: true
---

**Q**: OS가 제공하는 락 API에는 어떤 것들이 있고 의미론적으로 어떻게 다른가?

**A**:
- **Mutex**: 1개 스레드만 진입. 소유자 개념 있음. POSIX `pthread_mutex_*` / Win32 `CRITICAL_SECTION`
- **Semaphore**: N개까지 진입(카운팅). 소유자 개념 없음 → 신호용으로 적합. `sem_*` / `CreateSemaphore`
- **RWLock**: 읽기 동시 / 쓰기 배타. `pthread_rwlock_*` / `SRWLOCK`
- **Spinlock**: busy-wait. critical section이 매우 짧을 때만 의미. `pthread_spin_*`
- **CondVar**: 조건 만족까지 대기. mutex와 짝. `pthread_cond_*` / `CONDITION_VARIABLE`
- **File lock**: 프로세스 간. `flock`(fd 단위) / `fcntl(F_SETLK)`(바이트 범위) / `LockFileEx`
- **Atomic / CAS**: lock-free primitive. `__atomic_*` / `Interlocked*`

| 항목 | Mutex | Binary Semaphore |
|---|---|---|
| 소유자 | 잠근 스레드만 해제 | 누구나 post |
| 용도 | 상호 배제 | 신호 (생산자→소비자) |

Linux 사용자 공간 락은 거의 모두 `futex` 기반: 무경합 시 atomic CAS만 (시스템 콜 없음), 경합 시에만 `FUTEX_WAIT`/`FUTEX_WAKE`로 커널 진입. Windows의 `CRITICAL_SECTION`도 동일한 fast path 구조.

`flock`과 `fcntl` 락은 서로를 보지 못한다 — 같은 파일에 두 종류를 섞으면 안 된다.
