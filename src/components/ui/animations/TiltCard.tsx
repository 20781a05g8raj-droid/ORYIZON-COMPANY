'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    tiltStrength?: number;
    gloss?: boolean;
    scale?: number;
}

export function TiltCard({
    children,
    className,
    tiltStrength = 10,
    gloss = true,
    scale = 1.02,
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
    const [glossPosition, setGlossPosition] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -tiltStrength;
        const rotateY = ((x - centerX) / centerX) * tiltStrength;

        setTransform({ rotateX, rotateY });
        setGlossPosition({
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100,
        });
    };

    const handleMouseLeave = () => {
        setTransform({ rotateX: 0, rotateY: 0 });
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    // Touch support for mobile
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!ref.current || !e.touches[0]) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -(tiltStrength * 0.5);
        const rotateY = ((x - centerX) / centerX) * (tiltStrength * 0.5);

        setTransform({ rotateX, rotateY });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseLeave}
            animate={{
                rotateX: transform.rotateX,
                rotateY: transform.rotateY,
                scale: isHovered ? scale : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn('relative will-change-transform', className)}
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
        >
            {children}

            {/* Glossy reflection layer */}
            {gloss && isHovered && (
                <div
                    className="pointer-events-none absolute inset-0 rounded-[inherit] z-20 opacity-40 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle at ${glossPosition.x}% ${glossPosition.y}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
                    }}
                />
            )}
        </motion.div>
    );
}
