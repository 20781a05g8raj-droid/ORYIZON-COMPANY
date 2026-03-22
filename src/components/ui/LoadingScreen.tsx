'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { gsap } from 'gsap';

export function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const counterRef = useRef<HTMLSpanElement>(null);
    const progressObj = useRef({ value: 0 });

    useEffect(() => {
        // Check if loading already shown in this session
        if (typeof window !== 'undefined' && sessionStorage.getItem('oryizon-loaded')) {
            setIsLoading(false);
            return;
        }

        // GSAP-powered smooth counter animation (Lusion-style)
        const counterTween = gsap.to(progressObj.current, {
            value: 100,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                const val = Math.round(progressObj.current.value);
                setProgress(val);
                if (counterRef.current) {
                    counterRef.current.textContent = String(val);
                }
            },
        });

        // Remove loader after animation
        const timeout = setTimeout(() => {
            setIsLoading(false);
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('oryizon-loaded', 'true');
            }
        }, 2500);

        return () => {
            counterTween.kill();
            clearTimeout(timeout);
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.1,
                        filter: 'blur(20px)',
                    }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #0a1a04 0%, #1A3009 30%, #2D5016 60%, #1A3009 100%)',
                        backgroundSize: '400% 400%',
                        animation: 'gradientShift 3s ease infinite',
                    }}
                >
                    {/* Background glow orbs */}
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

                    {/* Grid Pattern Background (Lusion-style) */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '60px 60px',
                        }}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0.5, rotateY: -90, opacity: 0 }}
                            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                            className="relative w-48 h-14 md:w-64 md:h-20 mb-10"
                            style={{ perspective: '600px' }}
                        >
                            <Image
                                src="/images/oryizon-logo.png"
                                alt="Oryizon"
                                fill
                                className="object-contain brightness-0 invert drop-shadow-2xl"
                                priority
                            />
                        </motion.div>

                        {/* Lusion-style Numerical Counter */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="mb-8"
                        >
                            <span
                                ref={counterRef}
                                className="font-heading text-7xl md:text-9xl font-bold text-white/10 tabular-nums tracking-tighter"
                                style={{
                                    WebkitTextStroke: '1px rgba(255,255,255,0.15)',
                                }}
                            >
                                0
                            </span>
                        </motion.div>

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="text-white/40 text-xs md:text-sm font-medium tracking-[0.3em] uppercase mb-10"
                        >
                            Modern Wellness, Purely Delivered
                        </motion.p>

                        {/* Progress bar */}
                        <div className="w-48 md:w-64 h-[2px] bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] via-white/80 to-[var(--color-accent)]"
                                style={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
