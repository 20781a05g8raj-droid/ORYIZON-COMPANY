'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Search, User, Sparkles } from 'lucide-react';
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/constants';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { usePathname } from 'next/navigation';

export function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { getTotalItems, openCart } = useCartStore();
    const [scrollProgress, setScrollProgress] = useState(0);

    // Only show cart count after hydration to avoid mismatch
    const cartItemCount = mounted ? getTotalItems() : 0;
    const isHomePage = pathname === '/';

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalScroll > 0) {
                setScrollProgress((window.scrollY / totalScroll) * 100);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide Header on Admin pages
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    const showSolidHeader = !isHomePage || isScrolled;

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${showSolidHeader
                        ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-[var(--color-secondary)]/30 py-2 md:py-3'
                        : 'bg-transparent py-3 md:py-6'
                    }
        `}
                suppressHydrationWarning
            >
                {/* Scroll Progress Bar */}
                <div
                    className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary-light)] transition-all duration-200 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                    suppressHydrationWarning
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                    <div className="flex items-center justify-between" suppressHydrationWarning>
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative w-28 h-8 md:w-40 md:h-12 transition-all duration-300"
                                suppressHydrationWarning
                            >
                                <Image
                                    src="/images/oryizon-logo.png"
                                    alt={SITE_CONFIG.name}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-10">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    font-heading text-sm font-semibold tracking-wide transition-all duration-300 relative group py-2
                    ${showSolidHeader
                                            ? 'text-[var(--color-text)] hover:text-[var(--color-primary)]'
                                            : 'text-white hover:text-[var(--color-accent)]'
                                        }
                    ${pathname === item.href ? (showSolidHeader ? 'text-[var(--color-primary)]' : 'text-[var(--color-accent)]') : ''}
                  `}
                                >
                                    {item.label}
                                    <span className={`
                    absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full
                    ${showSolidHeader ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-accent)]'}
                    ${pathname === item.href ? 'w-full' : ''}
                  `} />
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1.5 md:gap-4">
                            {/* Search */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`
                  p-2.5 rounded-full transition-colors hidden md:flex items-center justify-center
                  ${showSolidHeader
                                        ? 'hover:bg-[var(--color-secondary)] text-[var(--color-text)]'
                                        : 'hover:bg-white/10 text-white font-bold'
                                    }
                `}
                                aria-label="Search"
                            >
                                <Search size={20} strokeWidth={2.5} />
                            </motion.button>

                            {/* User */}
                            <Link href="/account" className="hidden md:block">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`
                    p-2.5 rounded-full transition-colors flex items-center justify-center
                    ${showSolidHeader
                                            ? 'hover:bg-[var(--color-secondary)] text-[var(--color-text)]'
                                            : 'hover:bg-white/10 text-white font-bold'
                                        }
                  `}
                                    aria-label="Account"
                                >
                                    <User size={20} strokeWidth={2.5} />
                                </motion.div>
                            </Link>

                            {/* Cart */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={openCart}
                                className={`
                  p-2.5 rounded-full transition-colors relative flex items-center justify-center
                  ${showSolidHeader
                                        ? 'hover:bg-[var(--color-secondary)] text-[var(--color-text)]'
                                        : 'hover:bg-white/10 text-white font-bold'
                                    }
                `}
                                aria-label="Cart"
                            >
                                <ShoppingCart size={20} strokeWidth={2.5} />
                                {cartItemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-accent)] text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white"
                                    >
                                        {cartItemCount}
                                    </motion.span>
                                )}
                            </motion.button>

                            {/* Shop Now Button - Desktop */}
                            <Link href="/products" className="hidden lg:block">
                                <Button variant={showSolidHeader ? 'primary' : 'accent'} size="sm" className="rounded-xl shadow-lg font-bold">
                                    Shop Now
                                </Button>
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`
                  p-2.5 rounded-xl transition-colors lg:hidden flex items-center justify-center min-w-[44px] min-h-[44px]
                  ${showSolidHeader
                                        ? 'hover:bg-[var(--color-secondary)] text-[var(--color-text)]'
                                        : 'hover:bg-white/10 text-white font-bold'
                                    }
                `}
                                aria-label="Menu"
                            >
                                {isMobileMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* ========== PREMIUM MOBILE MENU ========== */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] lg:hidden"
                    >
                        {/* Frosted glass backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#1A3009]/60 backdrop-blur-xl"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.nav
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="absolute top-0 right-0 bottom-0 w-[88%] max-w-sm bg-gradient-to-b from-white via-white to-[var(--color-cream)] shadow-2xl flex flex-col overflow-hidden"
                        >
                            {/* Header with gradient accent line */}
                            <div className="relative px-7 pt-6 pb-5">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary-light)]" />
                                <div className="flex items-center justify-between">
                                    <div className="relative w-32 h-8">
                                        <Image src="/images/oryizon-logo.png" alt="Oryizon" fill className="object-contain" />
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2.5 bg-[var(--color-cream)] rounded-xl text-[var(--color-text)] min-w-[44px] min-h-[44px] flex items-center justify-center"
                                    >
                                        <X size={22} />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 overflow-y-auto px-7 py-4">
                                <div className="flex flex-col gap-1.5">
                                    {NAV_ITEMS.map((item, index) => (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 + index * 0.08, type: 'spring', stiffness: 300 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-lg font-heading font-bold min-h-[52px] ${pathname === item.href
                                                    ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10'
                                                    : 'text-[var(--color-text)] hover:bg-[var(--color-cream)] active:bg-[var(--color-cream)]'
                                                    }`}
                                            >
                                                {pathname === item.href && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                                                )}
                                                {item.label}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Decorative divider */}
                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />

                                {/* Quick info */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10"
                                >
                                    <Sparkles size={18} className="text-[var(--color-accent)]" />
                                    <span className="text-sm font-medium text-[var(--color-text-light)]">Premium Organic Moringa</span>
                                </motion.div>
                            </div>

                            {/* Bottom CTA Area */}
                            <div className="px-7 pb-8 pt-4 space-y-3 bg-gradient-to-t from-[var(--color-cream)] to-transparent">
                                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="primary" fullWidth size="lg" className="rounded-2xl font-bold h-14 shadow-xl glow-cta">
                                        Shop All Products
                                    </Button>
                                </Link>

                                <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" fullWidth size="lg" className="rounded-2xl font-bold h-14 border-2 mt-2">
                                        My Account
                                    </Button>
                                </Link>

                                <div className="pt-4 flex items-center justify-center gap-4 text-[var(--color-text-light)] text-xs font-medium">
                                    <span className="flex items-center gap-1.5">🌱 Organic</span>
                                    <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]/40" />
                                    <span className="flex items-center gap-1.5">🔬 Lab Tested</span>
                                    <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]/40" />
                                    <span className="flex items-center gap-1.5">🇮🇳 India</span>
                                </div>
                            </div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
