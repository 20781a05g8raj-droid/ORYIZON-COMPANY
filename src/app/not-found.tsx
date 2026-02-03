'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
    // Generate random positions for floating leaves
    const leaves = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 10,
        rotation: Math.random() * 360,
    }));

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FBF9F4', // Warm off-white
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'var(--font-body)',
        }}>
            {/* Ambient Background Elements */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} suppressHydrationWarning>
                {leaves.map((leaf) => (
                    <motion.div
                        key={leaf.id}
                        initial={{ opacity: 0, y: 100, rotate: leaf.rotation }}
                        animate={{
                            opacity: [0, 0.4, 0],
                            y: [-100, -300],
                            rotate: [leaf.rotation, leaf.rotation + 360],
                            x: [0, Math.random() * 50 - 25]
                        }}
                        transition={{
                            duration: leaf.duration,
                            repeat: Infinity,
                            delay: leaf.delay,
                            ease: "linear"
                        }}
                        style={{
                            position: 'absolute',
                            left: `${leaf.left}%`,
                            top: `${leaf.top}%`,
                            fontSize: `${2 + Math.random()}rem`,
                            color: '#4A7C23', // Brand green
                            pointerEvents: 'none'
                        }}
                        suppressHydrationWarning
                    >
                        🍃
                    </motion.div>
                ))}
            </div>

            <div style={{
                position: 'relative',
                zIndex: 10,
                textAlign: 'center',
                maxWidth: '40rem',
                padding: '0 1rem',
            }}>
                {/* 404 Text Animation */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        duration: 0.8
                    }}
                >
                    <h1 style={{
                        fontSize: 'clamp(8rem, 20vw, 12rem)',
                        fontWeight: 900,
                        lineHeight: 1,
                        background: 'linear-gradient(135deg, #2D5016 0%, #4A7C23 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontFamily: "'Playfair Display', serif",
                        marginBottom: '1rem',
                        position: 'relative',
                        display: 'inline-block'
                    }}>
                        404
                    </h1>
                </motion.div>

                {/* Message Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: '#2D5016',
                        marginBottom: '1rem',
                        fontFamily: "'Playfair Display', serif",
                    }}>
                        Oops! Looks like you're lost.
                    </h2>
                    <p style={{
                        fontSize: '1.125rem',
                        color: '#666666',
                        marginBottom: '2.5rem',
                        maxWidth: '30rem',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>
                        The page you are looking for has drifted away like a leaf in the wind.
                        Let's get you back to our garden.
                    </p>
                </motion.div>

                {/* Buttons Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        justifyContent: 'center'
                    }}
                >
                    <Link href="/">
                        <Button variant="primary" size="lg" icon={<Home size={20} />}>
                            Return Home
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="lg"
                        icon={<ArrowLeft size={20} />}
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
