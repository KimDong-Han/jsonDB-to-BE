# event_tag 테이블 DDL + 시드 SQL

- 원본: `public/eventList.json` (103개)
- `name` 단일 컬럼이 곧 식별자 (현재 `fancam.tag`/`armyfestival.tag`/`newbwg.tag`에 저장된 문자열과 동일)
- `sortOrder`는 JSON 배열 순서 그대로 (위로 갈수록 신규 이벤트 → 0,1,2... 정렬 시 ASC면 신규순)
- `viewStatus`는 soft delete용 (앞으로 통일 정책)
- id는 `gen_random_uuid()` (NeonDB 기본 내장)

## 1) DDL
```sql
CREATE TABLE event_tag (
  id           UUID         PRIMARY KEY,
  name         TEXT         NOT NULL UNIQUE,
  "sortOrder"  INTEGER      NOT NULL DEFAULT 0,
  "viewStatus" BOOLEAN      NOT NULL DEFAULT TRUE,
  "createdAt"  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  "updatedAt"  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 어드민 목록(viewStatus=true 필터 + sortOrder 정렬) 대응
CREATE INDEX idx_event_tag_view_sort ON event_tag ("viewStatus", "sortOrder");
```

## 2) 시드
```sql
INSERT INTO event_tag (id, name, "sortOrder") VALUES
  (gen_random_uuid(), '1st FanCon 1,2 QWER(토)', 0),
  (gen_random_uuid(), '1st FanCon 1,2 QWER(일)', 1),
  (gen_random_uuid(), '1st FanCon 1,2 QWER in Taiwan', 2),
  (gen_random_uuid(), 'KCON JAPAN 2025 ARTIST STAGE', 3),
  (gen_random_uuid(), 'ACON2025', 4),
  (gen_random_uuid(), 'army-con_school_festival2026', 5),
  (gen_random_uuid(), '1st World Tour Rockation - Brooklyn', 6),
  (gen_random_uuid(), '1st World Tour Rockation - Atlanta', 7),
  (gen_random_uuid(), '1st World Tour Rockation - BERWYN', 8),
  (gen_random_uuid(), '1st World Tour Rockation - MINNEAPOLIS', 9),
  (gen_random_uuid(), '1st World Tour Rockation - FORT WORTH', 10),
  (gen_random_uuid(), '1st World Tour Rockation - HUSTON', 11),
  (gen_random_uuid(), '1st World Tour Rockation - LOS ANGELES', 12),
  (gen_random_uuid(), '1st World Tour Rockation - SAN FRANCISCO', 13),
  (gen_random_uuid(), '2025ATA', 14),
  (gen_random_uuid(), 'PMPS 2025', 15),
  (gen_random_uuid(), 'MCOUNTDOWN', 16),
  (gen_random_uuid(), 'MCOUNTDOWN in 보령', 17),
  (gen_random_uuid(), '2025 PENTAPORT ROCK FESTIVAL', 18),
  (gen_random_uuid(), '2025 울산 SUMMER FESTIVAL', 19),
  (gen_random_uuid(), '2025 캐리비안베이 워터 뮤직 풀 파티', 20),
  (gen_random_uuid(), '2025 서울가요대상', 21),
  (gen_random_uuid(), '푸본 가디언스 G-POP', 22),
  (gen_random_uuid(), '난 네편이야, 온 세상이 불협일지라도 언론 쇼케이스', 23),
  (gen_random_uuid(), '어디로든 버킹 제천 의림지', 24),
  (gen_random_uuid(), '어디로든 버킹 해남 산이정원', 25),
  (gen_random_uuid(), '어디로든 버킹 서울 노들섬', 26),
  (gen_random_uuid(), '어디로든 버킹 일본 오사카', 27),
  (gen_random_uuid(), '2025원광대학교 축제', 28),
  (gen_random_uuid(), '2025한양대학교 공학인의 밤', 29),
  (gen_random_uuid(), '2025대구대학교 축제', 30),
  (gen_random_uuid(), '2025동서대학교 축제', 31),
  (gen_random_uuid(), '2025서울립대학교 축제', 32),
  (gen_random_uuid(), '2025선문대학교 축제', 33),
  (gen_random_uuid(), '2025청주대학교 축제', 34),
  (gen_random_uuid(), '2025동의대학교 축제', 35),
  (gen_random_uuid(), '2025인제대학교 축제', 36),
  (gen_random_uuid(), '2025순천대학교 축제', 37),
  (gen_random_uuid(), '2025조선대학교 대동제', 38),
  (gen_random_uuid(), '2025고려대학교 입실렌티', 39),
  (gen_random_uuid(), '모배7주년 미니콘서트 PARTY WITH DEW', 40),
  (gen_random_uuid(), 'Alan Walker With K-POP IN TAIPEI', 41),
  (gen_random_uuid(), 'Algorithm''s Blossom 언론_쇼케이스', 42),
  (gen_random_uuid(), 'ON THE K : B', 43),
  (gen_random_uuid(), 'AAA2024', 44),
  (gen_random_uuid(), 'PENTAPORT ROCK FESTIVAL', 45),
  (gen_random_uuid(), '와락콘서트', 46),
  (gen_random_uuid(), '2024MMA', 47),
  (gen_random_uuid(), '후아유_타임스퀘어_콘서트', 48),
  (gen_random_uuid(), '2024원더리벳', 49),
  (gen_random_uuid(), '아케인_시즌2_팬페스트', 50),
  (gen_random_uuid(), 'KGMA', 51),
  (gen_random_uuid(), '동아대', 52),
  (gen_random_uuid(), '넥슨_챔피언스컵_결승전', 53),
  (gen_random_uuid(), '아시아송_페스티벌', 54),
  (gen_random_uuid(), '광양_K-POP_페스티벌', 55),
  (gen_random_uuid(), '후아유_콘서트', 56),
  (gen_random_uuid(), '마산대', 57),
  (gen_random_uuid(), '공주대', 58),
  (gen_random_uuid(), '허준_축제_음악회', 59),
  (gen_random_uuid(), '청춘,커피_페스티벌', 60),
  (gen_random_uuid(), '인제군장병_한마음_뮤직_페스티벌', 61),
  (gen_random_uuid(), '현대카드_Curated_95', 62),
  (gen_random_uuid(), '한양대_공대축제', 63),
  (gen_random_uuid(), '강릉원주대', 64),
  (gen_random_uuid(), '중부대_고양캠퍼스', 65),
  (gen_random_uuid(), '서울과기대', 66),
  (gen_random_uuid(), '전주대', 67),
  (gen_random_uuid(), '상명대_천안캠', 68),
  (gen_random_uuid(), '논산_꿈빛나래_페스티벌', 69),
  (gen_random_uuid(), '제천_국제음악영화제', 70),
  (gen_random_uuid(), '경주_롤팬페스타', 71),
  (gen_random_uuid(), '55사단_위문열차', 72),
  (gen_random_uuid(), 'KT_보야지_투_자라섬', 73),
  (gen_random_uuid(), '울산_청년_페스타', 74),
  (gen_random_uuid(), '강진_하맥축제', 75),
  (gen_random_uuid(), '2024 Cass_Cool', 76),
  (gen_random_uuid(), '발로란트 야시장', 77),
  (gen_random_uuid(), 'KT위즈 Y 워터 페스티벌', 78),
  (gen_random_uuid(), 'Seoul POPCON', 79),
  (gen_random_uuid(), '2024JUMF', 80),
  (gen_random_uuid(), 'Mega Wave Festival', 81),
  (gen_random_uuid(), 'CREATOR FESTA', 82),
  (gen_random_uuid(), '섬의날', 83),
  (gen_random_uuid(), '안동 수페스타', 84),
  (gen_random_uuid(), '남서울대', 85),
  (gen_random_uuid(), '경기과기대', 86),
  (gen_random_uuid(), '대림대', 87),
  (gen_random_uuid(), '구미대', 88),
  (gen_random_uuid(), '천안유니브시티', 89),
  (gen_random_uuid(), '경북대', 90),
  (gen_random_uuid(), '건국대', 91),
  (gen_random_uuid(), '영남대', 92),
  (gen_random_uuid(), '고려대', 93),
  (gen_random_uuid(), '조선대', 94),
  (gen_random_uuid(), '한양대', 95),
  (gen_random_uuid(), '부산외대', 96),
  (gen_random_uuid(), '계명대', 97),
  (gen_random_uuid(), '경기모아페스티벌', 98),
  (gen_random_uuid(), '마니또_방학식', 99),
  (gen_random_uuid(), 'YTB팬페스트', 100),
  (gen_random_uuid(), 'AGF2023', 101),
  (gen_random_uuid(), '롤드컵 전야제', 102)
ON CONFLICT (name) DO NOTHING;
```

## 3) 검증
```sql
SELECT COUNT(*) FROM event_tag;
SELECT name, "sortOrder" FROM event_tag ORDER BY "sortOrder" ASC LIMIT 10;
-- fancam에서 실제 사용 중이지만 event_tag에 없는 태그 (참고용)
SELECT DISTINCT f.tag FROM fancam f LEFT JOIN event_tag e ON e.name = f.tag WHERE e.id IS NULL;
```