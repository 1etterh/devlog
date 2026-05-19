---
title: Phase 1 — 디스크 사용량 추적
type: project
tags: [project, docker, disk_full, du, df, troubleshooting]
draft: false
---

> 어디가 큰지부터 좁혀 나간 과정. 표준 흐름: `df -h` → `du --max-depth=1`을 단계별로 내려가기.

---

## 1-1. 디스크 마운트 전체 사용량

가장 먼저 어느 파일시스템이 꽉 찼는지 확인.

```bash
df -h
```

→ `/` 또는 `/home` 같은 마운트가 거의 100%면 그쪽을 추적.

---

## 1-2. 루트부터 한 단계씩 내려가며 큰 디렉토리 찾기

```bash
sudo du -h --max-depth=1 / 2>/dev/null | sort -hr | head -20
```

**실제 결과**:
```
2.4T    /home
2.4T    /
11G     /var       ← Docker 기본 경로(/var/lib/docker)는 비어있음
7.3G    /opt
4.8G    /data
4.7G    /usr
147M    /boot
...
```

핵심 관찰:
- `/home`이 단독 2.4TB.
- `/var`가 고작 11GB → **Docker가 기본 경로에 데이터를 쌓고 있지 않다**는 단서. data-root가 어디론가 옮겨졌음을 의미.

---

## 1-3. `/home` 안으로 한 단계 더

```bash
sudo du -h --max-depth=1 /home 2>/dev/null | sort -hr | head -20
```

**실제 결과**:
```
2.4T    /home/group
7.0G    /home/user-001
6.9G    /home/user-002
975M    /home/user-003
920M    /home/user-004
...
```

→ `/home/group` 단독으로 2.4TB. 다른 사용자 디렉토리는 정상 범위.

---

## 1-4. 계속 좁히기

```bash
sudo du -h --max-depth=1 /home/group 2>/dev/null | sort -hr | head -20
```

**실제 결과**:
```
2.4T    /home/group
2.2T    /home/group/docker      ← Docker 데이터 발견
```

→ Docker가 `/home/group/docker`에 2.2TB를 쌓고 있음. `/var/lib/docker`(기본 경로)가 아님.

---

## 1-5. Phase 1 요약

| 단계 | 명령 | 발견 |
|---|---|---|
| 1 | `df -h` | `/home` 마운트 거의 100% |
| 2 | `du -h --max-depth=1 /` | `/home`이 2.4TB |
| 3 | `du -h --max-depth=1 /home` | `/home/group`이 2.4TB |
| 4 | `du -h --max-depth=1 /home/group` | `/home/group/docker`이 2.2TB |

**다음 Phase**: `/home/group/docker` 안 구조 분석 → [[002_docker_data_root_structure]]

---

## 일반화된 추적 패턴

```bash
# 시작 — 마운트 단위
df -h

# 큰 마운트를 발견하면 그 안으로
sudo du -h --max-depth=1 <path> 2>/dev/null | sort -hr | head -20

# 가장 큰 서브디렉토리로 들어가서 위 명령 반복
# 보통 3~5단계면 진짜 범인이 나옴
```

대화형으로 더 편하게 하려면 `ncdu`:

```bash
sudo ncdu /
# 없으면: yum install ncdu / apt install ncdu
```

방향키로 폴더 진입하며 큰 디렉토리 추적 가능.

---

## 흔한 디스크 점유 위치

| 위치 | 흔한 원인 |
|---|---|
| `/var/log/` | 로테이션 안 된 로그 |
| `/var/lib/docker/` (또는 custom data-root) | 이미지·컨테이너·볼륨·**로그** 누적 |
| `/tmp`, `/var/tmp` | 정리 안 된 임시파일 |
| `/home/*/.cache` | 빌드 캐시 |
| `/var/cache/yum`, `/var/cache/apt` | 패키지 캐시 |
| 애플리케이션 업로드/백업 디렉토리 | dump, tar.gz 누적 |

이번 사건은 Docker data-root가 `/home` 밑으로 옮겨져 있어 `/var`만 보고는 못 찾는 케이스였음.

---

## 보너스: `df`와 `du`가 안 맞을 때

```bash
sudo lsof +L1 | awk '$5=="REG" {print}' | sort -k7 -n | tail -20
```

→ 삭제됐는데 프로세스가 핸들 잡고 있는 파일 (자주 발생: 로그 로테이션 후 데몬이 재시작 안 됨). 해당 프로세스 재시작하면 회수.
