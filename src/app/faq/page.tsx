'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, Search, ArrowRight, Loader2 } from 'lucide-react';
import { getFAQs, getFAQCategories } from '@/lib/api/faqs';
import { Button } from '@/components/ui/Button';
import type { FAQ } from '@/types/database';

export default function FAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [openIndex, setOpenIndex] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const [faqsData, categoriesData] = await Promise.all([
                    getFAQs(),
                    getFAQCategories()
                ]);
                setFaqs(faqsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error('Failed to fetch FAQs:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredFAQs = faqs.filter((faq) => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
                        Frequently Asked Questions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg max-w-2xl mx-auto"
                    >
                        Find answers to common questions about Moringa and our products.
                    </motion.p>
                </div>
            </section>

            {/* Search & Filter */}
            <section className="py-8 bg-[var(--color-cream)] sticky top-20 z-20 border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                    {/* Search */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for questions..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-secondary)] bg-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                        />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === 'all'
                                ? 'bg-[var(--color-primary)] text-white'
                                : 'bg-white text-[var(--color-text-light)] hover:bg-[var(--color-secondary)]'
                                }`}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-white text-[var(--color-text-light)] hover:bg-[var(--color-secondary)]'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ List */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredFAQs.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="text-6xl block mb-4">🔍</span>
                            <h3 className="font-heading text-xl font-semibold mb-2">No results found</h3>
                            <p className="text-[var(--color-text-light)]">
                                Try adjusting your search or category filter.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4" suppressHydrationWarning>
                            {filteredFAQs.map((faq, index) => (
                                <motion.div
                                    key={faq.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-[var(--color-cream)] rounded-xl overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenIndex(openIndex === faq.id ? null : faq.id)}
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--color-secondary)] transition-colors"
                                    >
                                        <div className="flex items-start gap-4 pr-4">
                                            <span className="text-[var(--color-accent)] font-bold mt-1">Q</span>
                                            <span className="font-heading font-semibold text-lg">
                                                {faq.question}
                                            </span>
                                        </div>
                                        <motion.span
                                            animate={{ rotate: openIndex === faq.id ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm"
                                        >
                                            <ChevronDown size={20} className="text-[var(--color-primary)]" />
                                        </motion.span>
                                    </button>

                                    <AnimatePresence>
                                        {openIndex === faq.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 pl-14">
                                                    <div className="flex gap-4">
                                                        <span className="text-[var(--color-primary)] font-bold">A</span>
                                                        <p className="text-[var(--color-text-light)] leading-relaxed">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Still Have Questions */}
            <section className="py-16 bg-[var(--color-cream)]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-5xl block mb-4">💬</span>
                        <h2 className="font-heading text-3xl font-bold mb-4">
                            Still Have Questions?
                        </h2>
                        <p className="text-[var(--color-text-light)] text-lg mb-8">
                            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/contact">
                                <Button variant="primary" size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
                                    Contact Us
                                </Button>
                            </Link>
                            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="lg">
                                    Chat on WhatsApp
                                </Button>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
