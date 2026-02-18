-- FIX: Grant Delete Permissions for Products
-- Run this script in Supabase SQL Editor

-- 1. Enable RLS on tables (just to be sure)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing DELETE policies if any
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON product_variants;

-- 3. Create DELETE policy for Products
CREATE POLICY "Enable delete for authenticated users" ON products
    FOR DELETE
    TO authenticated
    USING (true);

-- 4. Create DELETE policy for Product Variants
CREATE POLICY "Enable delete for authenticated users" ON product_variants
    FOR DELETE
    TO authenticated
    USING (true);

-- 5. Create UPDATE policy for Products (often needed for soft deletes or modifications)
DROP POLICY IF EXISTS "Enable update for authenticated users" ON products;
CREATE POLICY "Enable update for authenticated users" ON products
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6. Create INSERT policy for Products (if missing)
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON products;
CREATE POLICY "Enable insert for authenticated users" ON products
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
