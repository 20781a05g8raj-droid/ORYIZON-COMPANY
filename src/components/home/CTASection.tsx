'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Pre-defined positions for floating leaves (avoids hydration mismatch)
const ctaLeaves = [
    { left: 10, top: 75, delay: 0, duration: 10 },
    { left: 20, top: 85, delay: 0.5, duration: 9 },
    { left: 30, top: 80, delay: 1, duration: 11 },
    { left: 45, top: 90, delay: 1.5, duration: 8 },
    { left: 60, top: 75, delay: 2, duration: 10 },
    { left: 70, top: 85, delay: 0.8, duration: 9 },
    { left: 80, top: 80, delay: 1.2, duration: 11 },
    { left: 90, top: 90, delay: 2.5, duration: 8 },
];

export function CTASection() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-[var(--color-primary)] to-[#1A3009] relative overflow-hidden" suppressHydrationWarning>
            {/* Background Elements - Using fixed positions */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" suppressHydrationWarning>
                {ctaLeaves.map((leaf, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0.1 }}
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            y: [-50, -150],
                        }}
                        transition={{
                            duration: leaf.duration,
                            repeat: Infinity,
                            delay: leaf.delay,
                        }}
                        className="absolute text-3xl md:text-5xl"
                        style={{
                            left: `${leaf.left}%`,
                            top: `${leaf.top}%`,
                        }}
                        suppressHydrationWarning
                    >
                        🍃
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                <div className="text-center" suppressHydrationWarning>
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs md:text-sm font-medium mb-6 md:mb-8"
                        suppressHydrationWarning
                    >
                        <Sparkles size={16} className="text-[var(--color-accent)]" />
                        <span>Limited Time Offer</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                    >
                        Start Your Wellness Journey{' '}
                        <span className="text-[var(--color-accent)]">Today</span>
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base md:text-xl text-white/80 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed"
                    >
                        Join thousands of health-conscious individuals who have transformed their
                        lives with the power of Moringa.
                    </motion.p>

                    {/* Benefits */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10 md:mb-12"
                        suppressHydrationWarning
                    >
                        {[
                            'Free Shipping over ₹499',
                            '30-Day Money Back Guarantee',
                            'Certified Organic',
                        ].map((text, index) => (
                            <div key={index} className="flex items-center gap-2 text-white/90 text-sm md:text-base font-medium" suppressHydrationWarning>
                                <div className="w-5 h-5 bg-[var(--color-accent)] rounded-full flex items-center justify-center shadow-lg shadow-gold/20" suppressHydrationWarning>
                                    <Check size={12} className="text-white" />
                                </div>
                                <span>{text}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        suppressHydrationWarning
                    >
                        <Link href="/products" className="w-full sm:w-auto">
                            <Button variant="accent" size="lg" fullWidth icon={<ArrowRight size={20} />} iconPosition="right">
                                Shop Now & Save 17%
                            </Button>
                        </Link>
                        <Link href="/about" className="w-full sm:w-auto">
                            <Button variant="ghost" size="lg" fullWidth className="text-white hover:bg-white/10">
                                Learn More
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Trust Note */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 md:mt-12 text-white/50 text-xs md:text-sm font-medium"
                    >
                        Trusted by 10,000+ customers across India 🇮🇳
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
