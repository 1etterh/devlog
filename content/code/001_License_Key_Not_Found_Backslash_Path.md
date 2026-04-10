---
title: License key does not exist 에러 - 백슬래시 경로 문제
type: error
tags: [Spring Boot, YAML, path, backslash, macOS, cross-platform]
draft: true
---

## 에러

라이센스 키를 새로 생성해도 계속 "license key does not exist" 에러 발생

## 원인

`application-local.yml`, `application-beta.yml`의 license 경로가 `config\license`(백슬래시)로 설정되어 있었음. macOS에서는 `\`를 디렉토리 구분자가 아닌 파일명의 일부로 인식하여 `config\license`라는 별도 폴더가 생성됨.

## 해결

- yml 파일의 경로를 `config/license`(forward slash)로 통일
- 잘못 생성된 `config\license/` 디렉토리 삭제
- git staging에서 삭제된 정상 파일 복원
