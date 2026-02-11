'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedCounterProps {
    value: string; // e.g. "10,000+", "4.8/5", "98%"
    className?: string;
    duration?: number;
}

export function AnimatedCounter({ value, className, duration = 2 }: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
        if (!isInView) return;

        // Parse the numeric part from the value
        const numericMatch = value.match(/[\d,.]+/);
        if (!numericMatch) {
            setDisplayValue(value);
            return;
        }

        const numericStr = numericMatch[0];
        const prefix = value.substring(0, value.indexOf(numericStr));
        const suffix = value.substring(value.indexOf(numericStr) + numericStr.length);
        const hasCommas = numericStr.includes(',');
        const hasDecimal = numericStr.includes('.');
        const cleanNum = parseFloat(numericStr.replace(/,/g, ''));

        const startTime = performance.now();
        const durationMs = duration * 1000;

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / durationMs, 1);

            // Easing: ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = cleanNum * eased;

            let formatted: string;
            if (hasDecimal) {
                formatted = current.toFixed(1);
            } else {
                const rounded = Math.floor(current);
                if (hasCommas) {
                    formatted = rounded.toLocaleString('en-IN');
                } else {
                    formatted = rounded.toString();
                }
            }

            setDisplayValue(`${prefix}${formatted}${suffix}`);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(value); // Ensure final value is exact
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, value, duration]);

    return (
        <motion.span
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className={className}
        >
            {displayValue}
        </motion.span>
    );
}
