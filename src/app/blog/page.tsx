'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { getBlogPosts, getBlogCategories } from '@/lib/api/blog';
import { Button } from '@/components/ui/Button';
import type { BlogPost } from '@/types/database';

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        async function fetchData() {
            try {
                const [postsData, categoriesData] = await Promise.all([
                    getBlogPosts(),
                    getBlogCategories()
                ]);
                setPosts(postsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error('Failed to fetch blog data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredPosts = selectedCategory === 'All'
        ? posts
        : posts.filter(post => post.category === selectedCategory);

    const featuredPost = filteredPosts[0];
    const recentPosts = filteredPosts.slice(1);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" suppressHydrationWarning>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-heading text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        Health & Wellness Blog
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg max-w-2xl mx-auto"
                    >
                        Expert insights on Moringa, nutrition, and natural wellness.
                    </motion.p>
                </div>
            </section>

            {/* Categories */}
            <section className="py-6 bg-white border-b sticky top-20 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                    <div className="flex flex-wrap gap-2 justify-center" suppressHydrationWarning>
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'All'
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-[var(--color-secondary)] text-[var(--color-text-light)] hover:bg-[var(--color-primary)] hover:text-white'
                                }`}
                        >
                            All Posts
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[var(--color-secondary)] text-[var(--color-text-light)] hover:bg-[var(--color-primary)] hover:text-white'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Area */}
            {filteredPosts.length === 0 ? (
                <div className="py-20 text-center text-gray-500">
                    No articles found in this category.
                </div>
            ) : (
                <>
                    {/* Featured Post */}
                    {featuredPost && (
                        <section className="py-12 bg-[var(--color-cream)]">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid lg:grid-cols-2 gap-8 items-center bg-white rounded-2xl overflow-hidden shadow-sm"
                                >
                                    {/* Image */}
                                    <div className="aspect-video lg:aspect-auto lg:h-full relative bg-gray-100">
                                        {featuredPost.image ? (
                                            <Image
                                                src={featuredPost.image}
                                                alt={featuredPost.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)] flex items-center justify-center">
                                                <span className="text-9xl">{featuredPost.icon || '📚'}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-8">
                                        <span className="inline-block px-3 py-1 bg-[var(--color-accent)] text-white text-sm rounded-full mb-4">
                                            Featured
                                        </span>
                                        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                                            <Link href={`/blog/${featuredPost.slug}`} className="hover:text-[var(--color-primary)]">
                                                {featuredPost.title}
                                            </Link>
                                        </h2>
                                        <p className="text-[var(--color-text-light)] mb-6 line-clamp-3">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)] mb-6">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={16} />
                                                {new Date(featuredPost.date).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={16} />
                                                {featuredPost.read_time}
                                            </span>
                                        </div>
                                        <Link href={`/blog/${featuredPost.slug}`}>
                                            <Button variant="primary" icon={<ArrowRight size={18} />} iconPosition="right">
                                                Read More
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </section>
                    )}

                    {/* Recent Posts */}
                    {recentPosts.length > 0 && (
                        <section className="py-16 bg-white">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 className="font-heading text-3xl font-bold mb-10">Latest Articles</h2>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" suppressHydrationWarning>
                                    {recentPosts.map((post, index) => (
                                        <motion.article
                                            key={post.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-[var(--color-cream)] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            {/* Image */}
                                            <div className="aspect-video relative bg-gray-100">
                                                {post.image ? (
                                                    <Image
                                                        src={post.image}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)] flex items-center justify-center">
                                                        <span className="text-6xl">{post.icon || '📄'}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                <span className="inline-block px-2 py-1 bg-[var(--color-secondary)] text-[var(--color-text-light)] text-xs rounded mb-3">
                                                    {post.category}
                                                </span>
                                                <h3 className="font-heading text-xl font-semibold mb-3 line-clamp-2">
                                                    <Link href={`/blog/${post.slug}`} className="hover:text-[var(--color-primary)]">
                                                        {post.title}
                                                    </Link>
                                                </h3>
                                                <p className="text-[var(--color-text-light)] text-sm mb-4 line-clamp-2">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex items-center justify-between text-sm text-[var(--color-text-muted)]">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {new Date(post.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {post.read_time}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.article>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}

            {/* Newsletter CTA */}
            <section className="py-16 bg-[var(--color-primary)]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-heading text-3xl font-bold text-white mb-4">
                            Stay Updated
                        </h2>
                        <p className="text-white/80 mb-8">
                            Subscribe to our newsletter for the latest health tips and exclusive offers.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                            />
                            <Button variant="accent">Subscribe</Button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
