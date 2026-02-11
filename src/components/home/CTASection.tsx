'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FloatingElements } from '@/components/ui/animations/FloatingElements';

export function CTASection() {
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
                <div className="text-center perspective-container" suppressHydrationWarning>
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotateX: 30 }}
                        whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 120 }}
                        className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-white/90 text-xs md:text-sm font-semibold mb-6 md:mb-8 border border-white/10"
                        suppressHydrationWarning
                    >
                        <Sparkles size={16} className="text-[var(--color-accent)] animate-pulse" />
                        <span className="tracking-wide">Limited Time Offer</span>
                    </motion.div>

                    {/* Headline with 3D text reveal */}
                    <motion.h2
                        initial={{ opacity: 0, y: 40, rotateX: 15 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 80, delay: 0.1 }}
                        className="font-heading text-[1.7rem] leading-tight sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 md:mb-6"
                    >
                        Start Your Wellness Journey{' '}
                        <span className="text-gradient-gold">Today</span>
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="text-[15px] md:text-xl text-white/75 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed"
                    >
                        Join thousands of health-conscious individuals who have transformed their
                        lives with the power of Moringa.
                    </motion.p>

                    {/* Benefits — glass pills with staggered 3D entrance */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
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
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 + index * 0.12, type: 'spring', stiffness: 150 }}
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
                    </motion.div>

                    {/* CTA with 3D press */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, rotateX: 15 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md sm:max-w-none mx-auto"
                        suppressHydrationWarning
                    >
                        <Link href="/products" className="w-full sm:w-auto">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="accent" size="lg" fullWidth icon={<ArrowRight size={20} />} iconPosition="right" className="rounded-2xl h-14 shadow-2xl shadow-gold/20 glow-cta">
                                    Shop Now & Save 17%
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
                    </motion.div>

                    {/* Trust Note */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 md:mt-12 text-white/50 text-xs md:text-sm font-medium"
                    >
                        Trusted by 10,000+ customers across India 🇮🇳
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
