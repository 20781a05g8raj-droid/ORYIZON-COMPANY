'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

import { Marquee } from '@/components/ui/animations/Marquee';

export function BrandStorySection() {
    return (
        <section className="pb-16 md:pb-24 bg-white overflow-hidden" suppressHydrationWarning>
            {/* Marquee Strip */}
            <div className="py-6 md:py-8 bg-[var(--color-cream)] mb-12 md:mb-20 border-y border-[var(--color-secondary)]/20">
                <Marquee speed={40}>
                    {["100% Organic", "•", "Lab Tested", "•", "Sustainably Sourced", "•", "Vegan", "•", "Non-GMO", "•", "Premium Quality", "•", "Ethically Grown", "•"].map((text, i) => (
                        <span key={i} className={`text-xl md:text-2xl font-light ${text === "•" ? "text-amber-400" : "text-emerald-900"}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                            {text}
                        </span>
                    ))}
                </Marquee>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center" suppressHydrationWarning>
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)] shadow-2xl" suppressHydrationWarning>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-8xl md:text-9xl animate-pulse-soft opacity-20">
                                    🌳
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute inset-0 bg-black/10 transition-opacity hover:opacity-0" />

                            {/* Overlay Text */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-8" suppressHydrationWarning>
                                <p className="text-white font-heading text-xl md:text-2xl font-bold mb-1" suppressHydrationWarning>
                                    From Our Farm to Your Table
                                </p>
                                <p className="text-white/80 text-sm md:text-base" suppressHydrationWarning>
                                    Organic farms in South India
                                </p>
                            </div>
                        </div>

                        {/* Floating Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="absolute -bottom-6 -right-2 md:-right-10 bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-[240px] md:max-w-xs border border-[var(--color-secondary)]/50 z-10"
                            suppressHydrationWarning
                        >
                            <div className="flex items-center gap-4" suppressHydrationWarning>
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-xl md:text-2xl flex-shrink-0 shadow-lg shadow-gold/20">
                                    🌿
                                </div>
                                <div className="min-w-0">
                                    <p className="font-heading font-bold text-sm md:text-base truncate" suppressHydrationWarning>100% Organic</p>
                                    <p className="text-xs md:text-sm text-[var(--color-text-light)] line-clamp-2" suppressHydrationWarning>
                                        Pure, natural, and potent
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col pt-8 lg:pt-0"
                    >
                        <span className="text-[var(--color-accent)] font-semibold uppercase tracking-widest text-xs md:text-sm">
                            Our Story
                        </span>

                        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-6 text-[var(--color-text)] leading-tight" suppressHydrationWarning>
                            Bringing Nature&apos;s Best{' '}
                            <span className="text-[var(--color-primary)]">To You</span>
                        </h2>

                        <div className="space-y-4 text-[var(--color-text-light)] text-base md:text-lg leading-relaxed" suppressHydrationWarning>
                            <p>
                                Our journey began with a simple belief: everyone deserves access to
                                pure, powerful nutrition from nature. We partner directly with
                                certified organic farms in South India, where Moringa trees have
                                thrived for centuries.
                            </p>
                            <p>
                                Every batch of Moringa Pure is carefully harvested at peak nutrition,
                                gently dried to preserve potency, and tested by third-party labs.
                                From farm to table, we ensure the highest quality standards.
                            </p>
                        </div>

                        {/* Journey Steps */}
                        <div className="grid grid-cols-2 gap-6 mt-10" suppressHydrationWarning>
                            {[
                                { step: '01', title: 'Harvest', desc: 'Hand-picked daily' },
                                { step: '02', title: 'Process', desc: 'Gently air-dried' },
                                { step: '03', title: 'Test', desc: 'Lab verified' },
                                { step: '04', title: 'Pack', desc: 'Eco-sealed' },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex gap-4"
                                    suppressHydrationWarning
                                >
                                    <span className="font-heading text-2xl md:text-3xl font-bold text-[var(--color-accent)] opacity-50">
                                        {item.step}
                                    </span>
                                    <div>
                                        <p className="font-bold text-sm md:text-base text-[var(--color-text)] mb-0.5">{item.title}</p>
                                        <p className="text-xs md:text-sm text-[var(--color-text-light)]">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="mt-10" suppressHydrationWarning>
                            <Link href="/about">
                                <Button variant="primary" size="lg" icon={<ArrowRight size={20} />} iconPosition="right" className="w-full sm:w-auto">
                                    Read Our Full Story
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
