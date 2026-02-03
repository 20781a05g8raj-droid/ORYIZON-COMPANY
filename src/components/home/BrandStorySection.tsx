'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

import { Marquee } from '@/components/ui/animations/Marquee';

export function BrandStorySection() {
    return (
        <section style={{ padding: '0 0 5rem 0', backgroundColor: 'white', overflow: 'hidden' }} suppressHydrationWarning>
            {/* Marquee Strip */}
            <div className="py-8 bg-[var(--color-cream)] mb-20 border-y border-[var(--color-secondary)]/20">
                <Marquee speed={40}>
                    {["100% Organic", "•", "Lab Tested", "•", "Sustainably Sourced", "•", "Vegan", "•", "Non-GMO", "•", "Premium Quality", "•", "Ethically Grown", "•"].map((text, i) => (
                        <span key={i} className={`text-2xl font-light ${text === "•" ? "text-amber-400" : "text-emerald-900"}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                            {text}
                        </span>
                    ))}
                </Marquee>
            </div>

            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }} suppressHydrationWarning>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }} suppressHydrationWarning>
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{ position: 'relative' }}
                    >
                        <div style={{
                            position: 'relative',
                            aspectRatio: '4/3',
                            borderRadius: '1.5rem',
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #4A7C23, #2D5016)'
                        }} suppressHydrationWarning>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div
                                    className="text-9xl animate-pulse-soft"
                                    style={{ fontSize: '8rem' }}
                                >
                                    🌳
                                </div>
                            </div>

                            {/* Overlay Text */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                                padding: '2rem'
                            }} suppressHydrationWarning>
                                <p style={{ color: 'white', fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', fontWeight: 600 }} suppressHydrationWarning>
                                    From Our Farm to Your Table
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }} suppressHydrationWarning>
                                    Organic farms in South India
                                </p>
                            </div>
                        </div>

                        {/* Floating Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            style={{
                                position: 'absolute',
                                bottom: '-1.5rem',
                                right: '-1.5rem',
                                backgroundColor: 'white',
                                borderRadius: '1rem',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                padding: '1.5rem',
                                maxWidth: '20rem'
                            }}
                            suppressHydrationWarning
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} suppressHydrationWarning>
                                <div style={{
                                    width: '3.5rem',
                                    height: '3.5rem',
                                    backgroundColor: '#C4A35A',
                                    borderRadius: '9999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem'
                                }}>
                                    🌿
                                </div>
                                <div>
                                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }} suppressHydrationWarning>100% Organic</p>
                                    <p style={{ fontSize: '0.875rem', color: '#666666' }} suppressHydrationWarning>
                                        No chemicals or pesticides
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span style={{ color: '#C4A35A', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>
                            Our Story
                        </span>

                        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginTop: '0.5rem', marginBottom: '1.5rem', color: '#2C2C2C' }} suppressHydrationWarning>
                            Bringing Nature&apos;s Best{' '}
                            <span style={{ color: '#2D5016' }}>To You</span>
                        </h2>

                        <div style={{ color: '#666666', fontSize: '1.125rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '1rem' }} suppressHydrationWarning>
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

                        {/* Journey Steps */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '2rem' }} suppressHydrationWarning>
                            {[
                                { step: '01', title: 'Harvest', desc: 'Hand-picked at peak nutrition' },
                                { step: '02', title: 'Process', desc: 'Gently dried & powdered' },
                                { step: '03', title: 'Test', desc: 'Third-party lab verified' },
                                { step: '04', title: 'Pack', desc: 'Sealed for freshness' },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    style={{ display: 'flex', gap: '0.75rem' }}
                                    suppressHydrationWarning
                                >
                                    <span style={{ color: '#C4A35A', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.5rem' }}>
                                        {item.step}
                                    </span>
                                    <div>
                                        <p style={{ fontWeight: 600 }}>{item.title}</p>
                                        <p style={{ fontSize: '0.875rem', color: '#666666' }}>{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div style={{ marginTop: '2rem' }} suppressHydrationWarning>
                            <Link href="/about">
                                <Button variant="primary" size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
                                    Read Our Full Story
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
