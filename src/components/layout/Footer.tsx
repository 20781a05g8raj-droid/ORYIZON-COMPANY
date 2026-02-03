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
        <footer className="bg-[var(--color-primary-dark)] text-white">
            {/* Newsletter Section */}
            <div className="border-b border-white/10" suppressHydrationWarning>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" suppressHydrationWarning>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6" suppressHydrationWarning>
                        <div suppressHydrationWarning>
                            <h3 className="font-heading text-2xl font-semibold mb-2">
                                Join Our Wellness Community
                            </h3>
                            <p className="text-white/70">
                                Get exclusive offers, health tips, and updates delivered to your inbox.
                            </p>
                        </div>

                        <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="flex-1 md:w-72 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[var(--color-accent)]"
                            />
                            <Button type="submit" variant="accent">
                                {subscribed ? '✓ Subscribed!' : <Send size={20} />}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" suppressHydrationWarning>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10" suppressHydrationWarning>
                    {/* Brand Column */}
                    <div className="lg:col-span-2" suppressHydrationWarning>
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="relative w-32 h-10 md:w-40 md:h-12" suppressHydrationWarning>
                                <Image
                                    src="/images/oryizon-logo.png"
                                    alt={SITE_CONFIG.name}
                                    fill
                                    className="object-contain brightness-0 invert"
                                />
                            </div>
                        </Link>
                        <p className="text-white/70 mb-6 max-w-sm">
                            {SITE_CONFIG.description}
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3" suppressHydrationWarning>
                            <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                                <Mail size={18} />
                                {SITE_CONFIG.email}
                            </a>
                            <a href={`tel:${SITE_CONFIG.phone}`} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                                <Phone size={18} />
                                {SITE_CONFIG.phone}
                            </a>
                            <div className="flex items-start gap-3 text-white/70" suppressHydrationWarning>
                                <MapPin size={18} className="flex-shrink-0 mt-1" />
                                <span>{SITE_CONFIG.address}</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4 mt-6" suppressHydrationWarning>
                            {[
                                { icon: Facebook, href: SITE_CONFIG.social.facebook },
                                { icon: Instagram, href: SITE_CONFIG.social.instagram },
                                { icon: Twitter, href: SITE_CONFIG.social.twitter },
                                { icon: Youtube, href: SITE_CONFIG.social.youtube },
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-accent)] transition-colors"
                                >
                                    <social.icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div suppressHydrationWarning>
                        <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div suppressHydrationWarning>
                        <h4 className="font-heading font-semibold text-lg mb-4">Support</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.support.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div suppressHydrationWarning>
                        <h4 className="font-heading font-semibold text-lg mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.legal.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Certifications */}
                <div className="border-t border-white/10 mt-12 pt-8" suppressHydrationWarning>
                    <div className="flex flex-wrap items-center justify-center gap-6" suppressHydrationWarning>
                        {CERTIFICATIONS.slice(0, 6).map((cert) => (
                            <motion.div
                                key={cert.id}
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg"
                                suppressHydrationWarning
                            >
                                <span className="text-xl">{cert.icon}</span>
                                <span className="text-sm text-white/80">{cert.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10" suppressHydrationWarning>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" suppressHydrationWarning>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60" suppressHydrationWarning>
                        <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
                        <p>Made with 💚 in India</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
