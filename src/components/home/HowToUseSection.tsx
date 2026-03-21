'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HOW_TO_USE } from '@/lib/constants';
import Image from 'next/image';
import { TiltCard } from '@/components/ui/animations/TiltCard';
import { useScrollReveal, useCardFlyInStagger, useTextTranslateReveal } from '@/hooks/useScrollReveal';

export function HowToUseSection() {
    // GSAP scroll reveal for header
    const headerRef = useTextTranslateReveal<HTMLDivElement>({
        direction: 'right',
        distance: 40,
        duration: 0.8,
    });

    // GSAP stagger reveal for step cards
    const stepsRef = useCardFlyInStagger<HTMLDivElement>({
        distance: 200,
        stagger: 0.15,
        duration: 0.9,
    });

    // GSAP scroll reveal for the dosage info card
    const dosageRef = useCardFlyInStagger<HTMLDivElement>({
        distance: 200,
        duration: 0.9,
    });

    return (
        <section className="py-20 md:py-32 bg-[var(--color-secondary)]/20" suppressHydrationWarning>
            <div className="max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-12" suppressHydrationWarning>
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

                    <div ref={stepsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 relative z-10" suppressHydrationWarning>
                        {HOW_TO_USE.map((step, index) => (
                            <div key={step.id} className="relative h-full">
                                <TiltCard
                                    className="h-full rounded-[2.5rem]"
                                    tiltStrength={10}
                                    scale={1.04}
                                >
                                    {step.image ? (
                                        <div className="chamkila-glass group rounded-[2.5rem] relative z-10 h-full hover:-translate-y-2 transition-all duration-300 icon-3d-flip overflow-hidden">
                                            <Image src={step.image} alt={step.title} width={800} height={800} className="w-full h-full object-cover aspect-square sm:aspect-[4/5]" />
                                            {/* Step Number overlay */}
                                            <motion.div
                                                whileHover={{ scale: 1.2, rotateZ: 10 }}
                                                className={`absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 ${step.theme.icon} rounded-full flex items-center justify-center font-bold text-white shadow-xl z-20`}
                                                suppressHydrationWarning
                                            >
                                                {index + 1}
                                            </motion.div>
                                        </div>
                                    ) : (
                                        <div className={`chamkila-glass ${step.theme.bg} rounded-[2.5rem] p-10 md:p-14 text-center relative z-10 h-full hover:-translate-y-2 transition-all duration-300 icon-3d-flip`}>
                                            <motion.div
                                                whileHover={{ scale: 1.2, rotateZ: 10 }}
                                                className={`absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 ${step.theme.icon} rounded-full flex items-center justify-center font-bold text-white shadow-xl z-20`}
                                                suppressHydrationWarning
                                            >
                                                {index + 1}
                                            </motion.div>

                                            <motion.div
                                                whileHover={{ scale: 1.15, rotateY: 180 }}
                                                transition={{ type: 'spring', stiffness: 200 }}
                                                className="mb-6 inline-block icon-3d-target"
                                            >
                                                <div className={`w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full ${step.theme.icon} bg-opacity-10 flex items-center justify-center shadow-lg relative`}>
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
                                    )}
                                </TiltCard>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dosage Info — GSAP scroll reveal */}
                <div ref={dosageRef} className="mt-20 md:mt-32" suppressHydrationWarning>
                    <TiltCard tiltStrength={4} scale={1.01} className="rounded-3xl">
                        <div className="chamkila-glass bg-[var(--color-primary)]/90 rounded-3xl p-10 md:p-16 text-white">
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
