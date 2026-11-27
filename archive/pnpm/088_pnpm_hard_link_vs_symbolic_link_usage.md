---
title: pnpm의 하드링크와 심볼릭 링크는 각각 어디에 쓰이는가
type: archive
tags: [archive, pnpm, hard_link, symbolic_link, node_modules, content_addressable_store]
draft: true
---

간단히: **하드링크는 store → `.pnpm` 안의 "파일"**, **심볼릭 링크는 `node_modules` 안의 "폴더 구조"**에 씁니다.

## 구조

```mermaid
flowchart LR
    S["store (~/Library/pnpm/store)<br/>파일 내용 해시로 저장"]
    subgraph P["프로젝트/node_modules"]
        R["echarts (심볼릭 링크)"]
        subgraph V[".pnpm/echarts@6.1.0/node_modules"]
            E["echarts/ (실제 폴더)<br/>안의 파일들"]
            Z["zrender (심볼릭 링크)"]
        end
        Z2[".pnpm/zrender@6.1.0/node_modules/zrender"]
        H[".pnpm/node_modules/* (숨은 hoist, 심볼릭 링크)"]
    end
    S -- "하드링크 / clone (파일 단위)" --> E
    R -- symlink --> E
    Z -- symlink --> Z2
```

| 링크 | 위치 | 대상 | 이유 |
|---|---|---|---|
| **하드링크** | `.pnpm/<pkg>@<ver>/node_modules/<pkg>/` 안의 **각 파일** | 전역 store의 같은 파일 | 디스크에 한 번만 저장하고 여러 프로젝트가 공유 (용량·설치 속도) |
| **심볼릭 링크** | `node_modules/<pkg>` (직접 의존성) | `.pnpm/<pkg>@<ver>/node_modules/<pkg>` | package.json에 선언한 것만 루트에 노출 (엄격성) |
| **심볼릭 링크** | `.pnpm/<pkg>@<ver>/node_modules/<dep>` | `../../<dep>@<ver>/node_modules/<dep>` | 각 패키지가 자기 의존성만 형제로 보게 함 |
| **심볼릭 링크** | `.pnpm/node_modules/*` (숨은 hoist) | 각 패키지 폴더 | 의존성을 잘못 선언한 패키지를 위한 안전망 |
| **심볼릭 링크** | workspace 패키지 (`workspace:*`) | 로컬 패키지 폴더 | 소스 수정이 바로 반영 |

## 왜 나눠 쓰나

- **하드링크는 폴더에 못 겁니다.** 그래서 파일은 하드링크로 내용을 공유하고, 폴더 배치(누가 누구를 볼 수 있는지)는 심볼릭 링크로 만듭니다.
- **하드링크는 같은 파일시스템(디스크/볼륨) 안에서만 됩니다.** store와 프로젝트가 다른 디스크에 있으면 pnpm은 복사로 바꿉니다. 그래서 store는 디스크마다 하나씩 생깁니다.
- Node는 심볼릭 링크를 **실제 경로(realpath)로 바꿔서** 해석합니다. 그래서 echarts 안에서 `import 'zrender'`를 하면 실제 위치 `.pnpm/echarts@6.1.0/node_modules/echarts`에서 위로 올라가 형제 `zrender`를 찾습니다. 더 올라가면 `.pnpm/node_modules`(숨은 hoist)에 닿습니다. 앞의 "dev에서만 되는 유령 의존성" 문제가 여기서 생겼습니다.

## macOS에서는 사실 하드링크가 아닐 수 있다

`package-import-method` 기본값 `auto`는 **clone(copy-on-write) → hardlink → copy** 순서로 시도합니다. APFS(macOS)는 clone을 지원해서 하드링크 대신 clone을 씁니다.

이 프로젝트에서 확인해 보면:

```bash
$ stat -f "links=%l" node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/package.json
links=1   # 하드링크였다면 2 이상 → clone으로 들어옴
```

- clone도 수정하기 전까지는 디스크 블록을 공유하므로 용량 절약 효과는 같습니다.
- Linux ext4처럼 clone이 안 되는 곳에서는 하드링크가 쓰입니다(링크 수 2 이상).
- Windows는 폴더 링크에 심볼릭 링크 대신 **junction**을 씁니다.

## 폐쇄망 관련 팁

store를 USB 등 다른 볼륨에 둔 채로 설치하면 하드링크/clone이 안 돼서 전부 복사됩니다. 동작은 정상이지만 느리고 용량을 더 씁니다. 가져간 store를 프로젝트와 같은 디스크로 옮긴 뒤 `store-dir`을 지정해 설치하는 편이 좋습니다.
