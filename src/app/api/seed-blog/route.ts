import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { blogPosts } from '@/data/blog';

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        console.log('Environment check:', {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseKey,
            keyType: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service_role' : 'anon'
        });

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const postsToInsert = blogPosts.map(post => ({
            // Omit ID to let Supabase generate it (likely UUID)
            // id: post.id, 
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            image: post.image,
            icon: post.icon,
            author: post.author,
            category: post.category,
            // Convert tags to appropriate format if needed, string[] should be fine
            tags: post.tags,
            featured: post.featured || false,
            published: true,
            date: post.date,
            read_time: post.readTime,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }));

        console.log(`Attempting to seed ${postsToInsert.length} blog posts using SLUG constraint...`);

        // Upsert based on SLUG to update existing articles
        const { data, error } = await supabase
            .from('blog_posts')
            .upsert(postsToInsert, { onConflict: 'slug' })
            .select();

        if (error) {
            console.error('Supabase error details:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            });
            return NextResponse.json({ error: error.message, full_error: error }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Blog posts seeded successfully!',
            count: data?.length,
            inserted_posts: data?.map(p => ({ title: p.title, slug: p.slug }))
        });
    } catch (err: any) {
        console.error('Server error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
