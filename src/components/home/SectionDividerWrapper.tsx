'use client';

import { SectionDivider } from '@/components/ui/animations/SectionDivider';

interface SectionDividerWrapperProps {
    variant?: 'gradient' | 'glow' | 'dots';
    className?: string;
}

export function SectionDividerWrapper({ variant = 'gradient', className = '' }: SectionDividerWrapperProps) {
    return <SectionDivider variant={variant} className={className} />;
}
