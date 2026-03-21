'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxOptions {
    /** Speed ratio: 0.6x - 0.8x vs 1x (default: 0.7) */
    speed?: number;
    /** Parallax movement direction (default: 'y') */
    direction?: 'y' | 'x';
    /** Start marker for ScrollTrigger (default: "top bottom") */
    start?: string;
    /** End marker for ScrollTrigger (default: "bottom top") */
    end?: string;
}

/**
 * Parallax Layer Shift (Depth Illusion)
 * Background moves slower than foreground for a natural depth and high-end cinematic feel.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(options: ParallaxOptions = {}) {
    const ref = useRef<T>(null);
    const { speed = 0.7, direction = 'y', start = 'top bottom', end = 'bottom top' } = options;

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // The target shift value. If speed is 0.7, it moves 30% slower. 
        // A standard approach is setting a yPercent.
        // For a slower moving background, we often animate from yPercent: -20 to yPercent: 20
        // We'll calculate a generic pixel or percent offset based on speed.
        // A speed of 0.7 means it covers 70% of the distance.
        const yOffset = (1 - speed) * 100;

        gsap.set(element, { [direction]: `${-yOffset}%` });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: element.parentElement || element,
                start,
                end,
                scrub: true, // Smooth scrub for natural movement
            },
        });

        tl.to(element, {
            [direction]: `${yOffset}%`,
            ease: 'none',
        });

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === (element.parentElement || element)) st.kill();
            });
        };
    }, [speed, direction, start, end]);

    return ref;
}
