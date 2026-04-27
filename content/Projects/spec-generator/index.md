---
tags:
  - project
  - python
  - static_analysis
  - api_spec
  - code_generation
draft: true
---
> Java Spring 소스 코드를 정적 분석하여 API 명세서와 DB 설계서를 자동 생성하는 Python 도구

## 배경

백엔드 API가 수십 개씩 늘어나면 명세서를 수동으로 관리하기 어렵다. 코드와 문서가 따로 놀면 결국 문서를 안 보게 된다. 소스 코드 자체를 분석해서 명세서를 자동 생성하면 항상 최신 상태를 유지할 수 있다.

## 구성

두 개의 독립 모듈로 구성된다.

| 모듈 | 입력 | 출력 |
|------|------|------|
| API 명세서 생성기 | Java Controller 소스 코드 | API 명세서 (Excel) |
| DB 설계서 생성기 | MariaDB information_schema | DB 설계서 (Excel) |

## 기술 스택

- Python 3.14+
- openpyxl (Excel 생성)
- pymysql (DB 접속)
- pyyaml (설정 파싱)
- 외부 프레임워크 없이 표준 라이브러리 (re, xml.etree) 활용

## 관련 글

1. [[001_api_spec_generation_pipeline|API 명세서 자동 생성 — 전체 파이프라인]]
2. [[002_java_source_static_analysis_scanner|Java 소스 정적 분석 — Scanner 구현]]
3. [[003_recursive_type_resolution|재귀적 타입 추론 시스템]]
4. [[004_mybatis_xml_parsing_type_fallback|MyBatis XML 파싱과 타입 폴백]]
5. [[005_audit_quality_measurement|명세서 품질 측정 — Audit 시스템]]
