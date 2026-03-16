'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin once
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealOptions {
    /** Initial scale value (default: 0.88) */
    scale?: number;
    /** Initial opacity (default: 0.0) */
    opacity?: number;
    /** Y offset in pixels (default: 0, set >0 for slight rise) */
    y?: number;
    /** Animation duration in seconds (default: 0.8) */
    duration?: number;
    /** Stagger delay between children (default: 0, set >0 to stagger child elements) */
    stagger?: number;
    /** CSS selector to target children for stagger (default: targets the element itself) */
    childSelector?: string;
    /** When the animation triggers: "top bottom" means when the top of the element hits the bottom of viewport.
     *  "top 80%" means when the top of element reaches 80% from top of viewport (default: "top 80%") */
    start?: string;
    /** When the animation ends for scrub/toggleActions (default: "bottom 20%") */
    end?: string;
    /** Delay before animation starts in seconds (default: 0) */
    delay?: number;
    /** GSAP easing function (default: "power2.out") */
    ease?: string;
    /** Whether animation should reverse on scroll back (default: true) */
    reverse?: boolean;
}

/**
 * A premium scroll-triggered reveal hook using GSAP ScrollTrigger.
 * Elements start slightly scaled down and transparent, then smoothly 
 * scale up and fade in when entering the viewport. Reverses on scroll back.
 * 
 * Uses hardware-accelerated transforms (scale + opacity) for 60fps performance.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
    options: ScrollRevealOptions = {}
) {
    const ref = useRef<T>(null);

    const {
        scale = 0.88,
        opacity = 0,
        y = 30,
        duration = 0.8,
        stagger = 0,
        childSelector,
        start = 'top 90%',
        end = 'bottom 20%',
        delay = 0,
        ease = 'power2.out',
        reverse = true,
    } = options;

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Determine targets: either children (for stagger) or the element itself
        const targets = childSelector
            ? element.querySelectorAll(childSelector)
            : element;

        // Set initial state
        gsap.set(targets, {
            scale,
            opacity,
            y,
            willChange: 'transform, opacity',
        });

        // Create the scroll-triggered animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: element,
                start,
                end,
                toggleActions: reverse
                    ? 'play none none reverse'  // play on enter, stay on leave, reverse only on scroll-back-up
                    : 'play none none none',    // play once, no reverse
                // markers: false, // useful for debugging
            },
        });

        tl.to(targets, {
            scale: 1,
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease,
            stagger: stagger > 0 ? { each: stagger, from: 'start' } : 0,
        });

        // Cleanup
        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === element) st.kill();
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ref;
}

/**
 * Stagger variant — animates direct children of the container
 * Perfect for grids of cards, lists, etc.
 */
export function useScrollRevealStagger<T extends HTMLElement = HTMLDivElement>(
    options: Omit<ScrollRevealOptions, 'childSelector'> & {
        childSelector?: string;
    } = {}
) {
    return useScrollReveal<T>({
        stagger: 0.1,
        childSelector: ':scope > *',
        ...options,
    });
}
