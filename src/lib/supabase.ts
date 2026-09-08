import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

// Self-healing: Automatically purge corrupted/invalid refresh tokens from browser storage
if (typeof window !== 'undefined') {
    // Check initial session and clear silently if refresh token is broken or not found
    supabase.auth.getSession().then(({ error }) => {
        if (
            error &&
            (error.message?.includes('Refresh Token') ||
             error.message?.includes('refresh_token_not_found') ||
             (error as { code?: string }).code === 'refresh_token_not_found')
        ) {
            supabase.auth.signOut({ scope: 'local' }).catch(() => {});
        }
    }).catch(() => {});

    // Listen for auth failures and clear stale local storage items
    supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
            try {
                Object.keys(localStorage).forEach((key) => {
                    if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
                        localStorage.removeItem(key);
                    }
                });
            } catch {
                // Ignore storage access errors
            }
        }
    });
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
        return String((error as { message: unknown }).message);
    }
    return 'An unexpected error occurred';
}
