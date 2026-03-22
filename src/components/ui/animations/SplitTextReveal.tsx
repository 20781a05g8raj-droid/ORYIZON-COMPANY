'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface SplitTextRevealProps {
    children: string;
    /** 'char' = letter-by-letter, 'word' = word-by-word, 'line' = slide up per line */
    mode?: 'char' | 'word' | 'line';
    /** Additional class names for the container */
    className?: string;
    /** Tag to render (default: 'span') */
    as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div';
    /** Duration per unit in seconds (default: 0.6) */
    duration?: number;
    /** Stagger delay between units (default: 0.03 for char, 0.08 for word, 0.15 for line) */
    stagger?: number;
    /** GSAP easing (default: 'power3.out') */
    ease?: string;
    /** Y offset in pixels (default: 40) */
    yOffset?: number;
    /** Delay before animation starts (default: 0) */
    delay?: number;
    /** ScrollTrigger start position (default: 'top 85%') */
    start?: string;
    /** Whether to add rotation effect (default: false) */
    rotate?: boolean;
}

export function SplitTextReveal({
    children,
    mode = 'char',
    className = '',
    as: Tag = 'span',
    duration = 0.6,
    stagger,
    ease = 'power3.out',
    yOffset = 40,
    delay = 0,
    start = 'top 85%',
    rotate = false,
}: SplitTextRevealProps) {
    const containerRef = useRef<HTMLElement>(null);

    // Calculate default stagger based on mode
    const defaultStagger = mode === 'char' ? 0.03 : mode === 'word' ? 0.08 : 0.15;
    const effectiveStagger = stagger ?? defaultStagger;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const spans = container.querySelectorAll('.split-unit');
        if (spans.length === 0) return;

        // Set initial state
        gsap.set(spans, {
            y: yOffset,
            opacity: 0,
            rotationX: rotate ? 45 : 0,
            transformPerspective: rotate ? 500 : undefined,
            willChange: 'transform, opacity',
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start,
                toggleActions: 'play none none reverse',
            },
        });

        tl.to(spans, {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration,
            delay,
            ease,
            stagger: { each: effectiveStagger, from: 'start' },
        });

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === container) st.kill();
            });
        };
    }, [children, duration, effectiveStagger, ease, yOffset, delay, start, rotate]);

    // Split text into units
    const renderUnits = () => {
        if (mode === 'char') {
            return children.split(' ').map((word, wordIndex, arr) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap">
                    {word.split('').map((char, charIndex) => (
                        <span key={charIndex} className="split-unit inline-block">
                            {char}
                        </span>
                    ))}
                    {wordIndex < arr.length - 1 && (
                        <span className="inline-block">&nbsp;</span>
                    )}
                </span>
            ));
        }
        if (mode === 'word') {
            return children.split(' ').map((word, i, arr) => (
                <span key={i} className="inline-block overflow-hidden">
                    <span className="split-unit inline-block">
                        {word}
                        {i < arr.length - 1 ? '\u00A0' : ''}
                    </span>
                </span>
            ));
        }
        // line mode — treat each line as separated by \n
        const lines = children.split('\n');
        return lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
                <span className="split-unit block">{line}</span>
            </span>
        ));
    };

    return (
        <Tag
            ref={containerRef as React.Ref<any>}
            className={`inline-block ${className}`}
            suppressHydrationWarning
        >
            {renderUnits()}
        </Tag>
    );
}
