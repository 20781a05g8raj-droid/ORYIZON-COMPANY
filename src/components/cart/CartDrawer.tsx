'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { getShippingSettings, type ShippingSettings } from '@/lib/api/settings';

export function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();
    const totalPrice = getTotalPrice();

    // Dynamic shipping settings from database
    const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
        freeShippingThreshold: 499,
        standardShipping: 50,
        expressShipping: 100,
        deliveryTime: { standard: '5-7 business days', express: '2-3 business days' }
    });

    useEffect(() => {
        getShippingSettings().then(setShippingSettings);
    }, []);

    const freeShippingRemaining = shippingSettings.freeShippingThreshold - totalPrice;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-[var(--color-primary)]" />
                                <h2 className="font-heading text-xl font-semibold">Your Cart</h2>
                                <span className="bg-[var(--color-secondary)] text-[var(--color-primary)] px-2 py-0.5 rounded-full text-sm font-medium">
                                    {items.length}
                                </span>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-[var(--color-secondary)] rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Free Shipping Progress */}
                        {totalPrice > 0 && totalPrice < shippingSettings.freeShippingThreshold && (
                            <div className="px-5 py-3 bg-[var(--color-cream)]">
                                <p className="text-sm text-[var(--color-text-light)] mb-2">
                                    Add <span className="font-semibold text-[var(--color-primary)]">{formatPrice(freeShippingRemaining)}</span> more for FREE shipping!
                                </p>
                                <div className="h-2 bg-[var(--color-secondary)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(totalPrice / shippingSettings.freeShippingThreshold) * 100}%` }}
                                        className="h-full bg-[var(--color-primary)]"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-24 h-24 bg-[var(--color-secondary)] rounded-full flex items-center justify-center mb-4">
                                        <ShoppingBag size={40} className="text-[var(--color-text-muted)]" />
                                    </div>
                                    <h3 className="font-heading text-lg font-semibold mb-2">Your cart is empty</h3>
                                    <p className="text-[var(--color-text-light)] mb-6">
                                        Looks like you haven&apos;t added any products yet.
                                    </p>
                                    <Button onClick={closeCart} variant="primary">
                                        Start Shopping
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <motion.div
                                            key={`${item.product.id}-${item.variant.id}`}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex gap-4 p-3 bg-[var(--color-cream)] rounded-xl"
                                        >
                                            {/* Product Image */}
                                            <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                                {item.product.images[0] ? (
                                                    <Image
                                                        src={item.product.images[0]}
                                                        alt={item.product.name}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-3xl">
                                                        🌿
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                                                <p className="text-xs text-[var(--color-text-light)]">{item.variant.name}</p>
                                                <p className="font-semibold text-[var(--color-primary)] mt-1">
                                                    {formatPrice(item.variant.price)}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-2 bg-white rounded-lg">
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                                                            className="p-1.5 hover:bg-[var(--color-secondary)] rounded-l-lg transition-colors"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                                                            className="p-1.5 hover:bg-[var(--color-secondary)] rounded-r-lg transition-colors"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.product.id, item.variant.id)}
                                                        className="text-red-500 text-xs hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t p-5 space-y-4">
                                {/* Subtotal */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[var(--color-text-light)]">Subtotal</span>
                                    <span className="font-semibold text-lg">{formatPrice(totalPrice)}</span>
                                </div>

                                {/* Shipping Note */}
                                <p className="text-xs text-[var(--color-text-light)] text-center">
                                    Shipping calculated at checkout
                                </p>

                                {/* CTA Buttons */}
                                <div className="space-y-3">
                                    <Link href="/checkout" onClick={closeCart}>
                                        <Button variant="primary" fullWidth size="lg">
                                            Checkout
                                            <ArrowRight size={18} />
                                        </Button>
                                    </Link>
                                    <Link href="/cart" onClick={closeCart}>
                                        <Button variant="outline" fullWidth>
                                            View Cart
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
