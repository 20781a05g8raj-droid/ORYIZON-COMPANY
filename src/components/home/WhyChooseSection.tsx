'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from '@/components/ui/animations/TiltCard';

const whyChoosePoints = [
    {
        text: 'Certified organic moringa grown naturally without chemicals or pesticides',
        icon: '🌿',
        gradient: 'from-green-500 to-emerald-600',
    },
    {
        text: 'Slow shade-dried to preserve maximum nutrients and natural potency',
        icon: '☀️',
        gradient: 'from-amber-500 to-orange-600',
    },
    {
        text: 'Lab-tested and FSSAI certified for quality and safety assurance',
        icon: '🔬',
        gradient: 'from-blue-500 to-indigo-600',
    },
    {
        text: 'Farm-to-pack freshness — sourced directly from local organic farms',
        icon: '🚜',
        gradient: 'from-emerald-500 to-teal-600',
    },
];

export function WhyChooseSection() {
    return (
        <section className="py-16 md:py-24 bg-[var(--color-cream)]" suppressHydrationWarning>
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" suppressHydrationWarning>
                {/* Section Header with 3D entrance */}
                <motion.div
                    initial={{ opacity: 0, y: 30, rotateX: 10 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16 perspective-container"
                >
                    <span className="text-[var(--color-accent)] font-semibold uppercase tracking-widest text-xs md:text-sm">
                        The Oryizon Difference
                    </span>
                    <h2 className="font-heading text-[1.7rem] leading-tight sm:text-4xl md:text-5xl font-bold mt-2 mb-4 text-[var(--color-text)]">
                        Why Choose{' '}
                        <span className="text-[var(--color-primary)]">Oryizon Moringa?</span>
                    </h2>
                </motion.div>

                {/* Cards with 3D TiltCard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6" suppressHydrationWarning>
                    {whyChoosePoints.map((point, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40, rotateX: 15 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.12, type: 'spring', stiffness: 80 }}
                        >
                            <TiltCard
                                className="h-full rounded-2xl"
                                tiltStrength={7}
                                scale={1.02}
                            >
                                <div className="flex items-start gap-4 p-5 md:p-8 bg-white rounded-2xl shadow-3d gradient-border-top h-full transition-all duration-300 icon-3d-flip">
                                    {/* 3D gradient icon */}
                                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${point.gradient} flex items-center justify-center flex-shrink-0 shadow-lg icon-3d-target`}>
                                        <span className="text-xl md:text-2xl">{point.icon}</span>
                                    </div>
                                    <p className="text-[14px] md:text-[15px] text-[var(--color-text)] font-medium leading-relaxed mt-1">
                                        {point.text}
                                    </p>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
