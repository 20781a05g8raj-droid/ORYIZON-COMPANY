'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, Quote, Loader2 } from 'lucide-react';
import { getFeaturedTestimonials } from '@/lib/api/testimonials';
import { Testimonial } from '@/types/database';

export function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const data = await getFeaturedTestimonials();
                setTestimonials(data);
            } catch (error) {
                console.error('Failed to fetch testimonials:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTestimonials();
    }, []);

    const nextTestimonial = () => {
        if (testimonials.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        if (testimonials.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    if (loading) {
        return (
            <section style={{ padding: '5rem 0', backgroundColor: '#FBF9F4' }}>
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
            </section>
        );
    }

    if (testimonials.length === 0) return null;

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section style={{ padding: '5rem 0', backgroundColor: '#FBF9F4' }} suppressHydrationWarning>
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
                        Customer Love
                    </span>
                    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginTop: '0.5rem', marginBottom: '1rem', color: '#2C2C2C' }}>
                        What Our Customers{' '}
                        <span style={{ color: '#2D5016' }}>Say</span>
                    </h2>
                    <p style={{ color: '#666666', maxWidth: '42rem', margin: '0 auto', fontSize: '1.125rem' }}>
                        Join thousands of satisfied customers who have transformed their health
                        with Moringa Pure.
                    </p>
                </motion.div>

                {/* Testimonial Carousel */}
                <div style={{ position: 'relative', maxWidth: '56rem', margin: '0 auto' }} suppressHydrationWarning>
                    {/* Quote Icon */}
                    <div style={{
                        position: 'absolute',
                        top: '-2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4rem',
                        height: '4rem',
                        backgroundColor: '#2D5016',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        color: 'white'
                    }} suppressHydrationWarning>
                        <Quote size={28} />
                    </div>

                    {/* Main Testimonial */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '1.5rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        padding: '3rem 2rem',
                        paddingTop: '3rem',
                        overflow: 'hidden'
                    }} suppressHydrationWarning>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                style={{ textAlign: 'center' }}
                                suppressHydrationWarning
                            >
                                {/* Rating */}
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '1.5rem', color: '#C4A35A' }} suppressHydrationWarning>
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={24}
                                            fill={i < currentTestimonial.rating ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>

                                {/* Content */}
                                <p style={{
                                    fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                                    color: '#2C2C2C',
                                    marginBottom: '2rem',
                                    fontWeight: 500,
                                    fontStyle: 'italic',
                                    lineHeight: 1.6
                                }}>
                                    &ldquo;{currentTestimonial.comment}&rdquo;
                                </p>

                                {/* Author */}
                                <div suppressHydrationWarning>
                                    <div style={{
                                        width: '4rem',
                                        height: '4rem',
                                        backgroundColor: '#F5F1E8',
                                        borderRadius: '9999px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1rem auto',
                                        fontSize: '1.5rem',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }} suppressHydrationWarning>
                                        {currentTestimonial.image ? (
                                            <Image
                                                src={currentTestimonial.image}
                                                alt={currentTestimonial.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            currentTestimonial.name.charAt(0)
                                        )}
                                    </div>
                                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.125rem', fontWeight: 600 }}>
                                        {currentTestimonial.name}
                                    </p>
                                    <p style={{ color: '#666666' }}>
                                        {currentTestimonial.location}
                                    </p>
                                    {currentTestimonial.verified && (
                                        <div className="flex items-center justify-center gap-1 mt-1 text-emerald-600 text-sm">
                                            <span>✓ Verified Purchase</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }} suppressHydrationWarning>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={prevTestimonial}
                            style={{
                                width: '3rem',
                                height: '3rem',
                                borderRadius: '9999px',
                                backgroundColor: 'white',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#2D5016';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.color = 'black';
                            }}
                        >
                            <ChevronLeft size={24} />
                        </motion.button>

                        {/* Dots */}
                        <div style={{ display: 'flex', gap: '0.5rem' }} suppressHydrationWarning>
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    style={{
                                        height: '0.75rem',
                                        borderRadius: '9999px',
                                        transition: 'all 0.3s',
                                        backgroundColor: index === currentIndex ? '#2D5016' : 'rgba(74, 124, 35, 0.3)',
                                        width: index === currentIndex ? '2rem' : '0.75rem',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                />
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={nextTestimonial}
                            style={{
                                width: '3rem',
                                height: '3rem',
                                borderRadius: '9999px',
                                backgroundColor: 'white',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#2D5016';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.color = 'black';
                            }}
                        >
                            <ChevronRight size={24} />
                        </motion.button>
                    </div>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        marginTop: '4rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '2rem'
                    }}
                    suppressHydrationWarning
                >
                    {[
                        { value: '10,000+', label: 'Happy Customers' },
                        { value: '4.8/5', label: 'Average Rating' },
                        { value: '98%', label: 'Would Recommend' },
                        { value: '1,200+', label: 'Reviews' },
                    ].map((stat, index) => (
                        <div key={index} style={{ textAlign: 'center' }} suppressHydrationWarning>
                            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.5rem', fontWeight: 700, color: '#2D5016' }}>
                                {stat.value}
                            </div>
                            <p style={{ color: '#666666', marginTop: '0.25rem' }}>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
