'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Search, User } from 'lucide-react';
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

    // Determine header style state
    // If on homepage: transparent when at top, white/blurred when scrolled
    // If NOT on homepage: ALWAYS white/blurred (to be visible against potentially white backgrounds)
    // OR we could just say: if !isHomePage || isScrolled
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
                        : 'bg-transparent py-4 md:py-6'
                    }
        `}
                suppressHydrationWarning
            >
                {/* Scroll Progress Bar */}
                <div
                    className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-accent)] transition-all duration-200 ease-out"
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
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Search */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`
                  p-2 rounded-full transition-colors hidden md:flex items-center justify-center
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
                    p-2 rounded-full transition-colors flex items-center justify-center
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
                  p-2 rounded-full transition-colors relative flex items-center justify-center
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
                  p-2 rounded-full transition-colors lg:hidden flex items-center justify-center
                  ${showSolidHeader
                                        ? 'hover:bg-[var(--color-secondary)] text-[var(--color-text)]'
                                        : 'hover:bg-white/10 text-white font-bold'
                                    }
                `}
                                aria-label="Menu"
                            >
                                {isMobileMenuOpen ? <X size={26} strokeWidth={2.5} /> : <Menu size={26} strokeWidth={2.5} />}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] lg:hidden"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-[var(--color-text)]/40 backdrop-blur-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <motion.nav
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl p-8 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div className="relative w-32 h-8">
                                    <Image src="/images/oryizon-logo.png" alt="Oryizon" fill className="object-contain" />
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 bg-[var(--color-secondary)] rounded-full text-[var(--color-text)]"
                                >
                                    <X size={24} />
                                </motion.button>
                            </div>

                            <div className="flex flex-col gap-6 overflow-y-auto flex-1">
                                {NAV_ITEMS.map((item, index) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`text-2xl font-heading font-bold transition-all ${pathname === item.href ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)] hover:text-[var(--color-primary)]'}`}
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-auto space-y-4 pt-8">
                                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="primary" fullWidth size="lg" className="rounded-2xl font-bold">
                                        Shop All Products
                                    </Button>
                                </Link>

                                <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" fullWidth size="lg" className="rounded-2xl font-bold">
                                        My Account
                                    </Button>
                                </Link>

                                <div className="pt-6 text-center text-[var(--color-text-light)] text-sm font-medium">
                                    🌱 Sustainably Sourced • Lab Tested
                                </div>
                            </div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
