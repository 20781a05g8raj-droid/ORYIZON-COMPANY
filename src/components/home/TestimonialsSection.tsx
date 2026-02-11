'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, Quote, Loader2 } from 'lucide-react';
import { getFeaturedTestimonials } from '@/lib/api/testimonials';
import { Testimonial } from '@/types/database';
import { AnimatedCounter } from '@/components/ui/animations/AnimatedCounter';
import { TiltCard } from '@/components/ui/animations/TiltCard';

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
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" suppressHydrationWarning>
                {/* Section Header with 3D entrance */}
                <motion.div
                    initial={{ opacity: 0, y: 30, rotateX: 10 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-20 perspective-container"
                    suppressHydrationWarning
                >
                    <span className="text-[var(--color-accent)] font-semibold uppercase tracking-widest text-xs md:text-sm">
                        Customer Love
                    </span>
                    <h2 className="font-heading text-[1.7rem] leading-tight sm:text-4xl md:text-5xl font-bold mt-2 mb-4 text-[var(--color-text)]">
                        What Our Customers{' '}
                        <span className="text-[var(--color-primary)]">Say</span>
                    </h2>
                    <p className="text-[var(--color-text-light)] max-w-2xl mx-auto text-[15px] md:text-lg leading-relaxed">
                        Join thousands of satisfied customers who have transformed their health
                        with Moringa Pure.
                    </p>
                </motion.div>

                {/* Testimonial Carousel with 3D card */}
                <div className="relative max-w-4xl mx-auto min-h-[380px] md:min-h-[400px]" suppressHydrationWarning>
                    {/* Quote Icon */}
                    <motion.div
                        initial={{ scale: 0, rotateY: -180 }}
                        whileInView={{ scale: 1, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white rounded-full flex items-center justify-center z-10 shadow-xl"
                        suppressHydrationWarning
                    >
                        <Quote size={28} />
                    </motion.div>

                    {/* Main Testimonial Card */}
                    <TiltCard tiltStrength={4} scale={1.01} className="rounded-[2rem]">
                        <div className="bg-white rounded-[2rem] shadow-3d p-6 md:p-12 pt-14 md:pt-20 overflow-hidden relative gradient-border-top" suppressHydrationWarning>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, rotateY: 15, x: 40 }}
                                    animate={{ opacity: 1, rotateY: 0, x: 0 }}
                                    exit={{ opacity: 0, rotateY: -15, x: -40 }}
                                    transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                                    className="text-center"
                                    suppressHydrationWarning
                                >
                                    {/* Rating */}
                                    <div className="flex justify-center gap-1 mb-5 md:mb-6 text-[var(--color-accent)]" suppressHydrationWarning>
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ delay: i * 0.08, type: 'spring' }}
                                            >
                                                <Star
                                                    size={18}
                                                    className="md:w-6 md:h-6"
                                                    fill={i < currentTestimonial.rating ? 'currentColor' : 'none'}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Content */}
                                    <p className="font-heading text-lg sm:text-2xl md:text-3xl font-medium text-[var(--color-text)] mb-6 md:mb-12 italic leading-relaxed">
                                        &ldquo;{currentTestimonial.comment}&rdquo;
                                    </p>

                                    {/* Author */}
                                    <div className="flex flex-col items-center" suppressHydrationWarning>
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className="relative w-14 h-14 md:w-20 md:h-20 bg-[var(--color-cream)] rounded-full mb-3 md:mb-4 overflow-hidden shadow-lg border-2 border-white ring-4 ring-[var(--color-primary)]/10"
                                            suppressHydrationWarning
                                        >
                                            {currentTestimonial.image ? (
                                                <Image
                                                    src={currentTestimonial.image}
                                                    alt={currentTestimonial.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xl md:text-2xl font-bold text-[var(--color-primary)] bg-gradient-to-br from-[var(--color-cream)] to-white">
                                                    {currentTestimonial.name.charAt(0)}
                                                </div>
                                            )}
                                        </motion.div>
                                        <p className="font-heading text-base md:text-xl font-bold text-[var(--color-text)]">
                                            {currentTestimonial.name}
                                        </p>
                                        <p className="text-[var(--color-text-light)] text-sm md:text-base">
                                            {currentTestimonial.location}
                                        </p>
                                        {currentTestimonial.verified && (
                                            <div className="flex items-center gap-1.5 mt-2 text-emerald-600 text-xs font-semibold px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                                                <span className="w-3.5 h-3.5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[8px]">✓</span>
                                                <span>Verified Purchase</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </TiltCard>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-5 mt-8 md:mt-12" suppressHydrationWarning>
                        <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevTestimonial}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-[var(--color-text)] shadow-3d flex items-center justify-center transition-all hover:bg-[var(--color-primary)] hover:text-white active:bg-[var(--color-primary)] active:text-white min-w-[48px] min-h-[48px]"
                        >
                            <ChevronLeft size={22} />
                        </motion.button>

                        {/* Dots */}
                        <div className="flex gap-2.5" suppressHydrationWarning>
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2.5 rounded-full transition-all duration-300 min-h-[10px] ${index === currentIndex ? 'w-8 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)]' : 'w-2.5 bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/40'}`}
                                />
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextTestimonial}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-[var(--color-text)] shadow-3d flex items-center justify-center transition-all hover:bg-[var(--color-primary)] hover:text-white active:bg-[var(--color-primary)] active:text-white min-w-[48px] min-h-[48px]"
                        >
                            <ChevronRight size={22} />
                        </motion.button>
                    </div>
                </div>

                {/* Stats with AnimatedCounter */}
                <div className="mt-12 md:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12" suppressHydrationWarning>
                    {[
                        { value: '10,000+', label: 'Happy Customers', gradient: 'from-emerald-500 to-emerald-700' },
                        { value: '4.8/5', label: 'Average Rating', gradient: 'from-amber-500 to-amber-700' },
                        { value: '98%', label: 'Would Recommend', gradient: 'from-violet-500 to-violet-700' },
                        { value: '1,200+', label: 'Reviews', gradient: 'from-teal-500 to-teal-700' },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.12, type: 'spring', stiffness: 100 }}
                        >
                            <TiltCard tiltStrength={12} scale={1.05} className="rounded-2xl">
                                <div className="text-center p-5 md:p-8 rounded-2xl bg-white shadow-3d border border-[var(--color-secondary)]/50" suppressHydrationWarning>
                                    <AnimatedCounter
                                        value={stat.value}
                                        className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-[var(--color-primary)] mb-1 md:mb-2 block"
                                        duration={2.5}
                                    />
                                    <p className="text-[var(--color-text-light)] text-xs md:text-sm font-medium">
                                        {stat.label}
                                    </p>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
