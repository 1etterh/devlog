---
title: Windows와 macOS 경로 구분자 차이 - 백슬래시 vs 슬래시
type: error
tags: [OS, 경로, 파일시스템, Windows, macOS, Linux, 크로스플랫폼]
draft: false
---

## 증상

Spring Boot 프로젝트에서 `application.yml`에 설정된 라이센스 파일 경로가 `config\license`(백슬래시)로 되어 있었다. Windows에서는 정상 동작했지만, macOS에서 실행하면 "license key does not exist" 에러가 계속 발생했다.

## 원인 분석

### OS별 경로 구분자 처리 방식

| 구분자 | Windows | macOS/Linux |
|--------|---------|-------------|
| `/` (forward slash) | 디렉토리 구분자로 인식 | 디렉토리 구분자로 인식 |
| `\` (backslash) | 디렉토리 구분자로 인식 | **파일명의 일부**로 인식 |

macOS에서 `config\license`라고 쓰면 `config/license/` 디렉토리가 아니라 `config\license`라는 이름의 폴더를 찾는다. 이 폴더가 존재하지 않으면 파일을 찾을 수 없다는 에러가 발생한다.

### 실제 발생한 현상

1. macOS에서 `config\license` 경로를 참조하면서 해당 이름의 폴더가 실제로 생성됨
2. 정상 경로 `config/license/`의 파일들은 git에서 삭제 상태로 인식
3. 라이센스 키를 새로 생성해도 잘못된 경로에 들어가거나, 정상 경로의 파일이 삭제 상태여서 에러 지속

## 해결 방법

설정 파일의 경로를 forward slash(`/`)로 통일한다.

```yaml
# 잘못된 설정 (Windows에서만 동작)
license-file-path: config\license

# 올바른 설정 (크로스 플랫폼 호환)
license-file-path: config/license
```

## 핵심 정리

- **Forward slash(`/`)는 모든 OS에서 경로 구분자로 동작한다**
- YAML에서 따옴표(`"config/license"`)를 써도 OS의 파일 시스템 해석은 바뀌지 않는다
- 크로스 플랫폼 호환이 필요하면 항상 forward slash를 사용해야 한다
- Java의 `File.separator`나 `Path` 클래스를 사용하면 OS에 맞는 구분자를 자동으로 처리할 수 있다
