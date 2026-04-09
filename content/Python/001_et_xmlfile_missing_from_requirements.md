---
title: packages 폴더와 requirements.txt 의존성 개수가 다를 때 - et_xmlfile
type: question
tags: [Python, pip, openpyxl, et_xmlfile, dependency-management]
draft: false
---

## 상황

폐쇄망 환경을 위해 `.whl` 파일을 `packages/` 폴더에 미리 준비해두었는데, `requirements.txt`에는 3개만 명시되어 있고 `packages/` 폴더에는 4개의 `.whl` 파일이 존재했다.

| packages/ 폴더 | requirements.txt |
|---|---|
| et_xmlfile-2.0.0 | - |
| openpyxl-3.1.5 | openpyxl |
| pymysql-1.1.2 | pymysql |
| pyyaml-6.0.3 | pyyaml |

## et_xmlfile이란?

`et_xmlfile`은 `openpyxl`의 종속 의존성(transitive dependency)이다. openpyxl이 Excel 파일의 XML 구조를 파싱할 때 내부적으로 사용하는 라이브러리로, `openpyxl`을 설치하면 자동으로 함께 설치된다.

## 왜 requirements.txt에 없는가?

`requirements.txt`에는 보통 프로젝트에서 **직접 사용하는 패키지**만 명시한다. `et_xmlfile`은 직접 import하여 사용하는 것이 아니라 `openpyxl`이 내부적으로 필요로 하는 패키지이므로 별도로 기재하지 않은 것이다.

## 폐쇄망 환경에서의 주의점

온라인 환경에서는 `pip install openpyxl` 시 자동으로 `et_xmlfile`까지 설치되지만, 폐쇄망에서는 인터넷 접근이 불가하므로 종속 의존성의 `.whl` 파일도 미리 준비해두어야 한다. 그래서 `packages/` 폴더에는 4개가 들어있는 것이다.
