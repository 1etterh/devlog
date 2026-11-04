---
title: macOS 로컬 네트워크 설정에 같은 앱(VS Code)이 두 개 보이는 이유
type: archive
tags: [archive, macos, local_network_privacy, vscode, tcc]
draft: true
---

설치된 VS Code는 `/Applications/Visual Studio Code.app` **하나뿐**이다. 그러니 앱이 두 개 깔려서 생긴 일은 아니고, 거의 다음 둘 중 하나다.

## 1. 업데이트 후 남은 예전 항목 (가장 흔함)
macOS 15(Sequoia)부터 로컬 네트워크 권한은 번들 ID가 아니라 **실행 파일의 바이너리 UUID(Mach-O UUID)** 기준으로 기록된다. VS Code는 자동 업데이트가 잦고, 업데이트할 때마다 바이너리가 바뀌므로 macOS가 새 앱으로 인식해 항목을 하나 더 만든다. 옛 항목은 지워지지 않고 남는다. Chrome, Electron 앱에서도 자주 보이는 알려진 동작이다.

## 2. 메인 앱 + Helper 프로세스
VS Code(Electron)는 `Code Helper`, `Code Helper (Plugin)` 같은 하위 프로세스가 따로 네트워크에 접근한다. 통합 터미널에서 띄운 dev 서버(`nuxt dev`, node 등)도 "책임 프로세스"가 VS Code로 잡혀서 별도 권한 요청이 생길 수 있다. 이름이 둘 다 "Visual Studio Code"로 표시돼 구분이 안 된다.

## 어떻게 하면 되나
- **둘 다 켜 두기**: 가장 간단하다. 해롭지 않다.
- 정리하고 싶다면 터미널에서 `tccutil reset LocalNetwork` 실행 후 재부팅한다. 단, **모든 앱**의 로컬 네트워크 권한이 초기화되니 다시 허용해야 한다.
- 하나를 껐는데 dev 서버가 LAN IP(예: 다른 기기에서 `192.168.x.x:3000` 접속)나 사내망 API에 접근이 안 된다면, 끈 쪽이 현재 쓰는 항목이다. 다시 켜면 된다.
