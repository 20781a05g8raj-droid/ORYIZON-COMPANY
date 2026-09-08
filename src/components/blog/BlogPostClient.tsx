'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Facebook, Twitter, Linkedin, ArrowRight, Loader2 } from 'lucide-react';
import { getBlogPostBySlug, getBlogPostsByCategory } from '@/lib/api/blog';
import { getBlogBySlug as getLocalBlogBySlug } from '@/data/blog';
import { Button } from '@/components/ui/Button';
import type { BlogPost } from '@/types/database';

interface BlogPostClientProps {
    initialSlug?: string;
}

export function BlogPostClient({ initialSlug }: BlogPostClientProps) {
    const params = useParams();
    const slug = initialSlug || (params?.slug as string) || '';

    const [post, setPost] = useState<BlogPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            try {
                let fetchedPost = await getBlogPostBySlug(slug);
                if (!fetchedPost) {
                    fetchedPost = (getLocalBlogBySlug(slug) as any) || null;
                }
                setPost(fetchedPost);

                if (fetchedPost) {
                    const related = await getBlogPostsByCategory(fetchedPost.category);
                    setRelatedPosts(related.filter(p => p.id !== fetchedPost?.id).slice(0, 3));
                }
            } catch (error) {
                console.error('Failed to fetch blog post:', error);
                const localFallback = (getLocalBlogBySlug(slug) as any) || null;
                setPost(localFallback);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-heading text-3xl font-bold mb-4">Article Not Found</h1>
                    <Link href="/blog">
                        <Button variant="primary">View All Articles</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://oryizon.com/blog/${slug}`;

    return (
        <div className="min-h-screen pt-24" suppressHydrationWarning>
            {/* Hero */}
            <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
                        <ArrowLeft size={18} />
                        Back to Blog
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-block px-3 py-1 bg-[var(--color-accent)] text-white text-sm rounded-full mb-4 font-semibold">
                            {post.category}
                        </span>
                        <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-white/80">
                            <span className="flex items-center gap-2">
                                <Calendar size={18} />
                                {post.date}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock size={18} />
                                {post.read_time}
                            </span>
                            <span>By {post.author}</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Image */}
            <section className="relative -mt-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="aspect-video bg-[var(--color-cream)] rounded-2xl overflow-hidden flex items-center justify-center shadow-lg border border-neutral-100">
                        <span className="text-9xl">{post.icon || '🌿'}</span>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Sidebar - Share */}
                        <div className="lg:col-span-1 lg:sticky lg:top-28 lg:self-start">
                            <div className="flex lg:flex-col gap-3">
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Share on Facebook"
                                    className="w-10 h-10 rounded-full bg-[var(--color-secondary)] flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                                >
                                    <Facebook size={18} />
                                </a>
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Share on Twitter"
                                    className="w-10 h-10 rounded-full bg-[var(--color-secondary)] flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors"
                                >
                                    <Twitter size={18} />
                                </a>
                                <a
                                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Share on LinkedIn"
                                    className="w-10 h-10 rounded-full bg-[var(--color-secondary)] flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors"
                                >
                                    <Linkedin size={18} />
                                </a>
                            </div>
                        </div>

                        {/* Main Content */}
                        <article className="lg:col-span-11 prose prose-lg max-w-none">
                            <p className="text-xl text-[var(--color-text-light)] mb-8 leading-relaxed font-medium">
                                {post.excerpt}
                            </p>

                            {post.content ? (
                                <div
                                    className="text-[var(--color-text)] blog-content leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            ) : null}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                                {post.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-100 text-sm rounded-full font-medium"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="py-16 bg-[var(--color-cream)]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="font-heading text-3xl font-bold mb-10">Related Articles</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedPosts.map((relatedPost) => (
                                <article
                                    key={relatedPost.id}
                                    className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="aspect-video bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)] flex items-center justify-center">
                                        <span className="text-6xl">{relatedPost.icon || '📄'}</span>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-heading text-lg font-semibold mb-3 line-clamp-2">
                                            <Link href={`/blog/${relatedPost.slug}`} className="hover:text-[var(--color-primary)]">
                                                {relatedPost.title}
                                            </Link>
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                                            <Clock size={14} />
                                            {relatedPost.read_time}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-heading text-3xl font-bold mb-4 text-neutral-900">
                        Ready to Experience Pure Organic Moringa?
                    </h2>
                    <p className="text-neutral-600 mb-8 max-w-xl mx-auto leading-relaxed">
                        Order 100% pure organic moringa leaf powder directly to your doorstep with fast shipping across India, Bihar & Nepal.
                    </p>
                    <Link href="/products/organic-moringa-powder-250g">
                        <Button variant="primary" size="lg" icon={<ArrowRight size={20} />} iconPosition="right" className="rounded-xl px-8 shadow-lg">
                            Buy 250g Organic Moringa Powder
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
