---
title: 여러 프로젝트 폴더를 열 때 WebStorm이 VS Code보다 무거운 이유
type: archive
tags: [archive, webstorm, vscode, ide_indexing, performance]
draft: true
---

네, 가장 큰 이유는 인덱싱입니다. 두 도구는 일하는 방식이 다릅니다. WebStorm은 열자마자 전부 미리 분석하고, VS Code는 필요할 때만 분석합니다.

## 동작 비교

| | WebStorm | VS Code |
|---|---|---|
| 폴더를 열 때 | 폴더 **전체를 미리 색인** (심볼, 참조, 파일 구조) | 색인하지 않음. 파일 트리만 보여줌 |
| 여러 프로젝트가 든 폴더 | 통째로 **하나의 프로젝트**로 보고 하위 프로젝트들의 node_modules까지 전부 색인 | 연 파일이 속한 `tsconfig` 단위로만 분석 |
| node_modules | 라이브러리로 보고 `.d.ts` 등 타입 정의를 색인 | tsserver가 import한 것만 그때 읽음 |
| 전체 검색 | 만들어 둔 색인으로 즉시 검색 | 검색할 때마다 ripgrep으로 파일을 훑음 |
| 코드 검사 | 열린 파일을 계속 검사 (inspection) | ESLint 등 설치한 확장만 실행 |
| 실행 환경 | JVM (기본 메모리 사용량 자체가 큼) | Electron과 확장별 프로세스 |

정리하면 WebStorm은 열 때 비용을 먼저 치르고, 대신 리팩터링·참조 찾기·전체 검색이 빠르고 정확합니다. VS Code는 처음엔 가볍지만, 프로젝트 전체를 아는 기능은 WebStorm보다 약합니다.

## 인덱싱 말고 더 무거워지는 이유

- **하위 프로젝트마다 node_modules가 있습니다.** 각각 500~800MB라서 하위 프로젝트가 많을수록 색인량이 그만큼 늘어납니다.
- **git 저장소가 여러 개면** WebStorm이 각각을 VCS 루트로 잡고 변경 사항을 계속 감시합니다.
- **설정 파일이 바뀌면 다시 색인합니다.** `pnpm install`이나 브랜치 전환으로 node_modules나 lock 파일이 바뀔 때마다 재색인이 일어나서, CPU 700%가 나오기도 합니다.

## 가볍게 쓰는 방법

1. **하위 프로젝트는 따로 열기**: 상위 폴더 대신 실제 작업할 프로젝트만 엽니다. 여러 개를 같이 봐야 하면 Open → **Attach**로 붙이는 편이 낫습니다.
2. **필요 없는 폴더는 제외**: `dist`, `build`, `coverage`, 아카이브 폴더 등을 우클릭 → Mark Directory as → Excluded로 지정합니다.
3. **Power Save Mode**: File 메뉴에서 켜면 백그라운드 검사가 멈춥니다. 잠깐 문서만 볼 때 유용합니다.
4. **역할 나누기**: 여러 프로젝트를 훑어보는 용도는 VS Code, 한 프로젝트를 깊게 작업할 때는 WebStorm으로 나누면 두 도구의 장점을 같이 씁니다.
