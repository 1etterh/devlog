---
title: 외부 API 호출 성공 후 로컬 에러 시 롤백 - 보상 트랜잭션 패턴
type: question
tags: [Spring, 분산트랜잭션, 보상트랜잭션, CompensatingTransaction, 파일업로드]
draft: true
---

## 문제 상황

외부 파일 서버(AFS)에 파일 업로드가 성공하고 AFS DB에도 반영된 상태에서, 로컬 코드에서 응답 파싱이나 DB 저장 중 에러가 발생하면 AFS에는 파일이 남아있는데 로컬 DB에는 기록이 없는 **고아 파일**이 발생한다.

## 왜 @Transactional로 해결할 수 없는가

`@Transactional`은 로컬 DB에 대해서만 롤백이 가능하다. AFS는 HTTP API로 통신하는 외부 서버이므로 로컬 트랜잭션의 범위 밖이다. 이미 AFS에 저장된 파일을 로컬 트랜잭션 롤백으로 되돌릴 방법은 없다.

## 해결 방법: 보상 트랜잭션 (Compensating Transaction)

외부 시스템에 대한 작업을 되돌리려면, 반대 작업을 명시적으로 호출해야 한다. 이 패턴을 **보상 트랜잭션**이라 한다.

```java
ResponseEntity<String> response = exchange(request, String.class);

String accessKey = null;
try {
    // 응답 파싱
    ResponseBody b = readValue(response.getBody(), ResponseBody.class);
    String path = (String) b.getData().getFile().get("path");
    
    // accessKey 추출 (보상 삭제용)
    Pair<String, String> extracted = AMSPUtils.extractAccessKey(path);
    if (extracted != null) accessKey = extracted.getRight();

    // DB 저장
    attachRepository.save(attach);
    return df;

} catch (Exception e) {
    // 보상 트랜잭션: AFS 파일 삭제
    if (accessKey != null) {
        try {
            deleteFile(accessKey);
        } catch (Exception de) {
            log.error("AFS 보상 삭제 실패: {}", accessKey, de);
        }
    }
    throw e;
}
```

## 보상 트랜잭션의 한계

보상 삭제 자체도 실패할 수 있다. 이 경우를 대비해:

1. **에러 로그 필수**: 보상 실패 시 accessKey를 로그에 남겨 수동 정리 가능하게 함
2. **배치 정리**: 주기적으로 AFS에 있지만 로컬 DB에 없는 고아 파일을 정리하는 배치 작업 고려
3. **Outbox 패턴**: 더 견고하게 하려면 보상 작업을 DB에 기록하고 별도 워커가 처리
