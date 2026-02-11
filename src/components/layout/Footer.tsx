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
        } catch (error) {
            console.error('Failed to subscribe:', error);
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
                {/* Decorative glow for mobile */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-accent)]/5 rounded-full blur-3xl pointer-events-none md:hidden" suppressHydrationWarning />

                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10" suppressHydrationWarning>
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10" suppressHydrationWarning>
                        <div className="text-center lg:text-left" suppressHydrationWarning>
                            <h3 className="font-heading text-2xl md:text-4xl font-bold mb-2 md:mb-3">
                                Join Our Wellness Community
                            </h3>
                            <p className="text-white/60 text-[15px] md:text-lg max-w-xl leading-relaxed">
                                Subscribe for exclusive offers, premium health tips, and wellness updates.
                            </p>
                        </div>

                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 sm:w-80 group" suppressHydrationWarning>
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[var(--color-accent)] transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-accent)] focus:bg-white/10 transition-all"
                                />
                            </div>
                            <Button type="submit" variant="accent" size="lg" className="rounded-2xl font-bold px-8 md:px-10 h-[56px] md:h-[60px] shadow-xl shadow-gold/10 glow-cta">
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
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 md:py-20" suppressHydrationWarning>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8" suppressHydrationWarning>
                    {/* Brand Column */}
                    <div className="lg:col-span-4" suppressHydrationWarning>
                        <Link href="/" className="inline-block mb-6 md:mb-8 group">
                            <div className="relative w-36 h-10 md:w-40 md:h-12 transition-transform duration-300 group-hover:scale-105" suppressHydrationWarning>
                                <Image
                                    src="/images/oryizon-logo.png"
                                    alt={SITE_CONFIG.name}
                                    fill
                                    className="object-contain brightness-0 invert"
                                />
                            </div>
                        </Link>
                        <p className="text-white/60 mb-8 md:mb-10 text-[15px] md:text-lg leading-relaxed">
                            {SITE_CONFIG.description}
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 md:space-y-4" suppressHydrationWarning>
                            <motion.a
                                whileHover={{ x: 5 }}
                                href={`mailto:${SITE_CONFIG.email}`}
                                className="flex items-center gap-3 md:gap-4 text-white/60 hover:text-white transition-colors"
                            >
                                <div className="w-10 h-10 rounded-xl glass-card-dark flex items-center justify-center" suppressHydrationWarning>
                                    <Mail size={18} className="text-[var(--color-accent)]" />
                                </div>
                                <span className="font-medium text-sm md:text-base">{SITE_CONFIG.email}</span>
                            </motion.a>
                            <motion.a
                                whileHover={{ x: 5 }}
                                href={`tel:${SITE_CONFIG.phone}`}
                                className="flex items-center gap-3 md:gap-4 text-white/60 hover:text-white transition-colors"
                            >
                                <div className="w-10 h-10 rounded-xl glass-card-dark flex items-center justify-center" suppressHydrationWarning>
                                    <Phone size={18} className="text-[var(--color-accent)]" />
                                </div>
                                <span className="font-medium text-sm md:text-base">{SITE_CONFIG.phone}</span>
                            </motion.a>
                            <div className="flex items-start gap-3 md:gap-4 text-white/60" suppressHydrationWarning>
                                <div className="w-10 h-10 rounded-xl glass-card-dark flex items-center justify-center flex-shrink-0" suppressHydrationWarning>
                                    <MapPin size={18} className="text-[var(--color-accent)]" />
                                </div>
                                <span className="font-medium text-sm md:text-base leading-relaxed">{SITE_CONFIG.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:pl-12" suppressHydrationWarning>
                        <div suppressHydrationWarning>
                            <h4 className="font-heading font-bold text-lg md:text-xl mb-5 md:mb-6 text-white">Menu</h4>
                            <ul className="space-y-3 md:space-y-4">
                                {FOOTER_LINKS.quickLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-white/60 hover:text-[var(--color-accent)] transition-colors text-sm md:text-base font-medium">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div suppressHydrationWarning>
                            <h4 className="font-heading font-bold text-lg md:text-xl mb-5 md:mb-6 text-white">Support</h4>
                            <ul className="space-y-3 md:space-y-4">
                                {FOOTER_LINKS.support.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-white/60 hover:text-[var(--color-accent)] transition-colors text-sm md:text-base font-medium">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-span-2 sm:col-span-1" suppressHydrationWarning>
                            <h4 className="font-heading font-bold text-lg md:text-xl mb-5 md:mb-6 text-white">Follow Us</h4>
                            <div className="flex flex-wrap gap-3 md:gap-4" suppressHydrationWarning>
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
                                        className="w-12 h-12 rounded-2xl glass-card-dark flex items-center justify-center hover:bg-gradient-to-br hover:from-[var(--color-accent)] hover:to-[var(--color-accent-light)] transition-all duration-300 shadow-lg group min-w-[48px] min-h-[48px]"
                                        aria-label={social.label}
                                    >
                                        <social.icon size={20} className="group-hover:text-white transition-colors" />
                                    </motion.a>
                                ))}
                            </div>

                            <div className="mt-8 md:mt-10" suppressHydrationWarning>
                                <h4 className="font-heading font-bold text-lg md:text-xl mb-3 md:mb-4 text-white">Legal</h4>
                                <ul className="space-y-2.5 md:space-y-3">
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

                {/* Certifications — horizontally scrollable on mobile */}
                <div className="border-t border-white/5 mt-14 md:mt-20 pt-10 md:pt-12" suppressHydrationWarning>
                    <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5 md:mx-0 md:px-0 scroll-snap-x" suppressHydrationWarning>
                        {CERTIFICATIONS.slice(0, 6).map((cert) => (
                            <motion.div
                                key={cert.id}
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                className="flex-shrink-0 flex items-center gap-2.5 md:gap-3 px-4 md:px-5 py-3 md:py-4 glass-card-dark rounded-2xl transition-colors"
                                suppressHydrationWarning
                            >
                                <span className="text-xl md:text-2xl leading-none">{cert.icon}</span>
                                <span className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-wider leading-tight whitespace-nowrap">{cert.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5 bg-black/20" suppressHydrationWarning>
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6 md:py-8" suppressHydrationWarning>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 text-xs md:text-sm font-medium text-white/40" suppressHydrationWarning>
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
