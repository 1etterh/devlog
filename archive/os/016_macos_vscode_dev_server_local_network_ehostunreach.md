---
title: macOS에서 VS Code 터미널로 띄운 개발 서버가 LAN 서버에 연결 못 할 때 (EHOSTUNREACH)
type: archive
tags: [archive, macos, local_network_privacy, vscode, ehostunreach, dev_server]
draft: true
---

## 증상

VS Code 통합 터미널에서 띄운 개발 서버(Node 기반)가 같은 LAN에 있는 API 서버로 요청하면 실패한다.

```
Error: connect EHOSTUNREACH 192.168.x.x:PORT - Local (192.168.x.y:xxxxx)
  errno: -65, code: 'EHOSTUNREACH', syscall: 'connect'
```

- VS Code 터미널: 공유기(게이트웨이)만 ping이 되고, 다른 LAN 기기는 모두 `ping: sendto: No route to host`
- **Terminal.app에서는 같은 ping이 정상**
- 대상의 MAC 주소는 `arp -n`에 잡혀 있다 → 대상 장비는 살아 있음

## 원인

macOS 15(Sequoia)부터 생긴 **로컬 네트워크 개인정보 보호** 권한 때문이다. VS Code 터미널에서 실행한 프로세스(node, ping 등)는 권한 판단 시 VS Code 소속으로 처리된다. VS Code에 로컬 네트워크 권한이 없으면 LAN 연결이 OS 단에서 막히고, 에러는 `EHOSTUNREACH`(-65)로 나타난다.

- 인터넷과 게이트웨이는 영향이 없어서 네트워크 문제로 착각하기 쉽다
- 요청 body의 값(예: 클라이언트 ip 필드)과는 무관하다. TCP `connect` 단계에서 실패하므로 body를 보내기 전에 끝난다

## 설정에 VS Code가 두 개 보이는 이유

`시스템 설정 > 개인정보 보호 및 보안 > 로컬 네트워크`에 VS Code가 두 개 보일 수 있다.

- 권한이 **실행 파일의 바이너리 UUID** 기준으로 기록되기 때문에, 업데이트할 때마다 새 항목이 생기고 옛 항목은 남는다
- Electron Helper 프로세스가 따로 등록되기도 한다

이 때문에 **토글을 켜도 현재 실행 중인 바이너리에 적용되지 않는** 경우가 있다.

## 진단 순서

| 단계 | 방법 | 판단 |
|---|---|---|
| 1 | VS Code 터미널에서 `ping <게이트웨이>`, `ping <대상>` | 게이트웨이만 성공하면 권한 문제를 의심 |
| 2 | Terminal.app에서 `ping <대상>` | 여기서 성공하면 VS Code 권한 문제 확정 |
| 3 | 셸의 부모 프로세스 시작 시각 확인 (`ps -o lstart= -p <pid>`) | "재시작했는데 안 된다"면 실제로 재시작됐는지 확인 |

## 해결

1. 설정에서 VS Code 항목을 모두 켠다
2. VS Code를 **Cmd+Q로 완전히 종료**한 뒤 다시 실행한다. 창 닫기나 Reload Window로는 반영되지 않는다
3. 그래도 안 되면 `tccutil reset LocalNetwork`를 실행하고 **재부팅**한다. 다음 실행 때 뜨는 허용 팝업에서 허용한다
   - 이 명령은 모든 앱의 로컬 네트워크 권한을 초기화한다
4. 임시 우회: 권한이 있는 Terminal.app에서 개발 서버를 실행한다
