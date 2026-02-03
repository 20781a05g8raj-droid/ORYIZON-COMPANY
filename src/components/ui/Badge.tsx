'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'accent' | 'outline';
    size?: 'sm' | 'md';
    icon?: React.ReactNode;
    className?: string;
}

export function Badge({
    children,
    variant = 'default',
    size = 'md',
    icon,
    className = '',
}: BadgeProps) {
    const variants = {
        default: 'bg-[var(--color-secondary)] text-[var(--color-primary)]',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        accent: 'bg-[var(--color-accent)] text-white',
        outline: 'border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </motion.span>
    );
}

interface TrustBadgeProps {
    icon: string;
    label: string;
    description?: string;
}

export function TrustBadge({ icon, label, description }: TrustBadgeProps) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
            <span className="text-2xl">{icon}</span>
            <div>
                <p className="font-semibold text-[var(--color-text)]">{label}</p>
                {description && (
                    <p className="text-xs text-[var(--color-text-light)]">{description}</p>
                )}
            </div>
        </motion.div>
    );
}
