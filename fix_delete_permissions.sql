-- FIX: Grant Delete and Update Permissions for Admin/Authenticated Users
-- Run this script in Supabase SQL Editor

-- 1. Grant DELETE permissions to authenticated users
GRANT DELETE ON public.customers TO authenticated;
GRANT DELETE ON public.orders TO authenticated;

-- 2. Grant UPDATE permissions on orders (needed to unlink customer before delete)
GRANT UPDATE ON public.orders TO authenticated;

-- 3. Add RLS Policies for Deleting Customers
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON customers;
CREATE POLICY "Enable delete for authenticated users" ON customers
    FOR DELETE
    TO authenticated
    USING (true);

-- 4. Add RLS Policies for Deleting Orders
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON orders;
CREATE POLICY "Enable delete for authenticated users" ON orders
    FOR DELETE
    TO authenticated
    USING (true);

-- 5. Add RLS Policies for Updating Orders (for unlink operation)
-- Note: 'Public insert orders' and 'Public read orders' exist, but we need UPDATE
DROP POLICY IF EXISTS "Enable update for authenticated users" ON orders;
CREATE POLICY "Enable update for authenticated users" ON orders
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
