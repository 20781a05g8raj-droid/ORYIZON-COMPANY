-- =====================================================
-- FIX: Allow public read access for Checkout Flow
-- Run this script in Supabase SQL Editor
-- =====================================================

-- 1. Allow public to read customers (needed to check if customer exists)
CREATE POLICY "Public read customers" ON customers FOR SELECT USING (true);

-- 2. Allow public to read orders (needed to return created order ID)
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);

-- 3. Allow public to read order items
CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (true);

-- Note: In a production app with authentication, you would restrict these 
-- to "auth.uid() = user_id" or similar. For this public checkout, 
-- we allow public access to facilitate the guest checkout flow.
