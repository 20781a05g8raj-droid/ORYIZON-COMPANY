'use client';

import React from 'react';
import { KEY_BENEFITS } from '@/lib/constants';
import { TiltCard } from '@/components/ui/animations/TiltCard';
import { useScrollReveal, useScrollRevealStagger } from '@/hooks/useScrollReveal';

export function BenefitsSection() {
    // GSAP scroll reveal for header
    const headerRef = useScrollReveal<HTMLDivElement>({
        scale: 0.92,
        y: 40,
        duration: 0.7,
        ease: 'power2.out',
    });

    // GSAP stagger reveal for benefits grid
    const gridRef = useScrollRevealStagger<HTMLDivElement>({
        scale: 0.85,
        y: 50,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        start: 'top 82%',
    });

    return (
        <section className="py-16 md:py-24 bg-white" id="benefits" suppressHydrationWarning>
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" suppressHydrationWarning>
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
                <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {KEY_BENEFITS.map((benefit, index) => (
                        <div key={index}>
                            <TiltCard
                                className="h-full rounded-2xl"
                                tiltStrength={8}
                                scale={1.03}
                            >
                                <div className={`group relative p-5 md:p-8 ${benefit.theme.bg} rounded-2xl h-full transition-all duration-300 icon-3d-flip`}>
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
