'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MarqueeProps {
    children: React.ReactNode;
    direction?: 'left' | 'right';
    speed?: number;
    pauseOnHover?: boolean;
    className?: string;
}

export function Marquee({
    children,
    direction = 'left',
    speed = 30,
    pauseOnHover = true,
    className,
}: MarqueeProps) {
    return (
        <div className={cn("w-full overflow-hidden flex select-none gap-10", className)}>
            {/* Wrapper to hold duplicate content for seamless looping */}
            <div
                className={cn(
                    "flex flex-shrink-0 gap-10 min-w-full items-center animate-marquee",
                    pauseOnHover && "animate-marquee-paused"
                )}
            >
                {children}
            </div>
            <div
                className={cn(
                    "flex flex-shrink-0 gap-10 min-w-full items-center animate-marquee",
                    pauseOnHover && "animate-marquee-paused"
                )}
            >
                {children}
            </div>
        </div>
    );
}
