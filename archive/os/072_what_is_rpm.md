---
title: RPM이란 — 리눅스 패키지 형식과 오프라인 설치
type: archive
tags: [archive, linux, rpm, package_manager]
draft: true
---

**RPM**(RPM Package Manager, 원래 이름은 Red Hat Package Manager)은 **Red Hat 계열 리눅스에서 쓰는 소프트웨어 설치 파일 형식**이자, 그 파일을 다루는 도구 이름입니다. 윈도우의 `.msi`나 macOS의 `.pkg`에 해당합니다.

## 한 줄로 비교하면

| 구분 | Red Hat 계열 (RHEL, Rocky, CentOS, Fedora) | Debian 계열 (Ubuntu, Debian) |
|---|---|---|
| 패키지 파일 | `.rpm` | `.deb` |
| 저수준 도구 (파일 하나 설치) | `rpm` | `dpkg` |
| 고수준 도구 (의존성 자동 해결) | `dnf` (예전 이름 `yum`) | `apt` |
| 패키지 저장소 | yum/dnf 레포 | apt 레포 |

공공·금융 서버는 RHEL이나 Rocky Linux를 많이 써서, 폐쇄망 현장에서는 RPM을 자주 만납니다.

## 왜 오프라인 설치에서 중요한가

```mermaid
flowchart LR
    A[온라인 PC] -->|dnf download --resolve<br/>패키지 + 의존성 rpm 전부 받기| B[rpm 파일 묶음]
    B -->|USB 등으로 반입| C[오프라인 서버]
    C -->|createrepo로<br/>로컬 레포 생성| D[로컬 레포]
    D -->|dnf install| E[설치 완료]
```

- 프로그램 하나를 설치하려면 그 프로그램이 의존하는 다른 패키지들도 함께 필요합니다.
- 인터넷이 되면 `dnf`가 알아서 받아 오지만, 폐쇄망에서는 **의존성까지 전부 미리 받아서 반입**해야 합니다.
- 반입한 rpm 파일들을 `createrepo`로 **로컬 저장소(레포)**로 만들면, 오프라인 서버에서도 `dnf install`이 인터넷이 될 때처럼 의존성을 자동으로 해결합니다.

로드맵 0단계의 "로컬 RPM 레포 구성"이 바로 이 과정입니다. pnpm 오프라인 설치에서 `node_modules` 의존성을 미리 받아 반입한 것과 같은 원리인데, 대상이 OS 패키지라는 점만 다릅니다.

> 참고: 같은 약어 RPM이 회전 속도(Revolutions Per Minute, 예: HDD 7200RPM)를 뜻하기도 하지만, 리눅스 맥락에서는 항상 패키지 형식을 가리킵니다.
