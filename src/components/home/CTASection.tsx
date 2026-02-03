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
        <section style={{
            padding: '5rem 0',
            background: 'linear-gradient(135deg, #2D5016 0%, #1A3009 100%)',
            position: 'relative',
            overflow: 'hidden'
        }} suppressHydrationWarning>
            {/* Background Elements - Using fixed positions */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} suppressHydrationWarning>
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
                        style={{
                            position: 'absolute',
                            fontSize: '2.25rem',
                            left: `${leaf.left}%`,
                            top: `${leaf.top}%`,
                        }}
                        suppressHydrationWarning
                    >
                        🍃
                    </motion.div>
                ))}
            </div>

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '64rem', margin: '0 auto', padding: '0 1rem' }} suppressHydrationWarning>
                <div style={{ textAlign: 'center' }} suppressHydrationWarning>
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(4px)',
                            borderRadius: '9999px',
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '0.875rem',
                            marginBottom: '1.5rem'
                        }}
                        suppressHydrationWarning
                    >
                        <Sparkles size={16} style={{ color: '#C4A35A' }} />
                        <span>Limited Time Offer</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                            fontWeight: 700,
                            color: 'white',
                            marginBottom: '1.5rem'
                        }}
                    >
                        Start Your Wellness Journey{' '}
                        <span style={{ color: '#C4A35A' }}>Today</span>
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        style={{
                            fontSize: '1.25rem',
                            color: 'rgba(255,255,255,0.8)',
                            maxWidth: '42rem',
                            margin: '0 auto 2rem auto',
                            lineHeight: 1.6
                        }}
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
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '1.5rem',
                            marginBottom: '2.5rem'
                        }}
                        suppressHydrationWarning
                    >
                        {[
                            'Free Shipping over ₹499',
                            '30-Day Money Back Guarantee',
                            'Certified Organic',
                        ].map((text, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.9)' }} suppressHydrationWarning>
                                <div style={{
                                    width: '1.25rem',
                                    height: '1.25rem',
                                    backgroundColor: '#C4A35A',
                                    borderRadius: '9999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }} suppressHydrationWarning>
                                    <Check size={12} style={{ color: 'white' }} />
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
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem'
                        }}
                        suppressHydrationWarning
                    >
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }} suppressHydrationWarning>
                            <Link href="/products">
                                <Button variant="accent" size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
                                    Shop Now & Save 17%
                                </Button>
                            </Link>
                            <Link href="/about">
                                <button
                                    style={{
                                        padding: '0.75rem 2rem',
                                        borderRadius: '0.5rem',
                                        color: 'white',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        fontSize: '1.125rem',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    Learn More
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Trust Note */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        style={{ marginTop: '2rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}
                    >
                        Trusted by 10,000+ customers across India 🇮🇳
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
