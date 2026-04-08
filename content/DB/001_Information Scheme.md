---
title: Information Schema로 DB 명세서 자동 생성하기
tags: [DB, MySQL, Information_Schema, SQL]
draft: false
---
## DB 명세서 작성

```sql
WITH tb AS (  
    SELECT *  
    FROM information_schema.TABLES  
    WHERE TABLE_SCHEMA = DATABASE()  
),  
tc AS (  
    SELECT *  
    FROM information_schema.COLUMNS  
    WHERE TABLE_SCHEMA = DATABASE()  
),  
ts AS (  
    SELECT *  
    FROM information_schema.STATISTICS  
    WHERE TABLE_SCHEMA = DATABASE()  
)  
SELECT  
    tb.TABLE_NAME,  
    -- 정렬을 위한 테이블별 컬럼 총 개수  
    tc.COLUMN_NAME,  
    tc.ORDINAL_POSITION,  
  
  
    -- [1] PK 여부: 'PRIMARY' 인덱스가 있으면 'O'    CASE  
        WHEN SUM(CASE WHEN ts.INDEX_NAME = 'PRIMARY' THEN 1 ELSE 0 END) > 0 THEN 'O'  
        ELSE ''  
    END AS PK,  
  
    -- [2] Auto Increment 여부: 있으면 'O'    CASE  
        WHEN tc.EXTRA LIKE '%auto_increment%' THEN 'O'  
        ELSE ''  
    END AS AUTO_INCREMENT,  
  
    -- [3] Index 존재 여부: 개수가 1 이상이면 'O', 없으면 'X'    CASE  
        WHEN COUNT(ts.INDEX_NAME) > 0 THEN 'O'  
        ELSE ''  
    END AS `INDEX`,  
  
    tc.COLUMN_TYPE,  
    tc.IS_NULLABLE,  
    tc.EXTRA,  
  
    -- 실제 인덱스 정보 (참고용)  
    COUNT(ts.INDEX_NAME) AS Index_Count,  
    GROUP_CONCAT(DISTINCT ts.INDEX_NAME) AS Index_Names,  
    COUNT(tc.COLUMN_NAME) OVER (PARTITION BY tb.TABLE_NAME) AS Table_Column_Count,  
    tb.TABLE_ROWS  
FROM  
    tb  
LEFT JOIN  
    tc ON tc.TABLE_NAME = tb.TABLE_NAME  
LEFT JOIN  
    ts ON tc.TABLE_NAME = ts.TABLE_NAME  
      AND tc.COLUMN_NAME = ts.COLUMN_NAME  
GROUP BY  
    tb.TABLE_NAME,  
    tb.TABLE_ROWS,  
    tc.COLUMN_NAME,  
    tc.ORDINAL_POSITION,  
    tc.COLUMN_TYPE,  
    tc.IS_NULLABLE,  
    tc.EXTRA  
ORDER BY  
    Table_Column_Count DESC, -- 컬럼 많은 순  
    tb.TABLE_NAME,  
    tc.ORDINAL_POSITION;
```

알고보니 db에 테이블, 컬럼도 다 하나의 table에 row 형태로 저장된다는 사실을 알게됨
기존 방식: sql generator로 테이블 생성문을 가져옴