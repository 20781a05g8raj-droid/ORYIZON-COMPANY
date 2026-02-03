'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BeamBorderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    color?: string;
    duration?: number;
    borderWidth?: number;
    className?: string;
}

export function BeamBorder({
    children,
    className,
    color = '#C4A35A', // Gold
    duration = 4,
    borderWidth = 2,
    ...props
}: BeamBorderProps) {
    return (
        <div
            className={cn('relative group overflow-hidden p-[2px] rounded-lg', className)}
            {...props}
        >
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 w-[400%] h-[400%] top-[-150%] left-[-150%] animate-spin-slow"
                    style={{
                        background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 340deg, ${color} 360deg)`,
                    }}
                />
            </div>

            <div className="relative bg-white dark:bg-zinc-900 rounded-[inherit] h-full w-full">
                {children}
            </div>
        </div>
    );
}
