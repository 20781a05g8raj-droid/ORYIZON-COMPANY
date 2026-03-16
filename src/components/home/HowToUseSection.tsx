'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HOW_TO_USE } from '@/lib/constants';
import { TiltCard } from '@/components/ui/animations/TiltCard';
import { useScrollReveal, useScrollRevealStagger } from '@/hooks/useScrollReveal';

export function HowToUseSection() {
    // GSAP scroll reveal for header
    const headerRef = useScrollReveal<HTMLDivElement>({
        scale: 0.92,
        y: 40,
        duration: 0.7,
        ease: 'power2.out',
    });

    // GSAP stagger reveal for step cards
    const stepsRef = useScrollRevealStagger<HTMLDivElement>({
        scale: 0.85,
        y: 60,
        duration: 0.85,
        stagger: 0.15,
        ease: 'power2.out',
        start: 'top 82%',
    });

    // GSAP scroll reveal for the dosage info card
    const dosageRef = useScrollReveal<HTMLDivElement>({
        scale: 0.88,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
    });

    return (
        <section className="py-16 md:py-24 bg-white" suppressHydrationWarning>
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" suppressHydrationWarning>
                {/* Section Header — GSAP scroll reveal */}
                <div
                    ref={headerRef}
                    className="text-center mb-12 md:mb-20"
                    suppressHydrationWarning
                >
                    <span className="text-[var(--color-accent)] font-semibold uppercase tracking-widest text-xs md:text-sm">
                        Simple &amp; Versatile
                    </span>
                    <h2 className="font-heading text-[1.7rem] leading-tight sm:text-4xl md:text-5xl font-bold mt-2 mb-4 text-[var(--color-text)]">
                        How to Use{' '}
                        <span className="text-[var(--color-primary)]">Moringa Powder Daily?</span>
                    </h2>
                    <p className="text-[var(--color-text-light)] max-w-2xl mx-auto text-[15px] md:text-lg leading-relaxed">
                        You can consume moringa powder by mixing one teaspoon with warm water,
                        smoothies, juice, or adding it to meals. Regular daily use helps
                        support nutrition and overall health.
                    </p>
                </div>

                {/* Steps — GSAP staggered scroll reveal */}
                <div className="relative" suppressHydrationWarning>
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary-light)] to-transparent -translate-y-1/2 z-0" suppressHydrationWarning />

                    <div ref={stepsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative z-10" suppressHydrationWarning>
                        {HOW_TO_USE.map((step, index) => (
                            <div key={step.id} className="relative h-full">
                                <TiltCard
                                    className="h-full rounded-3xl"
                                    tiltStrength={10}
                                    scale={1.04}
                                >
                                    <div className={`${step.theme.bg} rounded-3xl p-8 md:p-10 text-center relative z-10 h-full backdrop-blur-sm icon-3d-flip`}>
                                        {/* Step Number */}
                                        <motion.div
                                            whileHover={{ scale: 1.2, rotateZ: 10 }}
                                            className={`absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 ${step.theme.icon} rounded-full flex items-center justify-center font-bold text-sm shadow-xl z-20`}
                                            suppressHydrationWarning
                                        >
                                            {index + 1}
                                        </motion.div>

                                        {/* Icon */}
                                        <motion.div
                                            whileHover={{ scale: 1.15, rotateY: 180 }}
                                            transition={{ type: 'spring', stiffness: 200 }}
                                            className="mb-6 inline-block icon-3d-target"
                                        >
                                            <div className={`w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full ${step.theme.icon} bg-opacity-10 flex items-center justify-center shadow-lg`}>
                                                <span className="text-4xl md:text-5xl">{step.icon}</span>
                                            </div>
                                        </motion.div>

                                        <h3 className={`font-heading text-xl md:text-2xl font-bold mb-3 ${step.theme.text}`}>
                                            {step.title}
                                        </h3>

                                        <p className={`${step.theme.text} opacity-80 text-sm md:text-base leading-relaxed`}>
                                            {step.description}
                                        </p>
                                    </div>
                                </TiltCard>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dosage Info — GSAP scroll reveal */}
                <div ref={dosageRef} className="mt-16 md:mt-24" suppressHydrationWarning>
                    <TiltCard tiltStrength={4} scale={1.01} className="rounded-3xl">
                        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-3xl p-8 md:p-12 text-white shadow-xl shadow-primary/10">
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
                        </div>
                    </TiltCard>
                </div>
            </div>
        </section>
    );
}
