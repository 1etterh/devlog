---
title: NMS 폐쇄망 구축 가능 여부
type: archive
tags: [archive, network, network_management, air_gapped, offline_install]
draft: true
---

**Q**: NMS를 폐쇄망(인터넷 차단 환경)에 구축할 수 있나?

**A**:
- 가능하다. SNMP·ICMP·Syslog·NetFlow·SSH 등 핵심 수집 프로토콜은 모두 내부망에서만 동작한다
- 클라우드 SaaS형 NMS는 불가하고, 온프레미스형(Zabbix, LibreNMS, Icinga, Prometheus+snmp_exporter+Grafana, 오프라인 라이선스를 지원하는 상용 제품)을 써야 한다
- 관건은 외부 의존성 제거: 오프라인 설치(로컬 패키지 미러·사설 registry), 오프라인 라이선스, 패치·MIB 정기 반입
- 알림은 내부 SMTP·SMS 게이트웨이로, 시간은 내부 NTP로, 웹 UI의 CDN·지도 타일은 내부 호스팅으로 대체한다
- 공공기관이면 CC·GS 인증 요건과 망연계 반입 절차를 확인한다

기능 자체는 문제가 없고, 운영 난이도는 반입·업데이트 절차에서 결정된다.
