'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingParticle {
    id: number;
    emoji: string;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    depth: number; // 0-1, controls translateZ
}

interface FloatingElementsProps {
    count?: number;
    emojis?: string[];
    className?: string;
    variant?: 'light' | 'dark';
}

export function FloatingElements({
    count = 12,
    emojis = ['🍃', '✨', '🌿', '💫'],
    className = '',
    variant = 'dark',
}: FloatingElementsProps) {
    // Pre-generate particles with deterministic positions to avoid hydration mismatch
    const particles: FloatingParticle[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: emojis[i % emojis.length],
        x: ((i * 37 + 13) % 100), // deterministic pseudo-random
        y: ((i * 53 + 7) % 100),
        size: 14 + (i % 4) * 6,
        duration: 8 + (i % 5) * 3,
        delay: (i % 7) * 0.8,
        depth: 0.2 + (i % 3) * 0.3,
    }));

    const opacityBase = variant === 'dark' ? 0.15 : 0.2;

    return (
        <div
            className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
            style={{ perspective: '800px' }}
        >
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{
                        opacity: 0,
                        x: 0,
                        y: 0,
                    }}
                    animate={{
                        opacity: [0, opacityBase + p.depth * 0.1, 0],
                        y: [0, -60 - p.depth * 40, -120 - p.depth * 60],
                        x: [0, (p.id % 2 === 0 ? 1 : -1) * 20 * p.depth, 0],
                        rotateZ: [0, 180 + p.id * 30, 360],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: 'easeInOut',
                    }}
                    className="absolute"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        fontSize: `${p.size}px`,
                        transform: `translateZ(${p.depth * 60}px)`,
                        willChange: 'transform, opacity',
                    }}
                    suppressHydrationWarning
                >
                    {p.emoji}
                </motion.div>
            ))}
        </div>
    );
}
