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

    // Only show cart count after hydration to avoid mismatch
    const cartItemCount = mounted ? getTotalItems() : 0;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide Header on Admin pages
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${isScrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
                        : 'bg-transparent py-5'
                    }
        `}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative w-32 h-10 md:w-40 md:h-12">
                                <Image
                                    src="/images/oryizon-logo.png"
                                    alt={SITE_CONFIG.name}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    font-medium transition-colors relative group
                    ${isScrolled
                                            ? 'text-[var(--color-text)] hover:text-[var(--color-primary)]'
                                            : 'text-white/90 hover:text-white'
                                        }
                  `}
                                >
                                    {item.label}
                                    <span className={`
                    absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full
                    ${isScrolled ? 'bg-[var(--color-primary)]' : 'bg-white'}
                  `} />
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <button
                                className={`
                  p-2 rounded-lg transition-colors hidden md:block
                  ${isScrolled
                                        ? 'hover:bg-[var(--color-secondary)] text-[var(--color-text)]'
                                        : 'hover:bg-white/10 text-white'
                                    }
                `}
                                aria-label="Search"
                            >
                                <Search size={20} />
                            </button>

                            {/* User */}
                            <Link
                                href="/account"
                                className={`
                  p-2 rounded-lg transition-colors hidden md:block
                  ${isScrolled
                                        ? 'hover:bg-[var(--color-secondary)] text-[var(--color-text)]'
                                        : 'hover:bg-white/10 text-white'
                                    }
                `}
                                aria-label="Account"
                            >
                                <User size={20} />
                            </Link>

                            {/* Cart */}
                            <button
                                onClick={openCart}
                                className={`
                  p-2 rounded-lg transition-colors relative
                  ${isScrolled
                                        ? 'hover:bg-[var(--color-secondary)] text-[var(--color-text)]'
                                        : 'hover:bg-white/10 text-white'
                                    }
                `}
                                aria-label="Cart"
                            >
                                <ShoppingCart size={20} />
                                {cartItemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-accent)] text-white text-xs rounded-full flex items-center justify-center font-medium"
                                    >
                                        {cartItemCount}
                                    </motion.span>
                                )}
                            </button>

                            {/* Shop Now Button - Desktop */}
                            <Link href="/products" className="hidden lg:block">
                                <Button variant={isScrolled ? 'primary' : 'accent'} size="sm">
                                    Shop Now
                                </Button>
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`
                  p-2 rounded-lg transition-colors lg:hidden
                  ${isScrolled
                                        ? 'hover:bg-[var(--color-secondary)] text-[var(--color-text)]'
                                        : 'hover:bg-white/10 text-white'
                                    }
                `}
                                aria-label="Menu"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 lg:hidden"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <motion.nav
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween' }}
                            className="absolute top-0 right-0 bottom-0 w-80 bg-white shadow-xl p-6"
                        >
                            <div className="flex justify-end mb-8">
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 hover:bg-[var(--color-secondary)] rounded-lg"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {NAV_ITEMS.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-lg font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] py-2 border-b border-[var(--color-secondary)]"
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="primary" fullWidth className="mt-4">
                                        Shop Now
                                    </Button>
                                </Link>

                                <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" fullWidth className="mt-2">
                                        My Account
                                    </Button>
                                </Link>
                            </div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
