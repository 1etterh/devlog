---
title: JS가 먼저 해결했고 다른 언어가 뒤처졌던 사례 (float 출력, HashDoS)
type: archive
tags: [archive, floating_point, hash_collision, hash_dos, javascript, java]
draft: true
---

**Q**: 해시 충돌 같은 CS 문제를 JS(브라우저)가 먼저 잘 해결했고 다른 언어가 뒤처졌던 사례가 뭐였나?

**A**:
- **JS가 앞섰던 사례 = 부동소수점 → 문자열 변환**: ECMAScript 1(1997)부터 `Number.prototype.toString`이 "왕복 가능한 가장 짧은 표현"을 스펙으로 요구. Java `Double.toString`은 불필요하게 긴 출력을 내는 버그(JDK-4511638, 2001 보고)가 **JDK 19(2022)**에야 Schubfach 알고리즘으로 수정됨. Python도 3.1(2009)에 shortest repr 도입
- **해시 충돌 사례 = HashDoS**: 2003 Crosby & Wallach 논문 → Perl은 2003년에 해시 시드 랜덤화로 대응. 2011년 28C3 발표에서 PHP·Java·Python·ASP.NET·V8(Node.js) 등이 여전히 취약함이 드러남
- HashDoS에서 앞섰던 건 JS가 아니라 **Perl**(그리고 CRuby 1.9). V8/Node도 당시 취약했고 2012년 시드 랜덤화, 2017년엔 스냅샷 때문에 시드가 고정되는 이슈(CVE-2017-11499)도 있었음
- 후속 대응: Python 3.4 SipHash(PEP 456), Java 8 HashMap 충돌 버킷 트리화, PHP `max_input_vars`

두 사례가 기억 속에서 섞였을 가능성이 높다.

**추가 — 브라우저까지 포함하면**: SHA-1 충돌 대응이 가장 대표적. Chrome·Firefox는 2014년부터 SHA-1 인증서 폐기를 예고해 2017년 초 차단 완료, 같은 해 2월 SHAttered(실제 SHA-1 충돌) 공개 시 이미 대비됨. 반면 Git은 2017년(2.13)에야 충돌 탐지 SHA-1을 넣었고 SHA-256 전환은 2020년(2.29) 실험 기능으로 시작, SVN은 충돌 PDF 커밋으로 저장소가 깨지는 사고(WebKit SVN)를 겪음. 그 외 MD5 인증서 폐기(2008 위조 CA 시연 이후), Spectre 대응(사이트 격리·타이머 정밀도 축소), Certificate Transparency, TLS 1.3/QUIC도 브라우저가 먼저 주도.
