---
title: HTTP 요청으로 파일을 전송하는 5가지 방법
type: question
tags: [HTTP, 파일전송, multipart, octet-stream, Base64, presigned-url, chunked]
draft: true
---

## 질문

HTTP 요청으로 파일을 전송할 때 multipart 방식만 가능한가?

## 답변

아니다. multipart/form-data 외에도 여러 방식이 있다.

## 1. multipart/form-data

가장 일반적인 방식. HTML form의 `enctype="multipart/form-data"`에서 유래.

```http
POST /upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----boundary

------boundary
Content-Disposition: form-data; name="file"; filename="photo.jpg"
Content-Type: image/jpeg

<바이너리 데이터>
------boundary--
```

- 여러 파일 + 메타데이터를 동시 전송 가능
- boundary 문자열로 각 파트를 구분
- 서버 측에서 파싱이 필요

## 2. application/octet-stream (Raw Binary)

요청 Body에 파일의 바이너리 데이터를 그대로 담는 방식.

```http
PUT /files/photo.jpg HTTP/1.1
Content-Type: application/octet-stream
Content-Length: 102400

<바이너리 데이터>
```

- 파일 하나만 전송할 때 가장 단순하고 효율적
- 별도 인코딩 오버헤드 없음
- 메타데이터는 HTTP 헤더나 URL 쿼리 파라미터로 전달

## 3. Base64 인코딩 (JSON Body)

파일을 Base64로 인코딩하여 JSON 필드에 포함.

```json
POST /upload HTTP/1.1
Content-Type: application/json

{
  "filename": "photo.jpg",
  "contentType": "image/jpeg",
  "content": "iVBORw0KGgoAAAANSUhEUg..."
}
```

- JSON 기반 API와 통합이 쉬움
- **약 33% 용량 증가** (Base64 인코딩 오버헤드)
- 작은 파일(아이콘, 썸네일 등)에 적합
- 대용량 파일에는 비효율적

## 4. Chunked Transfer Encoding

대용량 파일을 청크 단위로 나눠 스트리밍 전송.

```http
POST /upload HTTP/1.1
Transfer-Encoding: chunked

1a
<첫 번째 청크>
1a
<두 번째 청크>
0

```

- Content-Length를 미리 알 필요 없음
- 대용량 파일 스트리밍에 적합
- 서버 메모리를 효율적으로 사용
- HTTP/1.1 표준 기능

## 5. Presigned URL (간접 전송)

서버가 직접 파일을 받지 않고 클라우드 스토리지(S3 등)에 직접 업로드할 수 있는 서명된 URL을 발급.

```
1. 클라이언트 → 서버: "업로드 URL 발급 요청"
2. 서버 → 클라이언트: presigned PUT URL 반환
3. 클라이언트 → S3: PUT 요청으로 파일 직접 업로드
```

- 서버를 거치지 않아 서버 부하 감소
- 대용량 파일에 가장 적합
- URL에 만료 시간, 권한 등을 포함

## 비교 정리

| 방식 | 적합한 용도 | 장점 | 단점 |
|------|------------|------|------|
| multipart/form-data | 폼 + 파일 동시 전송 | 여러 파일 + 메타데이터 | 파싱 복잡 |
| octet-stream | 단일 파일 전송 | 단순, 오버헤드 없음 | 메타데이터 전달 제한 |
| Base64 JSON | 소형 파일 | JSON API 통합 용이 | 33% 용량 증가 |
| Chunked | 대용량 스트리밍 | 메모리 효율적 | 구현 복잡 |
| Presigned URL | 대용량 클라우드 | 서버 부하 없음 | 추가 요청 필요 |

## 실무 가이드

- **일반 파일 업로드**: multipart/form-data
- **대용량 파일**: Presigned URL 또는 Chunked
- **API 내 소규모 데이터**: Base64 JSON
- **단일 파일 단순 전송**: octet-stream
