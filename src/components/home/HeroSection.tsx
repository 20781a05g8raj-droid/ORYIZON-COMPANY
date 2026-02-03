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
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1A3009 0%, #2D5016 50%, #4A7C23 100%)' }}
        >
            {/* Animated Background Elements - Using CSS Animations for better performance */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                {floatingLeaves.map((leaf, i) => (
                    <div
                        key={i}
                        className="leaf text-3xl md:text-6xl absolute"
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
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }}
                suppressHydrationWarning
            />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center" suppressHydrationWarning>
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', color: 'rgba(255,255,255,0.9)' }}
                    suppressHydrationWarning
                >
                    <Sparkles size={16} style={{ color: '#C4A35A' }} />
                    <span>100% Certified Organic Moringa</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    suppressHydrationWarning
                >
                    Pure. Organic.{' '}
                    <span style={{ color: '#C4A35A' }}>Powerful.</span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl max-w-2xl mx-auto mb-8"
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                    suppressHydrationWarning
                >
                    Experience nature&apos;s most powerful superfood. Our premium Moringa powder
                    delivers 90+ nutrients for energy, immunity, and total wellness.
                </motion.p>

                {/* Key Benefits */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-6 mb-10"
                    suppressHydrationWarning
                >
                    {[
                        { icon: <Leaf size={20} />, text: '7x More Vitamin C' },
                        { icon: <Shield size={20} />, text: '4x More Calcium' },
                        { icon: <Sparkles size={20} />, text: '25% Protein' },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2"
                            style={{ color: 'rgba(255,255,255,0.9)' }}
                            suppressHydrationWarning
                        >
                            <span style={{ color: '#C4A35A' }}>{item.icon}</span>
                            <span>{item.text}</span>
                        </div>
                    ))}
                </motion.div>



                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    suppressHydrationWarning
                >
                    <Link href="/products">
                        <BeamBorder className="rounded-lg p-[1px]">
                            <Button variant="accent" size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
                                Shop Now
                            </Button>
                        </BeamBorder>
                    </Link>
                    <Link href="/about">
                        <button
                            className="px-8 py-3 rounded-full font-medium transition-all"
                            style={{
                                border: '2px solid white',
                                color: 'white',
                                backgroundColor: 'transparent'
                            }}
                        >
                            Learn More
                        </button>
                    </Link>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-16 flex flex-wrap justify-center items-center gap-6"
                    suppressHydrationWarning
                >
                    {CERTIFICATIONS.slice(0, 4).map((cert) => (
                        <motion.div
                            key={cert.id}
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg"
                            style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}
                            suppressHydrationWarning
                        >
                            <span className="text-xl">{cert.icon}</span>
                            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>{cert.name}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2"
                style={{ transform: 'translateX(-50%)' }}
                suppressHydrationWarning
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-10 rounded-full flex items-start justify-center p-2"
                    style={{ border: '2px solid rgba(255,255,255,0.3)' }}
                    suppressHydrationWarning
                >
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: 'white' }}
                        suppressHydrationWarning
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
