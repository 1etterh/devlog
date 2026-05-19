---
title: 왜 1GB는 1000MB인가 — SI 십진 단위와 IEC 이진 단위
type: archive
tags: [archive, storage_unit, binary_prefix, si_unit, iec_prefix]
draft: true
---

**Q**: bit→byte는 2^3인데, 왜 byte 이상 단위(KB/MB/GB)는 갑자기 1000 단위인가?

**A**:
- bit→byte(`2^3=8`)는 하드웨어 물리 고정값, byte 이상 접두사는 SI 국제단위계 차용(kilo=10^3)
- 초기 컴퓨터 엔지니어들이 `2^10=1024 ≈ 1000`이라며 1024를 kilo로 혼용 시작
- 1998년 IEC 표준화: 이진은 KiB/MiB/GiB(2의 거듭제곱), SI는 KB/MB/GB(10의 거듭제곱)
- HDD 제조사(SI)와 OS(이진) 혼용 → 500GB HDD가 OS에서 465GiB로 보이는 원인
