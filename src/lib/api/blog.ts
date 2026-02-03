import { supabase } from '@/lib/supabase';
import type { BlogPost, BlogPostInsert, BlogPostUpdate } from '@/types/database';

// Get all published blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get all blog posts (including drafts - for admin)
export async function getAllBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get featured blog posts
export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .eq('featured', true)
        .order('date', { ascending: false })
        .limit(3);

    if (error) throw error;
    return data || [];
}

// Get blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

// Get blog post by ID
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

// Create blog post
export async function createBlogPost(post: BlogPostInsert): Promise<BlogPost> {
    const { data, error } = await supabase
        .from('blog_posts')
        .insert(post as any)
        .select()
        .single();

    if (error) throw error;
    return data as BlogPost;
}

// Update blog post
export async function updateBlogPost(id: string, post: BlogPostUpdate): Promise<BlogPost> {
    const { data, error } = await (supabase as any)
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as BlogPost;
}

// Delete blog post
export async function deleteBlogPost(id: string): Promise<void> {
    const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Get blog posts by category
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .eq('category', category)
        .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get blog categories
export async function getBlogCategories(): Promise<string[]> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('category')
        .eq('published', true);

    if (error) throw error;

    const categories = [...new Set((data as Array<{ category: string }>)?.map(p => p.category) || [])];
    return categories;
}
