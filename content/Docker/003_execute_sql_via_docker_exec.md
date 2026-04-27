---
title: docker exec로 한 줄 SQL 실행하기 - 리다이렉트 연산자 오해 바로잡기
type: question
tags: [question, docker, mariadb, mysql, shell_redirection, heredoc]
draft: false
---

## 질문

컨테이너 안의 DB에 접속해 `SHOW DATABASES;` 같은 **한 줄 SQL**을 바로 실행하고 싶다.
이전에 덤프 복원할 때 `< dump.sql` 방식을 썼으니 아래처럼 쓰면 될 것 같았다.

```bash
docker exec -i my-db mariadb -uroot -ppass < "SHOW DATABASES"
```

그런데 실행하면 `No such file or directory` 에러가 난다. 왜 그럴까?

## 왜 안 되는가 - `<`는 "파일 전용"

`<`는 쉘(bash/zsh 등)의 **입력 리다이렉트 연산자**다. 의미는 딱 하나:

> **뒤에 오는 경로의 파일을 열어서 stdin에 연결하라.**

따라서 `< "SHOW DATABASES"`는
- 문자열 SQL을 stdin으로 넣는 것이 아니라
- 현재 디렉토리에 있는 `SHOW DATABASES`라는 **이름의 파일**을 찾는다

그런 파일이 없으므로:

```
-bash: SHOW DATABASES: No such file or directory
```

큰따옴표는 공백을 포함한 파일명을 감싸는 용도일 뿐, SQL처럼 실행되는 것이 아니다.

## 리다이렉트 연산자 정리

| 연산자 | 의미 | 사용 예 |
|--------|------|---------|
| `<` | **파일**을 stdin으로 | `cmd < dump.sql` |
| `<<<` | **문자열**을 stdin으로 (here-string) | `cmd <<< "SELECT 1;"` |
| `<<EOF ... EOF` | **여러 줄**을 stdin으로 (here-doc) | 여러 줄 SQL 블록 |
| `\|` | **앞 명령의 출력**을 stdin으로 | `echo "..." \| cmd` |

SQL 문자열을 stdin으로 넣고 싶다면 `<`가 아닌 `<<<`, `<<EOF`, `|` 중 하나여야 한다.

## 올바른 실행 방법 4가지

### 방법 1: `-e` 옵션 (원라이너 권장)

```bash
docker exec -i my-db mariadb -uroot -ppass -e "SHOW DATABASES;"
```

- `mariadb`/`mysql` 클라이언트의 `-e, --execute` 옵션이 SQL을 바로 실행하고 종료
- stdin을 쓰지 않으므로 리다이렉트 없이 깔끔
- 결과만 빠르게 보고 싶을 때 가장 적합

### 방법 2: Here-string (`<<<`)

```bash
docker exec -i my-db mariadb -uroot -ppass <<< "SHOW DATABASES;"
```

- 문자열을 그대로 stdin에 넣는 셸 문법
- `<` 쓰려던 습관에서 **작대기 하나만 더 붙이면** 동작한다는 점이 기억하기 쉬움

### 방법 3: `echo` 파이프

```bash
echo "SHOW DATABASES;" | docker exec -i my-db mariadb -uroot -ppass
```

- 덤프 복원(`< dump.sql`)과 **비슷한 파이프라인 감각**을 유지
- 여러 줄도 가능:
  ```bash
  printf 'USE app;\nSHOW TABLES;\n' | docker exec -i my-db mariadb -uroot -ppass
  ```

### 방법 4: Here-doc (여러 줄 SQL)

```bash
docker exec -i my-db mariadb -uroot -ppass <<'SQL'
SHOW DATABASES;
USE app;
SHOW TABLES;
SQL
```

- 여러 쿼리를 한 번에 실행할 때 가독성이 가장 좋다
- 시작 마커를 `'SQL'`처럼 **따옴표로 감싸면** 내부 `$변수`가 확장되지 않아 안전
- 본문에 백틱·세미콜론이 섞여도 원문 그대로 전달된다

## 탐색이 목적이라면 - `-it`로 대화형 접속

```bash
docker exec -it my-db mariadb -uroot -ppass
```

- 프롬프트 진입 → `SHOW DATABASES;` 입력 → Enter
- 여러 쿼리를 탐색하며 볼 때 편리
- 주의: 이땐 `-i` 단독이 아니라 반드시 `-it`

## 선택 흐름

```mermaid
flowchart TD
  A[SQL 실행이 필요] --> B{한 줄 vs 여러 줄?}
  B -- 한 줄 --> C{스크립트 스타일?}
  C -- 원라이너 --> D["-e \"SQL;\" (권장)"]
  C -- stdin 파이프라인 유지 --> E["<<< \"SQL;\" 또는 echo | cmd"]
  B -- 여러 줄 --> F{파일로 저장?}
  F -- 예 --> G["< dump.sql"]
  F -- 아니오 --> H["<<EOF ... EOF (here-doc)"]
  A --> I{탐색/대화형?}
  I -- 예 --> J[-it 로 접속 후 프롬프트 입력]
```

## 자주 하는 실수

1. **`<` 뒤에 SQL 문자열을 바로 쓰기**
   - `< "SELECT 1;"` → `SELECT 1;` 이름 파일을 찾는 동작 → 에러
   - 해결: `<<<`, `-e`, `|` 중 하나로 전환

2. **`-it`로 파일 리다이렉트**
   - `docker exec -it my-db mariadb ... < dump.sql` → TTY 아님 에러
   - 해결: 파일 주입은 **`-i`만**

3. **세미콜론 누락**
   - `<<< "SHOW DATABASES"` 는 동작하지만 일부 상황에서 의도대로 안 끝날 수 있음
   - 해결: 항상 **세미콜론까지** 포함: `<<< "SHOW DATABASES;"`

## 핵심 요약

- `<`는 **파일 전용**. SQL 문자열에는 쓰지 않는다
- 문자열 SQL을 실행하려면: **`-e`**(가장 깔끔) / **`<<<`** / **`|`** / **`<<EOF`**
- 덤프 파일을 주입할 때는 기존처럼 **`< dump.sql`** 그대로 OK
- 탐색적 접근은 **`-it`** 로 프롬프트에 들어가는 편이 실용적

리다이렉트 연산자를 **"입력원이 파일이냐 문자열이냐 명령 출력이냐"** 로 나눠서 기억하면 이런 실수가 잘 안 난다.
