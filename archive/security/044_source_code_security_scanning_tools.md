---
title: 소스코드 보안 취약성 검사 도구 종류
type: archive
tags: [archive, sast, sca, security_scanning, devsecops]
draft: true
---

**Q**: 소스코드 보안 취약성 검사에 보통 어떤 도구를 쓰나?

**A**:
- SAST(직접 짠 코드 분석): Semgrep, CodeQL, SonarQube, Checkmarx·Fortify(상용), 언어별 Bandit(Python)·SpotBugs+FindSecBugs(Java)·gosec(Go)
- SCA(오픈소스 의존성 CVE): OWASP Dependency-Check, Trivy, Snyk, Dependabot·Renovate
- Secret 탐지: gitleaks, TruffleHog
- IaC·컨테이너: Trivy, Checkov, hadolint / DAST(실행 중 앱 공격): OWASP ZAP, Burp Suite

무료 조합은 Semgrep(또는 CodeQL) + Trivy + gitleaks를 CI에 붙이는 것이 일반적이다. SAST 단독으로는 라이브러리 CVE를 못 잡으므로 SCA를 반드시 함께 쓴다.
