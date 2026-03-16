'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FloatingElements } from '@/components/ui/animations/FloatingElements';
import { useScrollReveal, useScrollRevealStagger } from '@/hooks/useScrollReveal';

export function CTASection() {
    // GSAP scroll reveal for badge
    const badgeRef = useScrollReveal<HTMLDivElement>({
        scale: 0.8,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
    });

    // GSAP scroll reveal for headline
    const headlineRef = useScrollReveal<HTMLHeadingElement>({
        scale: 0.88,
        y: 40,
        duration: 0.8,
        delay: 0.1,
        ease: 'power2.out',
    });

    // GSAP scroll reveal for subtitle
    const subtitleRef = useScrollReveal<HTMLParagraphElement>({
        scale: 0.9,
        y: 30,
        duration: 0.7,
        delay: 0.2,
        ease: 'power2.out',
    });

    // GSAP stagger for benefit pills
    const pillsRef = useScrollRevealStagger<HTMLDivElement>({
        scale: 0.88,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.3,
        ease: 'power2.out',
        start: 'top 85%',
    });

    // GSAP scroll reveal for CTA buttons
    const ctaRef = useScrollReveal<HTMLDivElement>({
        scale: 0.88,
        y: 30,
        duration: 0.7,
        delay: 0.4,
        ease: 'power2.out',
    });

    // GSAP scroll reveal for trust note
    const trustRef = useScrollReveal<HTMLParagraphElement>({
        scale: 0.95,
        y: 15,
        duration: 0.6,
        delay: 0.5,
        ease: 'power2.out',
    });

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-[var(--color-primary)] via-[#2D5016] to-[#1A3009] relative overflow-hidden" suppressHydrationWarning>
            {/* 3D Floating Particles */}
            <FloatingElements
                count={16}
                emojis={['🍃', '✨', '🌿', '💫', '🌱']}
                variant="dark"
            />

            {/* Background glow orbs */}
            <div className="absolute top-1/4 right-0 w-72 h-72 bg-[var(--color-accent)]/8 rounded-full blur-3xl pointer-events-none animate-pulse" suppressHydrationWarning />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-300/8 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} suppressHydrationWarning />

            <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8" suppressHydrationWarning>
                <div className="text-center" suppressHydrationWarning>
                    {/* Badge — GSAP scroll reveal */}
                    <div ref={badgeRef} className="mb-6 md:mb-8" suppressHydrationWarning>
                        <span
                            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-white/90 text-xs md:text-sm font-semibold border border-white/10"
                            suppressHydrationWarning
                        >
                            <Sparkles size={16} className="text-[var(--color-accent)] animate-pulse" />
                            <span className="tracking-wide">Limited Time Offer</span>
                        </span>
                    </div>

                    {/* Headline — GSAP scroll reveal */}
                    <h2
                        ref={headlineRef}
                        className="font-heading text-[1.7rem] leading-tight sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 md:mb-6"
                    >
                        Start Your Wellness Journey{' '}
                        <span className="text-gradient-gold">Today</span>
                    </h2>

                    {/* Subtitle — GSAP scroll reveal */}
                    <p
                        ref={subtitleRef}
                        className="text-[15px] md:text-xl text-white/75 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed"
                    >
                        Join thousands of health-conscious individuals who have transformed their
                        lives with the power of Moringa.
                    </p>

                    {/* Benefits — GSAP staggered scroll reveal */}
                    <div
                        ref={pillsRef}
                        className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-8 mb-10 md:mb-12"
                        suppressHydrationWarning
                    >
                        {[
                            'Free Shipping over ₹499',
                            '7-Day Money Back Guarantee',
                            'Certified Organic',
                        ].map((text, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.06, y: -3 }}
                                className="flex items-center gap-2.5 px-4 py-3 md:py-0 md:px-0 rounded-2xl md:rounded-none bg-white/8 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border border-white/10 md:border-none text-white/90 text-sm md:text-base font-medium cursor-default"
                                suppressHydrationWarning
                            >
                                <div className="w-5 h-5 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-full flex items-center justify-center shadow-lg" suppressHydrationWarning>
                                    <Check size={12} className="text-white" />
                                </div>
                                <span>{text}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA — GSAP scroll reveal */}
                    <div
                        ref={ctaRef}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md sm:max-w-none mx-auto"
                        suppressHydrationWarning
                    >
                        <Link href="/products" className="w-full sm:w-auto">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="accent" size="lg" fullWidth icon={<ArrowRight size={20} />} iconPosition="right" className="rounded-2xl h-14 shadow-2xl shadow-gold/20 glow-cta">
                                    Shop Now &amp; Save 17%
                                </Button>
                            </motion.div>
                        </Link>
                        <Link href="/about" className="w-full sm:w-auto">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="ghost" size="lg" fullWidth className="text-white hover:bg-white/10 rounded-2xl h-14 border border-white/10">
                                    Learn More
                                </Button>
                            </motion.div>
                        </Link>
                    </div>

                    {/* Trust Note — GSAP scroll reveal */}
                    <p
                        ref={trustRef}
                        className="mt-8 md:mt-12 text-white/50 text-xs md:text-sm font-medium"
                    >
                        Trusted by 10,000+ customers across India 🇮🇳
                    </p>
                </div>
            </div>
        </section>
    );
}
