---
title: RAG(검색 증강 생성) 개념과 등장 배경
type: archive
tags: [archive, llm, rag, vector_search, embedding]
draft: true
---

**Q**: LLM의 RAG는 무엇이고, 왜 등장했는가?

**A**:
- **개념**: 질문과 관련된 외부 문서를 먼저 검색해 프롬프트에 넣고, LLM이 그 근거로 답하게 하는 구조 (인덱싱: 청킹→임베딩→벡터 DB / 질의: 검색→프롬프트 증강→생성)
- **등장 이유**: 지식이 파라미터에 갇혀 있어 갱신 불가·출처 불명·환각 문제 발생 → 지식을 외부로 분리
- **계보**: DrQA(2017, retriever-reader) → DPR·REALM(2020) → Meta Lewis et al.(2020) 논문에서 "RAG" 용어 정립
- **대중화**: ChatGPT(2022) 이후 사내 데이터·최신 정보·환각 문제를 재학습 없이 푸는 실무 표준이 됨
- **발전**: Advanced RAG(하이브리드 검색·리랭킹) → GraphRAG, Agentic RAG, 롱컨텍스트와 병행

파인튜닝은 말투·형식 교정, RAG는 지식 주입에 적합하다.
