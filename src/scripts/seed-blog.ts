
import { createClient } from '@supabase/supabase-js';
import { blogPosts } from '../data/blog';
import fs from 'fs';
import path from 'path';

// Manual Env Load
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    console.log('Loading .env.local...');
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} else {
    console.warn('No .env.local found!');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Try service role key first (bypasses RLS), then anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials!');
    console.log('URL:', supabaseUrl);
    console.log('Key:', supabaseKey ? 'Found' : 'Missing');
    process.exit(1);
}

console.log('Initializing Supabase client...');
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log(`Found ${blogPosts.length} posts to seed...`);

    const postsToInsert = blogPosts.map(post => ({
        // id: post.id, // Let DB generate ID if new, or use existing if known? 
        // Better to NOT send ID for new posts unless we want to force specific IDs. 
        // The static data HAS IDs (blog-1, blog-2).
        // If we upsert by slug, we might not need ID. 
        // However, if we upsert, we should probably exclude ID or let Supabase handle it.
        // But if we want to UPDATE existing posts that match the slug, we don't need ID in the payload if 'slug' is the conflict target.
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        icon: post.icon,
        author: post.author,
        category: post.category,
        tags: post.tags,
        featured: post.featured || false,
        published: true,
        date: post.date,
        read_time: post.readTime,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }));

    console.log('Upserting posts to Supabase...');

    // Upserting based on 'slug' to avoid duplicates
    const { data, error } = await supabase
        .from('blog_posts')
        .upsert(postsToInsert, { onConflict: 'slug' })
        .select();

    if (error) {
        console.error('Seeding Failed:', error.message);
        console.error('Details:', error);
    } else {
        console.log(`Success! ${data?.length} posts upserted/inserted.`);
    }
}

seed().catch(err => console.error('Script Error:', err));
