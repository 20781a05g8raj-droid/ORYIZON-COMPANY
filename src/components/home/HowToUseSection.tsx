'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HOW_TO_USE } from '@/lib/constants';

export function HowToUseSection() {
    return (
        <section style={{ padding: '5rem 0', backgroundColor: 'white' }} suppressHydrationWarning>
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }} suppressHydrationWarning>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                    suppressHydrationWarning
                >
                    <span style={{ color: '#C4A35A', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>
                        Simple & Versatile
                    </span>
                    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginTop: '0.5rem', marginBottom: '1rem', color: '#2C2C2C' }}>
                        How to Use{' '}
                        <span style={{ color: '#2D5016' }}>Moringa</span>
                    </h2>
                    <p style={{ color: '#666666', maxWidth: '42rem', margin: '0 auto', fontSize: '1.125rem' }}>
                        Adding Moringa to your daily routine is easy. Here are some simple ways
                        to enjoy its benefits.
                    </p>
                </motion.div>

                {/* Steps */}
                <div style={{ position: 'relative' }} suppressHydrationWarning>
                    {/* Connection Line */}
                    <div className="hidden lg:block" style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(to right, transparent, #4A7C23, transparent)',
                        transform: 'translateY(-50%)',
                        zIndex: 0
                    }} suppressHydrationWarning />

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem',
                        position: 'relative',
                        zIndex: 1
                    }} suppressHydrationWarning>
                        {HOW_TO_USE.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                style={{ position: 'relative' }}
                            >
                                {/* Step Card */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    style={{
                                        backgroundColor: '#FBF9F4',
                                        borderRadius: '1rem',
                                        padding: '2rem',
                                        textAlign: 'center',
                                        position: 'relative',
                                        zIndex: 10,
                                        height: '100%'
                                    }}
                                >
                                    {/* Step Number */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-1rem',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '2rem',
                                        height: '2rem',
                                        backgroundColor: '#2D5016',
                                        color: 'white',
                                        borderRadius: '9999px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '0.875rem'
                                    }} suppressHydrationWarning>
                                        {index + 1}
                                    </div>

                                    {/* Icon */}
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                        style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-block' }}
                                    >
                                        {step.icon}
                                    </motion.div>

                                    {/* Title */}
                                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: '#2C2C2C' }}>
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p style={{ color: '#666666', fontSize: '0.875rem' }}>
                                        {step.description}
                                    </p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Dosage Info */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        marginTop: '4rem',
                        background: 'linear-gradient(to right, #2D5016, #4A7C23)',
                        borderRadius: '1rem',
                        padding: '2rem',
                        color: 'white'
                    }}
                    suppressHydrationWarning
                >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }} suppressHydrationWarning>
                        <div>
                            <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Adults</h4>
                            <p style={{ color: 'rgba(255,255,255,0.8)' }}>5-10g (1-2 teaspoons) daily</p>
                        </div>
                        <div>
                            <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Elders</h4>
                            <p style={{ color: 'rgba(255,255,255,0.8)' }}>3-5g (½-1 teaspoon) daily</p>
                        </div>
                        <div>
                            <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Best Time</h4>
                            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Morning with breakfast</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
