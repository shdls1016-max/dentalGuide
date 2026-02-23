-- ============================================
-- Dental App Supabase Schema
-- Supabase SQL Editor에서 이 SQL을 실행하세요
-- ============================================

-- 1. 커뮤니티 게시글 (posts)
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('question', 'review', 'info', 'free')),
  category_label TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '익명',
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 댓글 (comments)
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author TEXT NOT NULL DEFAULT '익명',
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 진료 기록 (records)
CREATE TABLE records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visit_date DATE NOT NULL,
  clinic_name TEXT NOT NULL,
  treatment_type TEXT NOT NULL,
  treated_teeth TEXT,
  memo TEXT,
  next_visit_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 치과 리뷰 (reviews)
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '익명',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  treatment TEXT,
  content TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- RLS (Row Level Security) 정책
-- 인증 없이 CRUD 가능하도록 설정
-- ============================================

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- posts: 누구나 읽기/쓰기 가능
CREATE POLICY "Anyone can read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update posts" ON posts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete posts" ON posts FOR DELETE USING (true);

-- comments: 누구나 읽기/쓰기 가능
CREATE POLICY "Anyone can read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update comments" ON comments FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete comments" ON comments FOR DELETE USING (true);

-- records: 누구나 읽기/쓰기 가능
CREATE POLICY "Anyone can read records" ON records FOR SELECT USING (true);
CREATE POLICY "Anyone can insert records" ON records FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update records" ON records FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete records" ON records FOR DELETE USING (true);

-- reviews: 누구나 읽기/쓰기 가능
CREATE POLICY "Anyone can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete reviews" ON reviews FOR DELETE USING (true);

-- ============================================
-- 인덱스
-- ============================================

CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_records_visit_date ON records(visit_date DESC);
CREATE INDEX idx_reviews_clinic_id ON reviews(clinic_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================
-- 샘플 데이터 (테스트용)
-- ============================================

-- 커뮤니티 게시글 샘플
INSERT INTO posts (category, category_label, title, content, author, likes, comments_count, created_at) VALUES
  ('review', '후기', '강남역 치과 임플란트 후기', '지난달에 강남역 근처 치과에서 임플란트 했습니다. 의사 선생님이 정말 친절하시고 설명도 잘 해주셨어요. 통증도 생각보다 적었고 회복도 빨랐습니다. 가격은 조금 높은 편이지만 만족합니다.', '치아사랑', 24, 8, now() - interval '2 hours'),
  ('question', '질문', '스케일링 후 이가 시려요, 정상인가요?', '어제 스케일링 받았는데 찬물 마실 때 이가 너무 시려요. 이게 정상인 건가요? 얼마나 지속되나요? 혹시 다른 문제가 있는 건 아닌지 걱정됩니다.', '이시림', 15, 12, now() - interval '5 hours'),
  ('info', '정보공유', '치실 vs 치간칫솔, 뭐가 더 좋을까?', '치과에서 치실 사용을 권장받았는데, 치간칫솔이 더 편하다는 분들도 있더라고요. 각각의 장단점을 정리해봤습니다. 치실은 좁은 치간에 적합하고, 치간칫솔은 넓은 치간에 효과적입니다.', '구강건강매니아', 32, 5, now() - interval '1 day'),
  ('free', '자유', '치과 공포증 있는 분들 어떻게 극복하셨어요?', '어릴 때부터 치과가 너무 무서워서 미루고 미루다가 결국 큰 치료를 받게 됐어요. 치과 공포증 있는 분들은 어떻게 극복하셨나요?', '치과무서워', 18, 15, now() - interval '2 days'),
  ('review', '후기', '교정 1년차 후기 공유합니다', '투명교정 시작한 지 1년 됐습니다. 처음엔 적응하기 힘들었지만 지금은 눈에 띄게 가지런해졌어요. 비용은 500만원 정도였고, 2주마다 교체합니다.', '교정중', 45, 20, now() - interval '3 days'),
  ('question', '질문', '사랑니 발치 후 관리 방법 알려주세요', '내일 사랑니 발치 예정인데 발치 후에 어떻게 관리해야 하나요? 식사는 언제부터 가능한지, 주의사항이 궁금합니다.', '사랑니고민', 8, 6, now() - interval '4 days'),
  ('info', '정보공유', '건강보험 적용되는 치과 치료 총정리', '많은 분들이 모르시는 건강보험 적용 치과 치료를 정리했습니다. 스케일링(연 1회), 레진(12세 이하), 치석제거 등이 해당됩니다.', '보험전문가', 67, 23, now() - interval '5 days');

-- 댓글 샘플
INSERT INTO comments (post_id, author, content, likes, created_at)
SELECT id, '댓글러1', '좋은 정보 감사합니다! 저도 비슷한 경험이 있어요.', 5, now() - interval '1 hour'
FROM posts WHERE title = '강남역 치과 임플란트 후기';

INSERT INTO comments (post_id, author, content, likes, created_at)
SELECT id, '치과의사Kim', '스케일링 후 시린 증상은 정상입니다. 보통 1-2주 내에 사라집니다. 시린이 전용 치약을 사용하시면 도움이 됩니다.', 12, now() - interval '3 hours'
FROM posts WHERE title = '스케일링 후 이가 시려요, 정상인가요?';

INSERT INTO comments (post_id, author, content, likes, created_at)
SELECT id, '양치매니아', '치실이 더 효과적이라고 치과에서 들었어요. 하지만 치간칫솔도 같이 사용하면 최고라고 합니다!', 3, now() - interval '12 hours'
FROM posts WHERE title = '치실 vs 치간칫솔, 뭐가 더 좋을까?';

-- 진료 기록 샘플
INSERT INTO records (visit_date, clinic_name, treatment_type, treated_teeth, memo, next_visit_date) VALUES
  ('2025-03-12', '서울밝은치과', '스케일링', '', '정기 스케일링. 잇몸 상태 양호하다고 하심.', '2025-09-12'),
  ('2025-02-28', '강남연세치과', '충치치료', '16, 36', '좌측 상하 어금니 레진 치료. 마취 후 진행.', NULL),
  ('2025-01-15', '서울밝은치과', '신경치료', '46', '우측 하단 어금니 신경치료 1차. 2주 후 재방문 필요.', '2025-01-29'),
  ('2024-12-20', '미소드림치과', '스케일링', '', '연말 정기 스케일링. 치석이 많이 쌓였다고 하심.', NULL),
  ('2024-11-05', '강남연세치과', '크라운', '26', '크라운 제작을 위한 본뜨기. 2주 후 장착 예정.', '2024-11-19'),
  ('2024-10-10', '서울밝은치과', '기타', '', '정기 검진. 전체적으로 양호하나 사랑니 관찰 필요.', '2025-04-10');

-- 리뷰 샘플
INSERT INTO reviews (clinic_id, author, rating, treatment, content, helpful_count, created_at) VALUES
  ('seoul-bright', '김**', 5, '임플란트', '의사 선생님이 정말 친절하시고 설명을 꼼꼼하게 해주셨어요. 임플란트 시술 후 관리 방법도 자세히 알려주셨습니다.', 24, now() - interval '10 days'),
  ('seoul-bright', '이**', 5, '스케일링', '직원분들도 친절하고 대기 시간도 짧았어요. 스케일링 꼼꼼하게 해주셔서 만족합니다.', 18, now() - interval '20 days'),
  ('seoul-bright', '박**', 4, '충치치료', '치료는 잘 해주셨는데 예약이 좀 밀리는 편이에요. 그래도 치료 결과는 만족합니다.', 12, now() - interval '30 days'),
  ('gangnam-yonsei', '최**', 5, '치아교정', '교정 상담 받았는데 정말 상세하게 설명해주셨어요. 비용도 합리적이고 시설도 깔끔합니다.', 30, now() - interval '15 days'),
  ('gangnam-yonsei', '정**', 4, '스케일링', '깔끔하게 해주셨어요. 다만 주차가 좀 불편합니다.', 8, now() - interval '25 days'),
  ('miso-dream', '한**', 5, '미백', '미백 효과가 정말 좋아요! 자연스럽게 밝아졌습니다. 가격도 다른 곳보다 합리적이에요.', 15, now() - interval '12 days'),
  ('miso-dream', '윤**', 4, '신경치료', '신경치료 3번 받았는데 통증 관리를 잘 해주셨어요. 꼼꼼한 치료에 감사드립니다.', 10, now() - interval '35 days');
