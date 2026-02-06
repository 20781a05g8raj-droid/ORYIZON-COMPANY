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
        <section className="py-16 md:py-24 bg-[var(--color-secondary)]/30 overflow-hidden" suppressHydrationWarning>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-20"
                    suppressHydrationWarning
                >
                    <span className="text-[var(--color-accent)] font-semibold uppercase tracking-widest text-xs md:text-sm">
                        Customer Love
                    </span>
                    <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4 text-[var(--color-text)] leading-tight">
                        What Our Customers{' '}
                        <span className="text-[var(--color-primary)]">Say</span>
                    </h2>
                    <p className="text-[var(--color-text-light)] max-w-2xl mx-auto text-base md:text-lg">
                        Join thousands of satisfied customers who have transformed their health
                        with Moringa Pure.
                    </p>
                </motion.div>

                {/* Testimonial Carousel */}
                <div className="relative max-w-4xl mx-auto min-h-[400px]" suppressHydrationWarning>
                    {/* Quote Icon */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center z-10 shadow-xl shadow-primary/20" suppressHydrationWarning>
                        <Quote size={32} />
                    </div>

                    {/* Main Testimonial */}
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-primary/5 p-8 md:p-12 pt-16 md:pt-20 overflow-hidden relative" suppressHydrationWarning>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="text-center"
                                suppressHydrationWarning
                            >
                                {/* Rating */}
                                <div className="flex justify-center gap-1 mb-6 text-[var(--color-accent)]" suppressHydrationWarning>
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            className="md:w-6 md:h-6"
                                            fill={i < currentTestimonial.rating ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="font-heading text-xl sm:text-2xl md:text-3xl font-medium text-[var(--color-text)] mb-8 md:mb-12 italic leading-relaxed">
                                    &ldquo;{currentTestimonial.comment}&rdquo;
                                </p>

                                {/* Author */}
                                <div className="flex flex-col items-center" suppressHydrationWarning>
                                    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-[var(--color-cream)] rounded-full mb-4 overflow-hidden shadow-lg border-2 border-white" suppressHydrationWarning>
                                        {currentTestimonial.image ? (
                                            <Image
                                                src={currentTestimonial.image}
                                                alt={currentTestimonial.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[var(--color-primary)]">
                                                {currentTestimonial.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-heading text-lg md:text-xl font-bold text-[var(--color-text)]">
                                        {currentTestimonial.name}
                                    </p>
                                    <p className="text-[var(--color-text-light)] text-sm md:text-base">
                                        {currentTestimonial.location}
                                    </p>
                                    {currentTestimonial.verified && (
                                        <div className="flex items-center gap-1.5 mt-2 text-emerald-600 text-xs font-semibold px-3 py-1 bg-emerald-50 rounded-full">
                                            <span className="w-3.5 h-3.5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[8px]">✓</span>
                                            <span>Verified Purchase</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-6 mt-8 md:mt-12" suppressHydrationWarning>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={prevTestimonial}
                            className="w-12 h-12 rounded-full bg-white text-[var(--color-text)] shadow-lg flex items-center justify-center transition-all hover:bg-[var(--color-primary)] hover:text-white"
                        >
                            <ChevronLeft size={24} />
                        </motion.button>

                        {/* Dots */}
                        <div className="flex gap-2" suppressHydrationWarning>
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-[var(--color-primary)]' : 'w-2 bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/40'}`}
                                />
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={nextTestimonial}
                            className="w-12 h-12 rounded-full bg-white text-[var(--color-text)] shadow-lg flex items-center justify-center transition-all hover:bg-[var(--color-primary)] hover:text-white"
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
                    className="mt-16 md:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
                    suppressHydrationWarning
                >
                    {[
                        { value: '10,000+', label: 'Happy Customers' },
                        { value: '4.8/5', label: 'Average Rating' },
                        { value: '98%', label: 'Would Recommend' },
                        { value: '1,200+', label: 'Reviews' },
                    ].map((stat, index) => (
                        <div key={index} className="text-center" suppressHydrationWarning>
                            <div className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-primary)] mb-2">
                                {stat.value}
                            </div>
                            <p className="text-[var(--color-text-light)] text-sm font-medium">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
