'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { getBlogBySlug, blogPosts } from '@/data/blog';
import { Button } from '@/components/ui/Button';

export default function BlogPostPage() {
    const params = useParams();
    const post = getBlogBySlug(params.slug as string);

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

    const relatedPosts = blogPosts
        .filter(p => p.id !== post.id && p.category === post.category)
        .slice(0, 3);

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
                        <span className="inline-block px-3 py-1 bg-[var(--color-accent)] text-white text-sm rounded-full mb-4">
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
                                {post.readTime}
                            </span>
                            <span>By {post.author}</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Image */}
            <section className="relative -mt-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="aspect-video bg-[var(--color-cream)] rounded-2xl overflow-hidden flex items-center justify-center shadow-lg">
                        <span className="text-9xl">{post.icon || '📄'}</span>
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
                                <button className="w-10 h-10 rounded-full bg-[var(--color-secondary)] flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                                    <Facebook size={18} />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-[var(--color-secondary)] flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors">
                                    <Twitter size={18} />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-[var(--color-secondary)] flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors">
                                    <Linkedin size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <article className="lg:col-span-11 prose prose-lg max-w-none">
                            <p className="text-xl text-[var(--color-text-light)] mb-8">
                                {post.excerpt}
                            </p>

                            {/* Rendered content would go here - for now, sample content */}
                            {post.content ? (
                                <div
                                    className="text-[var(--color-text)] blog-content"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            ) : (
                                <div className="text-[var(--color-text)]">
                                    <h2 className="font-heading text-2xl font-semibold mb-4">Introduction</h2>
                                    <p className="mb-6">
                                        Moringa oleifera, often called the &quot;miracle tree,&quot; has been used for centuries
                                        in traditional medicine across Africa and Asia. Today, modern science is
                                        beginning to validate what ancient practitioners knew all along – Moringa
                                        is a nutritional powerhouse.
                                    </p>

                                    <h2 className="font-heading text-2xl font-semibold mb-4">The Nutritional Profile</h2>
                                    <p className="mb-6">
                                        Gram for gram, Moringa leaves contain more vitamin C than oranges, more
                                        calcium than milk, more vitamin A than carrots, and more iron than spinach.
                                        This remarkable nutritional density makes it one of the most valuable
                                        plant-based supplements available.
                                    </p>

                                    <div className="bg-[var(--color-cream)] p-6 rounded-xl my-8">
                                        <h3 className="font-heading text-xl font-semibold mb-3">Key Nutrients in Moringa</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-[var(--color-primary)]">✓</span>
                                                <span>7× more Vitamin C than oranges</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[var(--color-primary)]">✓</span>
                                                <span>4× more Calcium than milk</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[var(--color-primary)]">✓</span>
                                                <span>3× more Iron than spinach</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[var(--color-primary)]">✓</span>
                                                <span>2× more Protein than yogurt</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <h2 className="font-heading text-2xl font-semibold mb-4">Health Benefits</h2>
                                    <p className="mb-6">
                                        Regular consumption of Moringa has been associated with numerous health
                                        benefits including improved energy levels, better digestive health,
                                        enhanced immune function, and support for healthy blood sugar levels.
                                    </p>

                                    <h2 className="font-heading text-2xl font-semibold mb-4">How to Incorporate Moringa</h2>
                                    <p className="mb-6">
                                        The easiest way to add Moringa to your diet is through high-quality
                                        Moringa powder. Simply add 1-2 teaspoons to smoothies, juices, or water.
                                        You can also mix it into soups, salads, or baked goods.
                                    </p>

                                    <div className="bg-[var(--color-primary)] text-white p-6 rounded-xl my-8">
                                        <h3 className="font-heading text-xl font-semibold mb-3">Ready to Try?</h3>
                                        <p className="mb-4 text-white/90">
                                            Experience the benefits of premium organic Moringa powder.
                                        </p>
                                        <Link href="/products">
                                            <Button variant="accent">Shop Moringa Powder</Button>
                                        </Link>
                                    </div>

                                    <h2 className="font-heading text-2xl font-semibold mb-4">Conclusion</h2>
                                    <p className="mb-6">
                                        With its exceptional nutritional profile and versatility, Moringa deserves
                                        a place in everyone&apos;s wellness routine. Start with a small amount and
                                        gradually increase as your body adjusts to this powerful superfood.
                                    </p>
                                </div>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                                {post.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-[var(--color-secondary)] text-sm rounded-full"
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
                                            {relatedPost.readTime}
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
                    <h2 className="font-heading text-3xl font-bold mb-4">
                        Ready to Transform Your Health?
                    </h2>
                    <p className="text-[var(--color-text-light)] mb-8">
                        Try our premium organic Moringa powder and experience the difference.
                    </p>
                    <Link href="/products">
                        <Button variant="primary" size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
                            Shop Now
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
