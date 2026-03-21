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

/**
 * Fade + Upward Reveal (Industry Standard)
 * Clean, calm, high-end feel for Headlines and Sub-headlines.
 * 
 * - Text starts slightly below (10-30px)
 * - Opacity 0 -> 100
 * - Duration: 0.8s - 1.2s
 * - Easing: 'power3.out' (~cubic-bezier(0.22,1,0.36,1))
 */
export function useTextReveal<T extends HTMLElement = HTMLHeadingElement>(
    options: Omit<ScrollRevealOptions, 'scale'> = {}
) {
    return useScrollReveal<T>({
        scale: 1,      // No scale for pure text reveal
        y: 20,         // Slightly below (10-30px)
        opacity: 0,    // Opacity: 0 -> 100
        duration: 1,   // Duration: 0.8s - 1.2s
        ease: 'power3.out', // Industry standard Apple-like ease
        ...options,
    });
}

/**
 * Text Translate Reveal (Left/Right/Up/Down)
 * Animated sliding text into place from a specified direction.
 */
export function useTextTranslateReveal<T extends HTMLElement = HTMLElement>(
    options: Omit<ScrollRevealOptions, 'scale' | 'y'> & {
        direction?: 'left' | 'right' | 'up' | 'down';
        distance?: number;
    } = {}
) {
    const { direction = 'left', distance = 40, ...rest } = options;
    
    // Determine translation offset based on direction
    const x = direction === 'left' ? -distance : direction === 'right' ? distance : 0;
    const y = direction === 'up' ? distance : direction === 'down' ? -distance : 0;

    const ref = useRef<T>(null);
    const { opacity = 0, duration = 1, delay = 0, ease = 'power3.out', start = 'top 85%', stagger = 0 } = rest;
    
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Apply initial state
        gsap.set(element, { x, y, opacity, willChange: 'transform, opacity' });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: element,
                start,
                toggleActions: 'play none none reverse',
            },
        });

        tl.to(element, {
            x: 0,
            y: 0,
            opacity: 1,
            duration,
            delay,
            ease,
            stagger: stagger > 0 ? { each: stagger, from: 'start' } : 0,
        });

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === element) st.kill();
            });
        };
    }, [x, y, opacity, duration, delay, ease, start, stagger]);

    return ref;
}

/**
 * Text Rotate Reveal
 * Adds a 3D perspective rotation as text comes into view.
 */
export function useTextRotateReveal<T extends HTMLElement = HTMLElement>(
    options: Omit<ScrollRevealOptions, 'scale'> = {}
) {
    const ref = useRef<T>(null);
    const { opacity = 0, y = 30, duration = 1, delay = 0, ease = 'back.out(1.4)', start = 'top 85%' } = options;

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        gsap.set(element, { 
            y, 
            opacity, 
            rotationX: 45, 
            transformPerspective: 500,
            transformOrigin: 'top center',
            willChange: 'transform, opacity' 
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: element,
                start,
                toggleActions: 'play none none reverse',
            },
        });

        tl.to(element, {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration,
            delay,
            ease,
        });

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === element) st.kill();
            });
        };
    }, [y, opacity, duration, delay, ease, start]);

    return ref;
}

/**
 * Card Fly-In Stagger
 * Animates cards as if they are flying in from outside the screen into place.
 */
export function useCardFlyInStagger<T extends HTMLElement = HTMLDivElement>(
    options: Omit<ScrollRevealOptions, 'childSelector'> & {
        childSelector?: string;
        distance?: number;
    } = {}
) {
    const ref = useRef<T>(null);
    const { 
        stagger = 0.15, 
        childSelector = ':scope > *', 
        distance = 150, // Fly from 150px below
        duration = 1,
        delay = 0,
        ease = 'back.out(1.2)', 
        ...rest 
    } = options;

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const targets = element.querySelectorAll(childSelector);

        gsap.set(targets, {
            y: distance,
            opacity: 0,
            scale: 0.8,
            rotationX: 20,
            transformPerspective: 1000,
            willChange: 'transform, opacity'
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
        });

        tl.to(targets, {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            duration,
            delay,
            ease,
            stagger: { each: stagger, from: 'start' }
        });

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === element) st.kill();
            });
        };
    }, [stagger, childSelector, distance, duration, delay, ease]);

    return ref;
}
