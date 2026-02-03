'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { KEY_BENEFITS } from '@/lib/constants';

export function BenefitsSection() {
    return (
        <section style={{ padding: '5rem 0', backgroundColor: 'white' }}>
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                    suppressHydrationWarning
                >
                    <span style={{ color: '#C4A35A', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>
                        Why Choose Moringa
                    </span>
                    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginTop: '0.5rem', marginBottom: '1rem', color: '#2C2C2C' }}>
                        Nature&apos;s Complete{' '}
                        <span style={{ color: '#2D5016' }}>Superfood</span>
                    </h2>
                    <p style={{ color: '#666666', maxWidth: '42rem', margin: '0 auto', fontSize: '1.125rem' }}>
                        Discover the incredible benefits that make Moringa one of the most
                        nutrient-dense plants on Earth.
                    </p>
                </motion.div>

                {/* Benefits Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }} suppressHydrationWarning>
                    {KEY_BENEFITS.map((benefit, index) => (
                        <motion.div
                            key={benefit.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                            style={{
                                padding: '2rem',
                                backgroundColor: '#FBF9F4',
                                borderRadius: '1rem',
                                transition: 'all 0.3s ease'
                            }}
                            suppressHydrationWarning
                        >
                            {/* Icon */}
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                style={{
                                    width: '4rem',
                                    height: '4rem',
                                    borderRadius: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.875rem',
                                    marginBottom: '1.25rem',
                                    backgroundColor: `${benefit.color}20`
                                }}
                                suppressHydrationWarning
                            >
                                {benefit.icon}
                            </motion.div>

                            {/* Content */}
                            <h3 style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                marginBottom: '0.75rem',
                                color: '#2C2C2C'
                            }}>
                                {benefit.title}
                            </h3>
                            <p style={{ color: '#666666' }}>
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        marginTop: '5rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '2rem'
                    }}
                    suppressHydrationWarning
                >
                    {[
                        { value: '90+', label: 'Nutrients' },
                        { value: '7x', label: 'More Vitamin C than Oranges' },
                        { value: '4x', label: 'More Calcium than Milk' },
                        { value: '25%', label: 'Plant-Based Protein' },
                    ].map((stat, index) => (
                        <div key={index} style={{ textAlign: 'center' }} suppressHydrationWarning>
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, type: 'spring' }}
                                style={{
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                                    fontWeight: 700,
                                    color: '#2D5016'
                                }}
                            >
                                {stat.value}
                            </motion.div>
                            <p style={{ color: '#666666', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
