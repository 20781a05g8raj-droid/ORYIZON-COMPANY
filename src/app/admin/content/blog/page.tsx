'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Calendar,
    User,
    Tag,
    FileText,
    Loader2,
    RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllBlogPosts, getBlogCategories } from '@/lib/api/blog';
import { deleteBlogPostAction } from '@/app/actions/blog';
import { blogPosts as staticBlogPosts } from '@/data/blog';
import type { BlogPost } from '@/types/database';
import { supabase } from '@/lib/supabase';

const statusColors: Record<string, string> = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    archived: 'bg-gray-100 text-gray-700',
};

export default function BlogManagementPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [categories, setCategories] = useState<string[]>([]);
    const [seeding, setSeeding] = useState(false);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const [postsData, categoriesData] = await Promise.all([
                getAllBlogPosts(),
                getBlogCategories()
            ]);
            setPosts(postsData);
            setCategories(['All', ...categoriesData]);
        } catch (err) {
            setError('Failed to load blog posts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSeed = async () => {
        if (!confirm('This will seed the database with static blog posts from your code. Continue?')) return;

        try {
            setSeeding(true);

            // Format posts for DB
            const postsToInsert = staticBlogPosts.map(post => ({
                // id: post.id, // Omit ID to let DB generate UUID if needed, or use slug as key
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

            // Use upsert to avoid duplicates, relying on SLUG as unique key
            const { error } = await supabase
                .from('blog_posts')
                .upsert(postsToInsert as any, { onConflict: 'slug' });

            if (error) throw error;

            alert('Blog posts seeded successfully!');
            fetchPosts(); // Refresh list
        } catch (err: any) {
            alert('Failed to seed posts. Error: ' + err.message);
            console.error(err);
        } finally {
            setSeeding(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

        try {
            // Use Server Action to bypass RLS
            await deleteBlogPostAction(id);

            // Only update local state if DB delete succeeded
            setPosts(prev => prev.filter(p => p.id !== id));
            alert(`"${title}" deleted successfully.`);
        } catch (err: any) {
            console.error('Delete exception:', err);
            alert('Failed to delete post: ' + (err.message || 'Unknown error'));
        }
    };

    const filteredPosts = posts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const publishedCount = posts.filter(p => p.published).length;
    const draftCount = posts.filter(p => !p.published).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="ml-2 text-gray-600">Loading blog posts...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={fetchPosts}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg"
                >
                    <RefreshCw size={18} /> Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6" suppressHydrationWarning>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
                    <p className="text-gray-500">Create and manage your blog content</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSeed}
                        disabled={seeding}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                        title="Seed database from static file"
                    >
                        {seeding ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                        {seeding ? 'Seeding...' : 'Seed Data'}
                    </button>
                    <button
                        onClick={fetchPosts}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                        title="Refresh"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <Link
                        href="/admin/content/blog/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                    >
                        <Plus size={20} />
                        New Post
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Posts', value: posts.length.toString(), color: 'text-gray-900' },
                    { label: 'Published', value: publishedCount.toString(), color: 'text-green-600' },
                    { label: 'Drafts', value: draftCount.toString(), color: 'text-yellow-600' },
                    { label: 'Categories', value: (categories.length - 1).toString(), color: 'text-blue-600' },
                ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Posts List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {filteredPosts.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No blog posts found
                        </div>
                    ) : (
                        filteredPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex-shrink-0 overflow-hidden">
                                        {post.image ? (
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-3xl">{post.icon}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-lg mb-1">{post.title}</h3>
                                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <User size={14} />
                                                        {post.author}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Tag size={14} />
                                                        {post.category}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {new Date(post.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.published ? statusColors['published'] : statusColors['draft']}`}>
                                                    {post.published ? 'published' : 'draft'}
                                                </span>
                                                {post.featured && (
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                                        featured
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                            title="View"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <Link
                                            href={`/admin/content/blog/${post.id}`}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id, post.title)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">Showing {filteredPosts.length} of {posts.length} posts</p>
                </div>
            </div>
        </div>
    );
}
