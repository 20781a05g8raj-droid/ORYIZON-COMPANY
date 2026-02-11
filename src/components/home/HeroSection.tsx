'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Leaf, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BeamBorder } from '@/components/ui/animations/BeamBorder';
import { CERTIFICATIONS } from '@/lib/constants';

// Pre-defined positions for floating leaves (avoids hydration mismatch)
const floatingLeaves = [
    { left: 5, top: 60, delay: 0, duration: 15, xOffset: 20 },
    { left: 15, top: 75, delay: 1, duration: 12, xOffset: 40 },
    { left: 25, top: 55, delay: 2, duration: 18, xOffset: 15 },
    { left: 35, top: 80, delay: 0.5, duration: 14, xOffset: 55 },
    { left: 45, top: 65, delay: 3, duration: 16, xOffset: 30 },
    { left: 55, top: 70, delay: 1.5, duration: 13, xOffset: 45 },
    { left: 65, top: 85, delay: 2.5, duration: 17, xOffset: 25 },
    { left: 75, top: 60, delay: 0.8, duration: 15, xOffset: 50 },
    { left: 85, top: 75, delay: 1.8, duration: 14, xOffset: 35 },
    { left: 95, top: 65, delay: 3.5, duration: 16, xOffset: 60 },
];

export function HeroSection() {
    return (
        <section
            className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A3009] via-[#2D5016] to-[#4A7C23]"
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                {floatingLeaves.map((leaf, i) => (
                    <div
                        key={i}
                        className="leaf text-3xl md:text-6xl absolute opacity-20 md:opacity-30"
                        style={{
                            left: `${leaf.left}%`,
                            top: `${leaf.top}%`,
                            animationDelay: `${leaf.delay}s`,
                            animationDuration: `${leaf.duration}s`,
                            willChange: 'transform, opacity'
                        }}
                    >
                        🍃
                    </div>
                ))}
            </div>

            {/* Gradient Overlay */}
            <div
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 md:from-black/30 md:to-black/10"
                suppressHydrationWarning
            />

            {/* Decorative glow orbs — mobile only */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full blur-3xl md:hidden" suppressHydrationWarning />
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl md:hidden" suppressHydrationWarning />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-24 flex flex-col items-center text-center" suppressHydrationWarning>
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl text-white/90 text-[11px] md:text-sm font-semibold mb-8 md:mb-10 border border-white/15 shadow-2xl"
                    suppressHydrationWarning
                >
                    <Sparkles size={16} className="text-[var(--color-accent)] animate-pulse" />
                    <span className="tracking-wide">Premium 100% Certified Organic Moringa</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-[2rem] leading-[1.15] xs:text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-5 md:mb-8 md:leading-[1.05]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    suppressHydrationWarning
                >
                    Organic Moringa Powder –<br />
                    <span className="text-[var(--color-accent)] drop-shadow-lg">Natural Superfood for Daily Health</span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-[15px] leading-relaxed sm:text-lg md:text-2xl text-white/75 max-w-3xl mx-auto mb-10 md:mb-14 md:leading-relaxed"
                    suppressHydrationWarning
                >
                    Oryizon brings you premium quality organic moringa powder made from carefully
                    dried moringa leaves to support immunity, energy, and overall wellness.
                </motion.p>

                {/* Key Benefits — Glass pills on mobile */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-3 md:gap-10 mb-10 md:mb-16"
                    suppressHydrationWarning
                >
                    {[
                        { icon: <Leaf size={18} />, text: '7x Vitamin C' },
                        { icon: <Shield size={18} />, text: '4x Calcium' },
                        { icon: <Sparkles size={18} />, text: '25% Protein' },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + index * 0.15 }}
                            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/8 backdrop-blur-xl border border-white/10 text-white/90 text-sm md:text-lg font-medium md:bg-transparent md:border-none md:backdrop-blur-none md:px-0 md:py-0"
                            suppressHydrationWarning
                        >
                            <span className="text-[var(--color-accent)] md:text-xl">{item.icon}</span>
                            <span>{item.text}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md md:max-w-none"
                    suppressHydrationWarning
                >
                    <Link href="/products" className="w-full sm:w-auto">
                        <BeamBorder className="rounded-2xl p-[1px] w-full">
                            <Button variant="accent" size="lg" className="w-full sm:w-64 h-14 md:h-16 text-lg md:text-xl rounded-2xl shadow-2xl shadow-gold/20 glow-cta" icon={<ArrowRight size={22} />} iconPosition="right">
                                Shop Now
                            </Button>
                        </BeamBorder>
                    </Link>
                    <Link href="/about" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full sm:w-64 h-14 md:h-16 text-lg md:text-xl rounded-2xl border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm transition-all">
                            Learn More
                        </Button>
                    </Link>
                </motion.div>

                {/* Trust Badges — Horizontal scroll on mobile */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="mt-14 md:mt-24 w-full"
                    suppressHydrationWarning
                >
                    <div className="flex md:flex-wrap md:justify-center items-center gap-3 md:gap-8 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5 md:mx-0 md:px-0 scroll-snap-x">
                        {CERTIFICATIONS.slice(0, 4).map((cert, index) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.1 + index * 0.1 }}
                                className="flex-shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/8 backdrop-blur-xl border border-white/10 transition-all hover:bg-white/15 hover:border-white/20 shadow-lg"
                                suppressHydrationWarning
                            >
                                <span className="text-xl md:text-2xl leading-none">{cert.icon}</span>
                                <span className="text-xs md:text-sm font-semibold text-white/90 whitespace-nowrap">{cert.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                suppressHydrationWarning
            >
                <span className="text-white/40 text-[9px] uppercase tracking-[0.25em] font-bold">Scroll</span>
                <div className="w-5 h-9 md:w-6 md:h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1.5 h-1.5 rounded-full bg-white/60"
                        suppressHydrationWarning
                    />
                </div>
            </motion.div>
        </section>
    );
}
