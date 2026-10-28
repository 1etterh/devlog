---
title: 벡터 DB란 무엇인가
type: archive
tags: [archive, vector_db, embedding, ann, rag]
draft: true
---

**Q**: 벡터 DB는 무엇인가?

**A**:
- 임베딩 벡터를 저장하고 질의와 **의미가 가까운** 데이터를 Top-k로 찾는 유사도 검색 특화 DB
- 일반 DB는 정확 일치(B-Tree), 벡터 DB는 거리 기반 탐색 (코사인 유사도·내적·L2)
- 전수 비교는 느려서 ANN 인덱스 사용: HNSW(그래프, 사실상 표준), IVF(군집), PQ(압축)
- 제품군: 전용(Pinecone, Milvus, Qdrant, Weaviate), 경량(Chroma, FAISS), 기존 DB 확장(pgvector, Elasticsearch, Redis)
- 용도: RAG 검색 단계, 추천, 이미지 검색, 유사 문서 탐지

이미 PostgreSQL을 쓰고 있다면 pgvector로 시작하는 것이 흔한 선택이다.
