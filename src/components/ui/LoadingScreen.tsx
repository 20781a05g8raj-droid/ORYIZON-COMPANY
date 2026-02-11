'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Check if loading already shown in this session
        if (typeof window !== 'undefined' && sessionStorage.getItem('oryizon-loaded')) {
            setIsLoading(false);
            return;
        }

        // Animate progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        // Remove loader after animation
        const timeout = setTimeout(() => {
            setIsLoading(false);
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('oryizon-loaded', 'true');
            }
        }, 2200);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #1A3009 0%, #2D5016 40%, #4A7C23 70%, #1A3009 100%)',
                        backgroundSize: '400% 400%',
                        animation: 'gradientShift 3s ease infinite',
                    }}
                >
                    {/* Background glow orbs */}
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                        {/* Logo with 3D pulse */}
                        <motion.div
                            initial={{ scale: 0.5, rotateY: -90 }}
                            animate={{ scale: 1, rotateY: 0 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                            className="relative w-48 h-14 md:w-64 md:h-20 mb-8"
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

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="text-white/60 text-sm md:text-base font-medium tracking-widest uppercase mb-10"
                        >
                            Modern Wellness, Purely Delivered
                        </motion.p>

                        {/* Progress bar */}
                        <div className="w-48 md:w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] via-white to-[var(--color-accent)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>

                        {/* Floating leaves around logo */}
                        <motion.span
                            animate={{
                                y: [0, -15, 0],
                                rotate: [0, 10, 0],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -top-8 -left-8 text-3xl"
                        >
                            🍃
                        </motion.span>
                        <motion.span
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, -15, 0],
                                opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                            className="absolute -top-4 right-0 text-2xl"
                        >
                            🌿
                        </motion.span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
