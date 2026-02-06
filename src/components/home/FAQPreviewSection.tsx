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
        <section className="py-16 md:py-24 bg-[var(--color-secondary)]/50" suppressHydrationWarning>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16"
                    suppressHydrationWarning
                >
                    <span className="text-[var(--color-accent)] font-semibold uppercase tracking-widest text-xs md:text-sm">
                        Got Questions?
                    </span>
                    <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4 text-[var(--color-text)] leading-tight">
                        Frequently Asked{' '}
                        <span className="text-[var(--color-primary)]">Questions</span>
                    </h2>
                    <p className="text-[var(--color-text-light)] max-w-2xl mx-auto text-base md:text-lg">
                        Find answers to the most common questions about Moringa and our products.
                    </p>
                </motion.div>

                {/* FAQ Accordion */}
                <div className="space-y-4" suppressHydrationWarning>
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--color-secondary)]"
                            suppressHydrationWarning
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-[var(--color-cream)] transition-all group"
                            >
                                <span className="font-heading font-bold text-base md:text-lg pr-4 text-[var(--color-text)]">
                                    {faq.question}
                                </span>
                                <motion.span
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-secondary)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white'}`}
                                >
                                    <ChevronDown size={openIndex === index ? 18 : 20} />
                                </motion.span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                        className="overflow-hidden"
                                        suppressHydrationWarning
                                    >
                                        <div className="px-5 md:px-6 pb-6 text-[var(--color-text-light)] text-sm md:text-base leading-relaxed" suppressHydrationWarning>
                                            <div className="pt-2 border-t border-[var(--color-secondary)]/50 pt-4">
                                                {faq.answer}
                                            </div>
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
                    className="text-center mt-10 md:mt-12"
                    suppressHydrationWarning
                >
                    <Link href="/faq">
                        <Button variant="outline" size="lg" icon={<ArrowRight size={20} />} iconPosition="right" className="w-full sm:w-auto">
                            View All FAQs
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
