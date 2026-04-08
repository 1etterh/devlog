---
title: Armeria 멀티파트 - UserFileDto와 파일 매칭 구조
type: question
tags: [Armeria, Multipart, DTO, 파일매핑, MultipartHelper]
draft: false
---

## 구현 내용

멀티파트 요청으로 파일 리스트 + 메타데이터(JSON)를 함께 받아 각 DTO에 파일을 매칭하는 구조.

## 핵심 구조

- `UserFileDto`: `userId`, `fileKey`(멀티파트 필드명), `FilePartData file`(@JsonIgnore)
- 클라이언트가 `userFiles` 텍스트 파트에 JSON, `file_0`/`file_1` 등으로 파일 전송
- 서버에서 `fileKey`로 DTO와 파일을 매칭: `dto.setFile(matched.get(0))`

## 알게 된 점

- `dto.setFile()`은 메모리 주소가 아닌 **디스크 temp 파일을 참조하는 FilePartData 객체**를 세팅
- Armeria는 수신한 파일을 `/tmp/armeria-xxxx.tmp`에 저장 후 `FileHttpData`로 감싸서 전달
- 요청 처리 완료 후 temp 파일은 자동 정리됨
