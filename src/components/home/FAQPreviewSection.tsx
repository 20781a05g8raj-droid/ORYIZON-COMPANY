'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { getTopFAQs } from '@/data/faqs';
import { Button } from '@/components/ui/Button';

export function FAQPreviewSection() {
    const faqs = getTopFAQs(4);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-20 bg-[var(--color-secondary)]" suppressHydrationWarning>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                    suppressHydrationWarning
                >
                    <span className="text-[var(--color-accent)] font-medium uppercase tracking-wider text-sm">
                        Got Questions?
                    </span>
                    <h2 className="font-heading text-4xl md:text-5xl font-bold mt-2 mb-4">
                        Frequently Asked{' '}
                        <span className="text-[var(--color-primary)]">Questions</span>
                    </h2>
                    <p className="text-[var(--color-text-light)] max-w-2xl mx-auto text-lg">
                        Find answers to the most common questions about Moringa and our products.
                    </p>
                </motion.div>

                {/* FAQ Accordion */}
                <div className="space-y-4" suppressHydrationWarning>
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl overflow-hidden shadow-sm"
                            suppressHydrationWarning
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--color-cream)] transition-colors"
                            >
                                <span className="font-heading font-semibold text-lg pr-4">
                                    {faq.question}
                                </span>
                                <motion.span
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-shrink-0 w-8 h-8 bg-[var(--color-secondary)] rounded-full flex items-center justify-center"
                                >
                                    <ChevronDown size={20} className="text-[var(--color-primary)]" />
                                </motion.span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                        suppressHydrationWarning
                                    >
                                        <div className="px-5 pb-5 text-[var(--color-text-light)] leading-relaxed" suppressHydrationWarning>
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-10"
                    suppressHydrationWarning
                >
                    <Link href="/faq">
                        <Button variant="outline" size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
                            View All FAQs
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
