'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Marquee } from '@/components/ui/animations/Marquee';
import { TiltCard } from '@/components/ui/animations/TiltCard';

export function BrandStorySection() {
    return (
        <section className="pb-16 md:pb-24 bg-white overflow-hidden" suppressHydrationWarning>
            {/* Marquee Strip */}
            <div className="py-5 md:py-8 bg-[var(--color-cream)] mb-10 md:mb-20 border-y border-[var(--color-secondary)]/20">
                <Marquee speed={40}>
                    {["100% Organic", "•", "Lab Tested", "•", "Sustainably Sourced", "•", "Vegan", "•", "Non-GMO", "•", "Premium Quality", "•", "Ethically Grown", "•"].map((text, i) => (
                        <span key={i} className={`text-lg md:text-2xl font-light ${text === "•" ? "text-amber-400" : "text-emerald-900"}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                            {text}
                        </span>
                    ))}
                </Marquee>
            </div>

            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" suppressHydrationWarning>
                <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center" suppressHydrationWarning>
                    {/* Image Side with 3D tilt */}
                    <motion.div
                        initial={{ opacity: 0, x: -30, rotateY: -8 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 70 }}
                        className="relative"
                    >
                        <TiltCard tiltStrength={6} scale={1.02} className="rounded-3xl">
                            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)] shadow-3d" suppressHydrationWarning>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1], rotateZ: [0, 5, 0] }}
                                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                        className="text-7xl md:text-9xl opacity-20"
                                    >
                                        🌳
                                    </motion.div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute inset-0 bg-black/10 transition-opacity hover:opacity-0" />

                                {/* Overlay Text */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 md:p-8" suppressHydrationWarning>
                                    <p className="text-white font-heading text-lg md:text-2xl font-bold mb-1" suppressHydrationWarning>
                                        From Our Farm to Your Table
                                    </p>
                                    <p className="text-white/80 text-sm md:text-base" suppressHydrationWarning>
                                        Organic farms in South India
                                    </p>
                                </div>
                            </div>
                        </TiltCard>

                        {/* Floating Card — glass effect with 3D entrance */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 30, rotate: -5 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
                            whileHover={{ scale: 1.08, rotate: 3 }}
                            className="absolute -bottom-5 right-2 md:-right-10 glass-card rounded-2xl shadow-2xl p-4 md:p-6 max-w-[220px] md:max-w-xs z-10"
                            suppressHydrationWarning
                        >
                            <div className="flex items-center gap-3 md:gap-4" suppressHydrationWarning>
                                <div className="w-11 h-11 md:w-14 md:h-14 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-full flex items-center justify-center text-lg md:text-2xl flex-shrink-0 shadow-lg shadow-gold/20">
                                    🌿
                                </div>
                                <div className="min-w-0">
                                    <p className="font-heading font-bold text-sm md:text-base truncate" suppressHydrationWarning>100% Organic</p>
                                    <p className="text-xs md:text-sm text-[var(--color-text-light)] line-clamp-2" suppressHydrationWarning>
                                        Pure, natural, and potent
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Content Side with 3D entrance */}
                    <motion.div
                        initial={{ opacity: 0, x: 30, rotateY: 5 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 70, delay: 0.2 }}
                        className="flex flex-col pt-6 lg:pt-0"
                    >
                        <span className="text-[var(--color-accent)] font-semibold uppercase tracking-widest text-xs md:text-sm">
                            Our Story
                        </span>

                        <h2 className="font-heading text-[1.7rem] leading-tight sm:text-4xl md:text-5xl font-bold mt-2 mb-5 md:mb-6 text-[var(--color-text)]" suppressHydrationWarning>
                            Bringing Nature&apos;s Best{' '}
                            <span className="text-[var(--color-primary)]">To You</span>
                        </h2>

                        <div className="space-y-4 text-[var(--color-text-light)] text-[15px] md:text-lg leading-relaxed" suppressHydrationWarning>
                            <p>
                                Our journey began with a simple belief: everyone deserves access to
                                pure, powerful nutrition from nature. We partner directly with
                                certified organic farms in South India, where Moringa trees have
                                thrived for centuries.
                            </p>
                            <p>
                                Every batch of Moringa Pure is carefully harvested at peak nutrition,
                                gently dried to preserve potency, and tested by third-party labs.
                                From farm to table, we ensure the highest quality standards.
                            </p>
                        </div>

                        {/* Journey Steps — 3D staggered entrance */}
                        <div className="grid grid-cols-2 gap-3 md:gap-6 mt-8 md:mt-10" suppressHydrationWarning>
                            {[
                                { step: '01', title: 'Harvest', desc: 'Hand-picked daily', gradient: 'from-emerald-500/10 to-emerald-500/5' },
                                { step: '02', title: 'Process', desc: 'Gently air-dried', gradient: 'from-amber-500/10 to-amber-500/5' },
                                { step: '03', title: 'Test', desc: 'Lab verified', gradient: 'from-violet-500/10 to-violet-500/5' },
                                { step: '04', title: 'Pack', desc: 'Eco-sealed', gradient: 'from-teal-500/10 to-teal-500/5' },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, y: 30, rotateX: 15 }}
                                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + index * 0.12, type: 'spring', stiffness: 100 }}
                                    whileHover={{ y: -4, scale: 1.03 }}
                                    className={`flex gap-3 md:gap-4 p-4 md:p-0 rounded-2xl md:rounded-none bg-gradient-to-br ${item.gradient} md:bg-none border border-[var(--color-secondary)]/50 md:border-none cursor-default transition-all`}
                                    suppressHydrationWarning
                                >
                                    <span className="font-heading text-xl md:text-3xl font-bold text-[var(--color-accent)] opacity-60">
                                        {item.step}
                                    </span>
                                    <div>
                                        <p className="font-bold text-sm md:text-base text-[var(--color-text)] mb-0.5">{item.title}</p>
                                        <p className="text-xs md:text-sm text-[var(--color-text-light)]">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA with 3D press */}
                        <div className="mt-8 md:mt-10" suppressHydrationWarning>
                            <Link href="/about">
                                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                                    <Button variant="primary" size="lg" icon={<ArrowRight size={20} />} iconPosition="right" className="w-full sm:w-auto rounded-2xl h-14 glow-cta">
                                        Read Our Full Story
                                    </Button>
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
