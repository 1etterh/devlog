---
title: PDF에서 텍스트만 추출하는 방법
type: archive
tags: [archive, pdf, text_extraction, ocr]
draft: true
---

**Q**: PDF에서 텍스트만 깔끔하게 뽑아내려면 어떤 방법이 있는가?

**A**:
- **텍스트 기반 PDF**: `pdftotext` (poppler-utils), PyMuPDF(fitz), pdfplumber, pdfminer.six 중 선택
- **스캔본/이미지 PDF**: Tesseract OCR 또는 `ocrmypdf`로 텍스트 레이어 부착
- **표 추출이 중요**: pdfplumber가 가장 강함 (느림)
- **속도 우선**: PyMuPDF가 가장 빠름
- **단순·일회성**: CLI `pdftotext -layout input.pdf output.txt`가 가장 간편

| 도구 | 속도 | 레이아웃 | 표 | 비고 |
|---|---|---|---|---|
| pdftotext | 빠름 | 보통 | 약함 | CLI 단순 |
| PyMuPDF | 매우 빠름 | 좋음 | 보통 | 범용 추천 |
| pdfplumber | 느림 | 좋음 | 강함 | 표 분석용 |
| pdfminer.six | 느림 | 정밀 | 보통 | 정밀 분석 |
| ocrmypdf | 매우 느림 | - | - | 스캔본 OCR |

먼저 PDF가 텍스트 레이어를 가졌는지 확인 (`pdftotext`로 빈 결과면 OCR 필요)하고 도구를 선택하면 시간을 아낄 수 있다.
