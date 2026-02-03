-- Force Supabase PostgREST to reload its schema cache
-- Run this if you see errors like "Could not find column in schema cache"
NOTIFY pgrst, 'reload schema';
