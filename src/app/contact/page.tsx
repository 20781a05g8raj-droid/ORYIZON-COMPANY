'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { submitContactForm } from '@/lib/api/contacts';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await submitContactForm(formData);
            setIsSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (err) {
            console.error('Contact form error:', err);
            setError('Failed to send message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen pt-24">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" suppressHydrationWarning>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-heading text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        Get In Touch
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg max-w-2xl mx-auto"
                    >
                        Have a question or need help? We&apos;re here for you.
                    </motion.p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                suppressHydrationWarning
                            >
                                <h2 className="font-heading text-2xl font-bold mb-6">Contact Information</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Mail className="text-[var(--color-primary)]" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Email Us</h3>
                                            <a
                                                href={`mailto:${SITE_CONFIG.email}`}
                                                className="text-[var(--color-text-light)] hover:text-[var(--color-primary)]"
                                            >
                                                {SITE_CONFIG.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Phone className="text-[var(--color-primary)]" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Call Us</h3>
                                            <a
                                                href={`tel:${SITE_CONFIG.phone}`}
                                                className="text-[var(--color-text-light)] hover:text-[var(--color-primary)]"
                                            >
                                                {SITE_CONFIG.phone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-xl flex items-center justify-center flex-shrink-0">
                                            <MessageCircle className="text-[var(--color-primary)]" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">WhatsApp</h3>
                                            <a
                                                href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[var(--color-text-light)] hover:text-[var(--color-primary)]"
                                            >
                                                Chat with us
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-xl flex items-center justify-center flex-shrink-0">
                                            <MapPin className="text-[var(--color-primary)]" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Visit Us</h3>
                                            <p className="text-[var(--color-text-light)]">
                                                {SITE_CONFIG.address}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Clock className="text-[var(--color-primary)]" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Business Hours</h3>
                                            <p className="text-[var(--color-text-light)]">
                                                Mon - Sat: 9:00 AM - 6:00 PM<br />
                                                Sunday: Closed
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Map */}
                                <div className="mt-8 rounded-xl overflow-hidden h-48 bg-[var(--color-cream)]">
                                    <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                                        <div className="text-center">
                                            <MapPin size={32} className="mx-auto mb-2" />
                                            <p className="text-sm">Map would be embedded here</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-[var(--color-cream)] rounded-2xl p-8"
                                suppressHydrationWarning
                            >
                                <h2 className="font-heading text-2xl font-bold mb-6">Send Us a Message</h2>

                                {isSubmitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <span className="text-6xl block mb-4">✅</span>
                                        <h3 className="font-heading text-2xl font-semibold mb-2">Message Sent!</h3>
                                        <p className="text-[var(--color-text-light)] mb-6">
                                            Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsSubmitted(false)}
                                        >
                                            Send Another Message
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {error && (
                                            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                                                {error}
                                            </div>
                                        )}

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block font-medium mb-2">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-secondary)] bg-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                                    placeholder="Your name"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block font-medium mb-2">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-secondary)] bg-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="phone" className="block font-medium mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-secondary)] bg-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="subject" className="block font-medium mb-2">
                                                    Subject *
                                                </label>
                                                <select
                                                    id="subject"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-secondary)] bg-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                                >
                                                    <option value="">Select a topic</option>
                                                    <option value="order">Order Inquiry</option>
                                                    <option value="product">Product Question</option>
                                                    <option value="shipping">Shipping & Delivery</option>
                                                    <option value="returns">Returns & Refunds</option>
                                                    <option value="wholesale">Wholesale Inquiry</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block font-medium mb-2">
                                                Message *
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={5}
                                                className="w-full px-4 py-3 rounded-lg border border-[var(--color-secondary)] bg-white focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                                                placeholder="How can we help you?"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            loading={isSubmitting}
                                            icon={<Send size={20} />}
                                        >
                                            {isSubmitting ? 'Sending...' : 'Send Message'}
                                        </Button>
                                    </form>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
