-- =====================================================
-- FIX RLS POLICIES FOR MARKETING TABLES
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. DROP EXISTING RESTRICTIVE POLICIES ON COUPONS
-- =====================================================
DROP POLICY IF EXISTS "Public read coupons" ON coupons;

-- =====================================================
-- 2. CREATE PROPER RLS POLICIES FOR COUPONS
-- =====================================================
-- Allow reading all coupons (not just active ones for admin)
CREATE POLICY "Public read all coupons" ON coupons 
    FOR SELECT USING (true);

-- Allow inserting coupons
CREATE POLICY "Public insert coupons" ON coupons 
    FOR INSERT WITH CHECK (true);

-- Allow updating coupons
CREATE POLICY "Public update coupons" ON coupons 
    FOR UPDATE USING (true);

-- Allow deleting coupons
CREATE POLICY "Public delete coupons" ON coupons 
    FOR DELETE USING (true);

-- =====================================================
-- 3. VERIFY/FIX BANNERS POLICIES (if not already applied)
-- =====================================================
-- Drop existing and recreate to ensure they exist
DROP POLICY IF EXISTS "Public read banners" ON banners;
DROP POLICY IF EXISTS "Public insert banners" ON banners;
DROP POLICY IF EXISTS "Public update banners" ON banners;
DROP POLICY IF EXISTS "Public delete banners" ON banners;

CREATE POLICY "Public read banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Public insert banners" ON banners FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update banners" ON banners FOR UPDATE USING (true);
CREATE POLICY "Public delete banners" ON banners FOR DELETE USING (true);

-- =====================================================
-- 4. VERIFY/FIX CAMPAIGNS POLICIES (if not already applied)
-- =====================================================
DROP POLICY IF EXISTS "Public read campaigns" ON campaigns;
DROP POLICY IF EXISTS "Public insert campaigns" ON campaigns;
DROP POLICY IF EXISTS "Public update campaigns" ON campaigns;
DROP POLICY IF EXISTS "Public delete campaigns" ON campaigns;

CREATE POLICY "Public read campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Public insert campaigns" ON campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update campaigns" ON campaigns FOR UPDATE USING (true);
CREATE POLICY "Public delete campaigns" ON campaigns FOR DELETE USING (true);

-- =====================================================
-- 5. ENSURE RLS IS ENABLED ON ALL TABLES
-- =====================================================
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- DONE! Marketing CRUD operations should now work.
-- =====================================================
