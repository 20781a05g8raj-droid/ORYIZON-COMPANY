'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface SectionDividerProps {
    /** 'gradient' = primary-to-accent gradient, 'glow' = with glow effect */
    variant?: 'gradient' | 'glow' | 'dots';
    className?: string;
}

export function SectionDivider({ variant = 'gradient', className = '' }: SectionDividerProps) {
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = lineRef.current;
        if (!el) return;

        gsap.set(el, { scaleX: 0, transformOrigin: 'left center' });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
            },
        });

        tl.to(el, {
            scaleX: 1,
            duration: 1.2,
            ease: 'power3.out',
        });

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === el) st.kill();
            });
        };
    }, []);

    if (variant === 'dots') {
        return (
            <div className={`flex justify-center items-center gap-3 py-4 md:py-6 ${className}`}>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] opacity-40"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className={`relative w-full py-2 md:py-4 ${className}`}>
            <div
                ref={lineRef}
                className={`mx-auto h-[1px] max-w-5xl ${
                    variant === 'glow'
                        ? 'bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent shadow-[0_0_20px_rgba(196,163,90,0.3)]'
                        : 'bg-gradient-to-r from-transparent via-[var(--color-primary)]/30 to-transparent'
                }`}
            />
        </div>
    );
}
