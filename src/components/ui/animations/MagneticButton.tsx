import React, { useRef, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    strength?: number;
    className?: string;
}

export function MagneticButton({
    children,
    strength = 30,
    className,
    ...props
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        // Calculate magnetic pull based on strength
        // Normalize coordinates (-0.5 to 0.5) and multiply by strength
        const newX = (x / width) * strength;
        const newY = (y / height) * strength;

        setPosition({ x: newX, y: newY });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
            className={cn('inline-block', className)}
            {...props}
        >
            {children}
        </motion.div>
    );
}
