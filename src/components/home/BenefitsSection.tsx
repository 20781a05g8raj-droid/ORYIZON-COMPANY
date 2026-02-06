'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { KEY_BENEFITS } from '@/lib/constants';

export function BenefitsSection() {
    return (
        <section className="py-16 md:py-24 bg-white" suppressHydrationWarning>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-20"
                    suppressHydrationWarning
                >
                    <span className="text-[var(--color-accent)] font-semibold uppercase tracking-widest text-xs md:text-sm">
                        Why Choose Moringa
                    </span>
                    <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4 text-[var(--color-text)] leading-tight">
                        Nature&apos;s Complete{' '}
                        <span className="text-[var(--color-primary)]">Superfood</span>
                    </h2>
                    <p className="text-[var(--color-text-light)] max-w-2xl mx-auto text-base md:text-lg">
                        Discover the incredible benefits that make Moringa one of the most
                        nutrient-dense plants on Earth.
                    </p>
                </motion.div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" suppressHydrationWarning>
                    {KEY_BENEFITS.map((benefit, index) => (
                        <motion.div
                            key={benefit.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="p-6 md:p-8 bg-[var(--color-cream)] rounded-2xl md:rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 border border-[var(--color-secondary)]/50"
                            suppressHydrationWarning
                        >
                            {/* Icon */}
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm"
                                style={{ backgroundColor: `${benefit.color}20` }}
                                suppressHydrationWarning
                            >
                                {benefit.icon}
                            </motion.div>

                            {/* Content */}
                            <h3 className="font-heading text-xl md:text-2xl font-bold mb-3 text-[var(--color-text)]">
                                {benefit.title}
                            </h3>
                            <p className="text-[var(--color-text-light)] text-sm md:text-base leading-relaxed">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 md:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
                    suppressHydrationWarning
                >
                    {[
                        { value: '90+', label: 'Nutrients' },
                        { value: '7x', label: 'More Vitamin C than Oranges' },
                        { value: '4x', label: 'More Calcium than Milk' },
                        { value: '25%', label: 'Plant-Based Protein' },
                    ].map((stat, index) => (
                        <div key={index} className="text-center" suppressHydrationWarning>
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, type: 'spring' }}
                                className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-primary)] mb-2"
                            >
                                {stat.value}
                            </motion.div>
                            <p className="text-[var(--color-text-light)] text-xs md:text-sm font-medium px-2">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
