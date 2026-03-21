'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from '@/components/ui/animations/TiltCard';
import { useScrollReveal, useCardFlyInStagger, useTextRotateReveal } from '@/hooks/useScrollReveal';

const whyChoosePoints = [
    {
        text: 'Certified organic moringa grown naturally without chemicals or pesticides',
        icon: '🌿',
        gradient: 'from-green-500 to-emerald-600',
        theme: {
            bg: 'bg-gradient-to-br from-green-50/80 to-green-100/50 border border-green-200 shadow-lg shadow-green-500/5',
            text: 'text-green-950',
            iconText: 'text-white',
        }
    },
    {
        text: 'Slow shade-dried to preserve maximum nutrients and natural potency',
        icon: '☀️',
        gradient: 'from-amber-500 to-orange-600',
        theme: {
            bg: 'bg-gradient-to-br from-amber-50/80 to-amber-100/50 border border-amber-200 shadow-lg shadow-amber-500/5',
            text: 'text-amber-950',
            iconText: 'text-white',
        }
    },
    {
        text: 'Lab-tested and FSSAI certified for quality and safety assurance',
        icon: '🔬',
        gradient: 'from-blue-500 to-indigo-600',
        theme: {
            bg: 'bg-gradient-to-br from-blue-50/80 to-blue-100/50 border border-blue-200 shadow-lg shadow-blue-500/5',
            text: 'text-blue-950',
            iconText: 'text-white',
        }
    },
    {
        text: 'Farm-to-pack freshness — sourced directly from local organic farms',
        icon: '🚜',
        gradient: 'from-emerald-500 to-teal-600',
        theme: {
            bg: 'bg-gradient-to-br from-teal-50/80 to-teal-100/50 border border-teal-200 shadow-lg shadow-teal-500/5',
            text: 'text-teal-950',
            iconText: 'text-white',
        }
    },
];

export function WhyChooseSection() {
    // GSAP scroll reveal for the header - Rotate Reveal
    const headerRef = useTextRotateReveal<HTMLDivElement>();

    // GSAP stagger fly-in for the card grid
    const gridRef = useCardFlyInStagger<HTMLDivElement>({
        distance: 200,
        stagger: 0.15,
        duration: 0.9,
    });

    return (
        <section className="py-20 md:py-32 bg-[var(--color-cream)]" suppressHydrationWarning>
            <div className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-12" suppressHydrationWarning>
                {/* Section Header — GSAP scroll reveal */}
                <div ref={headerRef} className="text-center mb-10 md:mb-16">
                    <span className="text-[var(--color-accent)] font-semibold uppercase tracking-widest text-xs md:text-sm">
                        The Oryizon Difference
                    </span>
                    <h2 className="font-heading text-[1.7rem] leading-tight sm:text-4xl md:text-5xl font-bold mt-2 mb-4 text-[var(--color-text)]">
                        Why Choose{' '}
                        <span className="text-[var(--color-primary)]">Oryizon Moringa?</span>
                    </h2>
                </div>

                {/* Cards — GSAP staggered scroll reveal */}
                <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10" suppressHydrationWarning>
                    {whyChoosePoints.map((point, index) => (
                        <div key={index}>
                            <TiltCard
                                className="h-full rounded-[2rem]"
                                tiltStrength={7}
                                scale={1.02}
                            >
                                <div className={`chamkila-glass flex items-start gap-5 p-8 md:p-10 lg:p-12 ${point.theme.bg} hover:-translate-y-2 rounded-[2rem] h-full transition-all duration-300 icon-3d-flip`}>
                                    {/* 3D gradient icon */}
                                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${point.gradient} flex items-center justify-center flex-shrink-0 shadow-lg icon-3d-target`}>
                                        <span className={`text-xl md:text-2xl ${point.theme.iconText}`}>{point.icon}</span>
                                    </div>
                                    <p className={`text-[14px] md:text-[15px] ${point.theme.text} font-medium leading-relaxed mt-1 opacity-90`}>
                                        {point.text}
                                    </p>
                                </div>
                            </TiltCard>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
