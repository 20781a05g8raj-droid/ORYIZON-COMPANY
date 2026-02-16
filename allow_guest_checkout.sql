-- =====================================================
-- FIX: Allow Guest Checkout & Fix Foreign Key Constraints
-- Run this script in Supabase SQL Editor
-- =====================================================

-- 1. Drop the foreign key constraint on 'id' if it exists.
-- This allows 'id' to be a random UUID for guests, instead of strictly matching auth.users.id
-- If the constraint exists.
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_id_fkey;

-- 2. Ensure 'id' has a default value (Random UUID)
ALTER TABLE customers ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- 3. Add a 'user_id' column to link to registered users (optional/nullable)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 4. Update RLS Policies to use 'user_id' for owner checks instead of 'id'
DROP POLICY IF EXISTS "Users can read own customer data" ON customers;

CREATE POLICY "Users can read own customer data" ON customers
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own customer data" ON customers
    FOR UPDATE
    USING (auth.uid() = user_id);

-- 5. Update the Trigger to insert 'user_id' when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.customers (user_id, email, name)
    VALUES (
        new.id, -- Set the user_id link
        new.email, 
        COALESCE(new.raw_user_meta_data->>'full_name', '')
    )
    ON CONFLICT (email) DO UPDATE 
    SET user_id = EXCLUDED.user_id; -- If guest customer existed with same email, link them now
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. Grant public permissions for guest checkout flow
-- (Guests need to Insert themselves into customers)
GRANT INSERT ON public.customers TO anon, authenticated;
GRANT SELECT ON public.customers TO anon, authenticated;
GRANT UPDATE ON public.customers TO anon, authenticated;

-- 7. Fix Orders RLS to allow public insertion (for Guest Orders)
DROP POLICY IF EXISTS "Public insert orders" ON orders;
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read orders" ON orders;
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true); -- needed for returning created order

-- Fix Order Items RLS
DROP POLICY IF EXISTS "Public insert order_items" ON order_items;
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read order_items" ON order_items;
CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (true);
