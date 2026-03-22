'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const cursorLabel = useRef<string>('');

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Smooth spring for the outer ring (follows with delay)
    const ringX = useSpring(cursorX, { stiffness: 150, damping: 20, mass: 0.5 });
    const ringY = useSpring(cursorY, { stiffness: 150, damping: 20, mass: 0.5 });

    useEffect(() => {
        // Detect touch device
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsTouchDevice(isTouch);
        if (isTouch) return;

        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        // Track hover on interactive elements
        const handleElementHover = (e: Event) => {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.closest('a') ||
                target.closest('button') ||
                target.closest('[role="button"]') ||
                target.closest('.cursor-hover') ||
                target.closest('input') ||
                target.closest('textarea');

            if (isInteractive) {
                setIsHovering(true);
            }
        };

        const handleElementUnhover = () => {
            setIsHovering(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseover', handleElementHover);
        document.addEventListener('mouseout', handleElementUnhover);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseover', handleElementHover);
            document.removeEventListener('mouseout', handleElementUnhover);
        };
    }, [cursorX, cursorY, isVisible]);

    if (isTouchDevice) return null;

    return (
        <>
            {/* Inner dot — follows exactly */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isHovering ? 0.5 : 1,
                }}
                transition={{ duration: 0.15 }}
            >
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </motion.div>

            {/* Outer ring — follows with spring delay */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isHovering ? 1.8 : 1,
                }}
                transition={{
                    scale: { type: 'spring', stiffness: 300, damping: 20 },
                    opacity: { duration: 0.2 },
                }}
            >
                <div
                    className="w-10 h-10 rounded-full border-[1.5px] border-white/80"
                    style={{
                        transition: 'background-color 0.3s ease',
                        backgroundColor: isHovering ? 'rgba(255,255,255,0.08)' : 'transparent',
                    }}
                />
            </motion.div>
        </>
    );
}
