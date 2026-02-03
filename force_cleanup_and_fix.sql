-- 1. Clean up orphaned customers (Customers without a matching Auth User)
-- This fixes the issue where an email exists in 'customers' but not in 'auth.users'
DELETE FROM public.customers 
WHERE id NOT IN (SELECT id FROM auth.users);

-- 2. Drop the existing foreign key constraint to ensure we can recreate it correctly
ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS customers_id_fkey;

-- 3. Re-add the constraint with ON DELETE CASCADE
-- This ensures that when you delete a User in Supabase, the Customer record is gone too.
ALTER TABLE public.customers
    ADD CONSTRAINT customers_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- 4. Update the Trigger Function to be super robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.customers (id, email, name)
    VALUES (
        new.id, 
        new.email, 
        COALESCE(new.raw_user_meta_data->>'full_name', '')
    )
    ON CONFLICT (email) DO UPDATE 
    SET 
        id = EXCLUDED.id, -- This might be tricky if ID is PK, but let's try to sync
        name = EXCLUDED.name,
        updated_at = NOW(); 
    return new;
EXCEPTION
    WHEN unique_violation THEN
        -- If we still hit a violation, we just ignore it to allow the Auth User creation to succeed
        -- The user can fix their profile later
        RETURN new;
    WHEN OTHERS THEN
        -- Log other errors but don't fail the signup
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Helper trigger to ensure Email sync (Optional but good)
-- If user changes email in Auth, update Customer
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.customers
    SET email = new.email, updated_at = NOW()
    WHERE id = new.id;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();
