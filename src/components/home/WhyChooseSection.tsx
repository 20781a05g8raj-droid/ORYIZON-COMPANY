'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const whyChoosePoints = [
    {
        text: '100% natural and organic ingredients',
        icon: '🌿',
        gradient: 'from-emerald-500 to-emerald-700',
    },
    {
        text: 'Rich in vitamins, minerals, and antioxidants',
        icon: '💎',
        gradient: 'from-violet-500 to-violet-700',
    },
    {
        text: 'Supports immunity and daily energy',
        icon: '🛡️',
        gradient: 'from-amber-500 to-amber-700',
    },
    {
        text: 'No chemicals, preservatives, or additives',
        icon: '✅',
        gradient: 'from-teal-500 to-teal-700',
    },
    {
        text: 'Carefully processed to retain nutrients',
        icon: '🔬',
        gradient: 'from-rose-500 to-rose-700',
    },
];

export function WhyChooseSection() {
    return (
        <section className="py-16 md:py-24 bg-[var(--color-cream)]" id="why-choose">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16"
                >
                    <span className="text-[var(--color-accent)] font-semibold uppercase tracking-widest text-xs md:text-sm">
                        Why Oryizon
                    </span>
                    <h2 className="font-heading text-[1.7rem] leading-tight sm:text-4xl md:text-5xl font-bold mt-2 mb-4 text-[var(--color-text)]">
                        Why Choose Oryizon{' '}
                        <span className="text-[var(--color-primary)]">Organic Moringa Powder?</span>
                    </h2>
                    <p className="text-[var(--color-text-light)] max-w-2xl mx-auto text-[15px] md:text-lg leading-relaxed">
                        We believe in delivering the purest form of nature&apos;s superfood, ensuring every spoonful is packed with goodness.
                    </p>
                </motion.div>

                {/* Why Choose Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
                    {whyChoosePoints.map((point, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="flex items-start gap-4 p-5 md:p-8 bg-white rounded-2xl shadow-premium gradient-border-top transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                        >
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${point.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                <span className="text-xl md:text-2xl">{point.icon}</span>
                            </div>
                            <div className="flex-1 pt-1">
                                <div className="flex items-start gap-2">
                                    <Check size={16} className="text-[var(--color-primary)] flex-shrink-0 mt-1" />
                                    <span className="font-heading font-bold text-[15px] md:text-lg text-[var(--color-text)] leading-snug">
                                        {point.text}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
