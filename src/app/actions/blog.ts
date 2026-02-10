'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

async function getSupabase() {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (serviceKey) {
        // Use Service Role Key to bypass RLS
        return createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceKey
        );
    }

    // Fallback: Use authenticated user's session (Cookies)
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
}

export async function deleteBlogPostAction(id: string) {
    const supabase = await getSupabase();

    const { error, count } = await supabase
        .from('blog_posts')
        .delete({ count: 'exact' })
        .eq('id', id);

    if (error) {
        throw new Error(`Delete failed: ${error.message}. (Hint: Set SUPABASE_SERVICE_ROLE_KEY in .env.local to bypass permissions)`);
    }

    if (count === 0) {
        console.error('Delete failed. Debug Info:', {
            id,
            keyLoaded: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            keyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length,
            url: process.env.NEXT_PUBLIC_SUPABASE_URL
        });
        throw new Error(`Delete failed: Permission denied (RLS) or item not found. Key Loaded: ${!!process.env.SUPABASE_SERVICE_ROLE_KEY}. ID: ${id}`);
    }

    revalidatePath('/admin/content/blog');
    revalidatePath('/blog');
    return { success: true };
}

export async function createBlogPostAction(data: any) {
    const supabase = await getSupabase();

    const { error } = await supabase
        .from('blog_posts')
        .insert([data]);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/content/blog');
    revalidatePath('/blog');
    return { success: true };
}

export async function updateBlogPostAction(id: string, data: any) {
    const supabase = await getSupabase();

    const { error } = await supabase
        .from('blog_posts')
        .update(data)
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/content/blog');
    revalidatePath(`/blog/${data.slug}`);
    return { success: true };
}
