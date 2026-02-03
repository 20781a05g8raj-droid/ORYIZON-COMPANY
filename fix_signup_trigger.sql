-- 1. Create Customers table if it doesn't exist (Essential for the trigger to work)
-- This matches the schema we expect for the application
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS (Good Security Practice)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 3. Allow users to read their own data
CREATE POLICY "Users can read own customer data" ON public.customers
    FOR SELECT
    USING (auth.uid() = id);

-- 4. Create or Replace the Trigger Function
-- We use SECURITY DEFINER to ensure it has permission to write to public.customers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.customers (id, email, name)
    VALUES (
        new.id, 
        new.email, 
        COALESCE(new.raw_user_meta_data->>'full_name', '') -- Handle missing name gracefully
    )
    ON CONFLICT (id) DO NOTHING; -- Prevent errors if retry happens
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Re-bind the Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Grant permissions just in case
GRANT ALL ON public.customers TO service_role;
GRANT SELECT, UPDATE ON public.customers TO authenticated;
