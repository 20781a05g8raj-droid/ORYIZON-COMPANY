'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Send } from 'lucide-react';
import { SITE_CONFIG, FOOTER_LINKS, CERTIFICATIONS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { usePathname } from 'next/navigation';
import { subscribeToNewsletter } from '@/lib/api/newsletter';

export function Footer() {
    const pathname = usePathname();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await subscribeToNewsletter(email);
            setSubscribed(true);
            setEmail('');
            // toast.success is handled by parent or just show the checkmark state
        } catch (error) {
            console.error('Failed to subscribe:', error);
            // Optional: toast.error('Failed to subscribe. Please try again.');
        }
    };

    // Hide Footer on Admin pages
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <footer className="bg-gradient-to-b from-[#1A3009] to-[#0D1805] text-white overflow-hidden">
            {/* Newsletter Section */}
            <div className="relative border-b border-white/5" suppressHydrationWarning>
                <div className="absolute inset-0 bg-[var(--color-primary)]/10" suppressHydrationWarning />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10" suppressHydrationWarning>
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10" suppressHydrationWarning>
                        <div className="text-center lg:text-left" suppressHydrationWarning>
                            <h3 className="font-heading text-3xl md:text-4xl font-bold mb-3">
                                Join Our Wellness Community
                            </h3>
                            <p className="text-white/60 text-lg max-w-xl">
                                Subscribe for exclusive offers, premium health tips, and wellness updates delivered directly to your inbox.
                            </p>
                        </div>

                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 sm:w-80 group" suppressHydrationWarning>
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[var(--color-accent)] transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-accent)] focus:bg-white/10 transition-all"
                                />
                            </div>
                            <Button type="submit" variant="accent" size="lg" className="rounded-2xl font-bold px-10 h-[60px] shadow-xl shadow-gold/10">
                                {subscribed ? '✓ Subscribed!' : (
                                    <div className="relative z-10 flex items-center gap-2" suppressHydrationWarning>
                                        Join Now <Send size={18} />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" suppressHydrationWarning>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8" suppressHydrationWarning>
                    {/* Brand Column */}
                    <div className="lg:col-span-4" suppressHydrationWarning>
                        <Link href="/" className="inline-block mb-8 group">
                            <div className="relative w-40 h-12 transition-transform duration-300 group-hover:scale-105" suppressHydrationWarning>
                                <Image
                                    src="/images/oryizon-logo.png"
                                    alt={SITE_CONFIG.name}
                                    fill
                                    className="object-contain brightness-0 invert"
                                />
                            </div>
                        </Link>
                        <p className="text-white/60 mb-10 text-lg leading-relaxed">
                            {SITE_CONFIG.description}
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-4" suppressHydrationWarning>
                            <motion.a
                                whileHover={{ x: 5 }}
                                href={`mailto:${SITE_CONFIG.email}`}
                                className="flex items-center gap-4 text-white/60 hover:text-white transition-colors"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center" suppressHydrationWarning>
                                    <Mail size={18} className="text-[var(--color-accent)]" />
                                </div>
                                <span className="font-medium">{SITE_CONFIG.email}</span>
                            </motion.a>
                            <motion.a
                                whileHover={{ x: 5 }}
                                href={`tel:${SITE_CONFIG.phone}`}
                                className="flex items-center gap-4 text-white/60 hover:text-white transition-colors"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center" suppressHydrationWarning>
                                    <Phone size={18} className="text-[var(--color-accent)]" />
                                </div>
                                <span className="font-medium">{SITE_CONFIG.phone}</span>
                            </motion.a>
                            <div className="flex items-start gap-4 text-white/60" suppressHydrationWarning>
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0" suppressHydrationWarning>
                                    <MapPin size={18} className="text-[var(--color-accent)]" />
                                </div>
                                <span className="font-medium leading-relaxed">{SITE_CONFIG.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:pl-12" suppressHydrationWarning>
                        <div suppressHydrationWarning>
                            <h4 className="font-heading font-bold text-xl mb-6 text-white">Menu</h4>
                            <ul className="space-y-4">
                                {FOOTER_LINKS.quickLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-white/60 hover:text-[var(--color-accent)] transition-colors text-base font-medium">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div suppressHydrationWarning>
                            <h4 className="font-heading font-bold text-xl mb-6 text-white">Support</h4>
                            <ul className="space-y-4">
                                {FOOTER_LINKS.support.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-white/60 hover:text-[var(--color-accent)] transition-colors text-base font-medium">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-span-2 sm:col-span-1" suppressHydrationWarning>
                            <h4 className="font-heading font-bold text-xl mb-6 text-white">Follow Us</h4>
                            <div className="flex flex-wrap gap-4" suppressHydrationWarning>
                                {[
                                    { icon: Facebook, href: SITE_CONFIG.social.facebook, label: 'Facebook' },
                                    { icon: Instagram, href: SITE_CONFIG.social.instagram, label: 'Instagram' },
                                    { icon: Twitter, href: SITE_CONFIG.social.twitter, label: 'Twitter' },
                                    { icon: Youtube, href: SITE_CONFIG.social.youtube, label: 'Youtube' },
                                ].map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[var(--color-accent)] transition-all duration-300 shadow-lg group"
                                        aria-label={social.label}
                                    >
                                        <social.icon size={20} className="group-hover:text-white transition-colors" />
                                    </motion.a>
                                ))}
                            </div>

                            <div className="mt-10" suppressHydrationWarning>
                                <h4 className="font-heading font-bold text-xl mb-4 text-white">Legal</h4>
                                <ul className="space-y-3">
                                    {FOOTER_LINKS.legal.map((link) => (
                                        <li key={link.href}>
                                            <Link href={link.href} className="text-white/60 hover:text-[var(--color-accent)] transition-colors text-sm font-medium">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Certifications Marquee-style grid */}
                <div className="border-t border-white/5 mt-20 pt-12" suppressHydrationWarning>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6" suppressHydrationWarning>
                        {CERTIFICATIONS.slice(0, 6).map((cert) => (
                            <motion.div
                                key={cert.id}
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                className="flex items-center gap-3 px-5 py-4 bg-white/5 rounded-2xl border border-white/5 transition-colors"
                                suppressHydrationWarning
                            >
                                <span className="text-2xl leading-none">{cert.icon}</span>
                                <span className="text-xs font-bold text-white/50 uppercase tracking-wider leading-tight">{cert.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5 bg-black/20" suppressHydrationWarning>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" suppressHydrationWarning>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-medium text-white/40" suppressHydrationWarning>
                        <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. Modern Wellness, Purely Delivered.</p>
                        <div className="flex items-center gap-6" suppressHydrationWarning>
                            <span className="flex items-center gap-2">
                                Made with <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-green-500">💚</motion.span> in India
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
