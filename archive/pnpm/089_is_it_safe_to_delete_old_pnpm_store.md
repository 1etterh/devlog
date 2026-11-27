---
title: pnpm 재설치 후 옛 store(~/pnpm)를 지워도 되는가
type: archive
tags: [archive, pnpm, pnpm_store, hard_link, package_manager]
draft: true
---

> 의문: pnpm을 재설치했더니 store 경로가 원래 `~/pnpm/store`에서 바뀐 것 같다. pnpm 10(예전에 쓰던 버전)을 사용하는 프로젝트가 있으면 `~/pnpm`은 지우면 안 되는가?

아니요, 지워도 됩니다. pnpm store는 캐시일 뿐이라 지워서 프로젝트가 깨지지는 않고, 다음 install 때 패키지를 다시 받는 비용만 생깁니다.

**지금 상태 (직접 확인)**

| 항목 | 값 |
|---|---|
| 현재 pnpm | 12.16.1 (Homebrew), fnm 쪽은 12.15.0 |
| 현재 store | `~/Library/pnpm/store/v11` |
| 옛 store | `~/pnpm/store/v10` (4.3G) |
| 남은 설정 | `~/Library/Preferences/pnpm/rc`에 `store-dir=~/pnpm/store` 한 줄 |

pnpm 12는 `store path`가 v11을 가리키니 이 rc 설정을 읽지 않는 것으로 보입니다. 그래서 경로가 바뀐 것처럼 보이는 겁니다. 버전마다 store 형식도 다릅니다(v3, v10, v11). 그래서 pnpm 12는 어차피 `~/pnpm/store/v10`을 다시 쓰지 못합니다.

**지워도 되는 이유**

- **기존 node_modules는 그대로 동작합니다.** pnpm은 store에서 node_modules로 하드링크를 겁니다. `~/pnpm`과 프로젝트가 같은 볼륨에 있는 것도 확인했습니다. 하드링크라서 store 쪽 파일을 지워도 node_modules 쪽 파일은 남습니다.
- **pnpm 10 프로젝트에서 다시 install해도 깨지지 않습니다.** `packageManager` 필드나 corepack으로 pnpm 10이 실행되면, pnpm 10은 rc를 읽어 `~/pnpm/store`를 찾습니다. 비어 있으면 패키지를 다시 받아 채울 뿐입니다.
- **실제로 돌아오는 용량은 4.3G보다 적을 수 있습니다.** 아직 어떤 프로젝트 node_modules와 하드링크로 공유 중인 파일은 store에서 지워도 디스크 공간이 비워지지 않습니다.

**정리 방법**

1. pnpm 10 프로젝트에서 재다운로드를 피하고 싶으면 그 프로젝트들을 다 정리할 때까지 그냥 두세요.
2. 지운다면 rc의 `store-dir=...` 줄도 함께 지우는 게 깔끔합니다. 그러면 pnpm 10도 기본 위치를 씁니다. 기본 위치인 `~/Library/pnpm/store/v10`이 이미 있으니 그쪽 캐시를 재사용할 수 있습니다.
3. 덤으로 `~/Library/pnpm/store/v3`은 pnpm 9 이하가 쓰던 형식입니다. pnpm 9 이하 프로젝트가 없다면 이것도 같은 이유로 지워도 됩니다.
