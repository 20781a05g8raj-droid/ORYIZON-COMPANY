'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HOW_TO_USE } from '@/lib/constants';

export function HowToUseSection() {
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
                        Simple & Versatile
                    </span>
                    <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4 text-[var(--color-text)] leading-tight">
                        How to Use{' '}
                        <span className="text-[var(--color-primary)]">Moringa Powder Daily?</span>
                    </h2>
                    <p className="text-[var(--color-text-light)] max-w-2xl mx-auto text-base md:text-lg">
                        You can consume moringa powder by mixing one teaspoon with warm water,
                        smoothies, juice, or adding it to meals. Regular daily use helps
                        support nutrition and overall health.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative" suppressHydrationWarning>
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary-light)] to-transparent -translate-y-1/2 z-0" suppressHydrationWarning />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative z-10" suppressHydrationWarning>
                        {HOW_TO_USE.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="relative h-full"
                            >
                                {/* Step Card */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-[var(--color-cream)] rounded-3xl p-8 md:p-10 text-center relative z-10 h-full border border-[var(--color-secondary)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
                                >
                                    {/* Step Number */}
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/20" suppressHydrationWarning>
                                        {index + 1}
                                    </div>

                                    {/* Icon */}
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                        className="text-5xl md:text-6xl mb-6 inline-block"
                                    >
                                        {step.icon}
                                    </motion.div>

                                    {/* Title */}
                                    <h3 className="font-heading text-xl md:text-2xl font-bold mb-3 text-[var(--color-text)]">
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-[var(--color-text-light)] text-sm md:text-base leading-relaxed">
                                        {step.description}
                                    </p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Dosage Info */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 md:mt-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-3xl p-8 md:p-12 text-white shadow-xl shadow-primary/10"
                    suppressHydrationWarning
                >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 text-center" suppressHydrationWarning>
                        <div>
                            <h4 className="font-heading text-xl md:text-2xl font-bold mb-2">Adults</h4>
                            <p className="text-white/80 font-medium">5-10g (1-2 teaspoons) daily</p>
                        </div>
                        <div className="border-y sm:border-y-0 sm:border-x border-white/10 py-8 sm:py-0">
                            <h4 className="font-heading text-xl md:text-2xl font-bold mb-2">Elders</h4>
                            <p className="text-white/80 font-medium">3-5g (½-1 teaspoon) daily</p>
                        </div>
                        <div>
                            <h4 className="font-heading text-xl md:text-2xl font-bold mb-2">Best Time</h4>
                            <p className="text-white/80 font-medium">Morning with breakfast</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
