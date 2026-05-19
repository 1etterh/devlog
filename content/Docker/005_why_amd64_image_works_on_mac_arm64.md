---
title: "linux/amd64로 빌드한 Docker 이미지가 Mac(arm64)에서 작동하는 이유"
type: question
tags: [question, docker, platform, arm64, amd64, apple_silicon, rosetta, emulation]
draft: false
---

## 의문

`--platform linux/amd64`로 빌드한 이미지는 x86_64 전용인데, Apple Silicon Mac(arm64)에서 docker-compose가 왜 멀쩡히 작동하는가?

## 핵심 이유: Docker Desktop이 Rosetta 2로 AMD64를 투명하게 에뮬레이션한다

Docker Desktop for Mac(Apple Silicon)에는 **Rosetta 2 에뮬레이션 레이어**가 내장되어 있다. AMD64 명령어를 ARM64로 실시간 번역하기 때문에, 별도 설정 없이도 `linux/amd64` 이미지가 실행된다.

Docker Desktop → Settings → General → **"Use Rosetta for x86/amd64 emulation on Apple Silicon"** 옵션이 기본값으로 켜져 있다.

```
docker build --platform linux/amd64 ...
↓ 이미지에 amd64 메타데이터 고정됨
↓ docker-compose로 컨테이너 실행
↓ Docker Desktop → Rosetta 2가 AMD64 바이너리를 ARM64로 번역
↓ Mac에서 정상 실행
```

## Rosetta가 없다면?

Rosetta 옵션이 꺼져 있으면 QEMU 에뮬레이션으로 fallback한다. QEMU는 Rosetta보다 느리지만 동작은 한다. 둘 다 꺼진 경우에만 플랫폼 불일치 오류가 발생한다.

## 그렇다면 `--platform linux/amd64`는 언제 필요한가?

| 상황 | `--platform linux/amd64` 필요 여부 |
|---|---|
| Mac 로컬 개발만 | 불필요 (arm64가 더 빠름) |
| Linux amd64 서버에 배포할 이미지 빌드 | **필요** |
| CI/CD가 amd64 환경인데 Mac에서 테스트 | 필요 |
| npm, webpack 등 amd64 전용 바이너리 포함 패키지 | 필요 (arm64 빌드 시 설치 실패 방지) |

## 주의할 점

작동은 하지만 **에뮬레이션 오버헤드**가 있다. 로컬 개발에서 빌드/실행이 느껴진다면, `--platform`을 빼고 arm64 네이티브로 빌드하는 게 낫다. 배포용 amd64 이미지는 CI에서 따로 빌드하는 구조가 일반적이다.

## 요약

Docker Desktop for Mac이 Rosetta 2를 통해 AMD64 → ARM64 명령어 번역을 투명하게 처리하기 때문에, `linux/amd64` 이미지도 Apple Silicon에서 별도 설정 없이 작동한다. "독립적"이라기보다 **에뮬레이션 덕분에 동작**하는 것이다.
