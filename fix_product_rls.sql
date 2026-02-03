-- =====================================================
-- FIX RLS POLICIES FOR PRODUCTS AND VARIANTS
-- Run this script in the Supabase SQL Editor
-- =====================================================

-- 1. Enable full access for authenticated users on PRODUCTS table
-- We first drop existing policies to avoid conflicts if they exist
DROP POLICY IF EXISTS "Enable update for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON products;

CREATE POLICY "Enable update for authenticated users" ON products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON products
FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users" ON products
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 2. Enable full access for authenticated users on PRODUCT_VARIANTS table
DROP POLICY IF EXISTS "Enable all for authenticated users" ON product_variants;

CREATE POLICY "Enable all for authenticated users" ON product_variants
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. Verify settings (Optional comment)
-- Policies are now set. Any logged-in user (admin) can CRUD products and variants.
