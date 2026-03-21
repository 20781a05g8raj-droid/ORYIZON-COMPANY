'use client';

import React from 'react';
import { KEY_BENEFITS } from '@/lib/constants';
import { TiltCard } from '@/components/ui/animations/TiltCard';
import { useScrollReveal, useCardFlyInStagger, useTextReveal, useTextRotateReveal } from '@/hooks/useScrollReveal';

export function BenefitsSection() {
    // GSAP scroll reveal for header - Rotate Reveal
    const headerRef = useTextRotateReveal<HTMLDivElement>();

    // GSAP stagger reveal for benefits grid
    const gridRef = useCardFlyInStagger<HTMLDivElement>({
        distance: 200,
        stagger: 0.15,
    });

    return (
        <section className="py-20 md:py-32 bg-white" id="benefits" suppressHydrationWarning>
            <div className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-12" suppressHydrationWarning>
                {/* Section Header — GSAP scroll reveal */}
                <div ref={headerRef} className="text-center mb-10 md:mb-16">
                    <span className="text-[var(--color-accent)] font-semibold uppercase tracking-widest text-xs md:text-sm">
                        Pure Benefits
                    </span>
                    <h2 className="font-heading text-[1.7rem] leading-tight sm:text-4xl md:text-5xl font-bold mt-2 mb-4 text-[var(--color-text)]">
                        Health Benefits of{' '}
                        <span className="text-[var(--color-primary)]">Moringa Powder</span>
                    </h2>
                    <p className="text-[var(--color-text-light)] max-w-2xl mx-auto text-[15px] md:text-lg leading-relaxed">
                        Moringa powder is a nutrient-dense superfood that helps support immunity, boost energy, and promote overall wellness naturally.
                    </p>
                </div>

                {/* Benefits Grid — GSAP staggered scroll reveal */}
                <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    {KEY_BENEFITS.map((benefit, index) => (
                        <div key={index}>
                            <TiltCard
                                className="h-full rounded-[2rem]"
                                tiltStrength={8}
                                scale={1.03}
                            >
                                <div className={`chamkila-glass group relative p-8 md:p-10 lg:p-12 ${benefit.theme.bg} hover:-translate-y-2 rounded-[2rem] h-full transition-all duration-300 icon-3d-flip`}>
                                    {/* Gradient icon */}
                                    <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl ${benefit.theme.icon} mb-4 md:mb-6 shadow-lg icon-3d-target transition-transform`}>
                                        <span className="text-2xl md:text-3xl">{benefit.icon}</span>
                                    </div>

                                    <h3 className={`font-heading text-lg md:text-xl font-bold ${benefit.theme.text} mb-2 md:mb-3`}>
                                        {benefit.title}
                                    </h3>
                                    <p className={`text-[14px] md:text-base ${benefit.theme.text} opacity-80 leading-relaxed`}>
                                        {benefit.description}
                                    </p>

                                    {/* Shimmer on hover */}
                                    <div className="absolute inset-0 rounded-2xl animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                            </TiltCard>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
