-- =====================================================
-- ADD PRODUCT REVIEWS TABLE
-- Run this script in Supabase SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    user_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read reviews" ON product_reviews FOR SELECT USING (true);
CREATE POLICY "Auth users can insert reviews" ON product_reviews FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);

-- Optional: Add trigger to update product rating/review_count (Advanced)
-- For now, we will handle display naturally.
