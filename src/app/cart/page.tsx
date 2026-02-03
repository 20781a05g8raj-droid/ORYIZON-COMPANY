'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag, X, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { getShippingSettings, type ShippingSettings } from '@/lib/api/settings';

export default function CartPage() {
    const {
        items,
        removeItem,
        updateQuantity,
        getTotalPrice,
        clearCart,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        getDiscountAmount,
        getFinalPrice
    } = useCartStore();

    const [couponCode, setCouponCode] = useState('');
    const [couponSuccess, setCouponSuccess] = useState(false);

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

    const totalPrice = getTotalPrice();
    const discountAmount = getDiscountAmount();
    const priceAfterDiscount = getFinalPrice();
    const shipping = priceAfterDiscount >= shippingSettings.freeShippingThreshold ? 0 : shippingSettings.standardShipping;
    const finalTotal = priceAfterDiscount + shipping;

    const handleApplyCoupon = () => {
        const success = applyCoupon(couponCode);
        if (success) {
            setCouponSuccess(true);
            setCouponCode('');
            setTimeout(() => setCouponSuccess(false), 3000);
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponCode('');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="w-32 h-32 bg-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={48} className="text-[var(--color-text-muted)]" />
                        </div>
                        <h1 className="font-heading text-3xl font-bold mb-4">Your Cart is Empty</h1>
                        <p className="text-[var(--color-text-light)] mb-8">
                            Looks like you haven&apos;t added any products to your cart yet.
                        </p>
                        <Link href="/products">
                            <Button variant="primary" size="lg">
                                Start Shopping
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 bg-[var(--color-cream)]">
            {/* Header */}
            <section className="bg-white py-8 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-heading text-3xl font-bold">Shopping Cart</h1>
                    <p className="text-[var(--color-text-light)] mt-1">
                        {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>
            </section>

            {/* Cart Content */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                {/* Table Header */}
                                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-[var(--color-cream)] text-sm font-medium text-[var(--color-text-light)]">
                                    <div className="col-span-6">Product</div>
                                    <div className="col-span-2 text-center">Quantity</div>
                                    <div className="col-span-2 text-center">Price</div>
                                    <div className="col-span-2 text-right">Total</div>
                                </div>

                                {/* Cart Items */}
                                <div className="divide-y">
                                    {items.map((item) => (
                                        <motion.div
                                            key={`${item.product.id}-${item.variant.id}`}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center"
                                        >
                                            {/* Product */}
                                            <div className="col-span-6 flex gap-4 mb-4 md:mb-0">
                                                <div className="w-20 h-20 bg-[var(--color-cream)] rounded-lg overflow-hidden flex-shrink-0">
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
                                                <div>
                                                    <Link
                                                        href={`/products/${item.product.slug}`}
                                                        className="font-medium hover:text-[var(--color-primary)]"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <p className="text-sm text-[var(--color-text-light)]">
                                                        {item.variant.name}
                                                    </p>
                                                    <button
                                                        onClick={() => removeItem(item.product.id, item.variant.id)}
                                                        className="text-red-500 text-sm flex items-center gap-1 mt-2 hover:underline md:hidden"
                                                    >
                                                        <Trash2 size={14} />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Quantity */}
                                            <div className="col-span-2 flex items-center justify-center mb-4 md:mb-0">
                                                <div className="inline-flex items-center border border-[var(--color-secondary)] rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                                                        className="p-2 hover:bg-[var(--color-secondary)] transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                                                        className="p-2 hover:bg-[var(--color-secondary)] transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="col-span-2 text-center hidden md:block">
                                                {formatPrice(item.variant.price)}
                                            </div>

                                            {/* Total */}
                                            <div className="col-span-2 flex items-center justify-between md:justify-end gap-4">
                                                <span className="md:hidden text-sm text-[var(--color-text-light)]">Total:</span>
                                                <span className="font-semibold">
                                                    {formatPrice(item.variant.price * item.quantity)}
                                                </span>
                                                <button
                                                    onClick={() => removeItem(item.product.id, item.variant.id)}
                                                    className="text-red-500 hover:text-red-600 hidden md:block"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Continue Shopping & Clear Cart */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                                <Link href="/products">
                                    <Button variant="outline">
                                        ← Continue Shopping
                                    </Button>
                                </Link>
                                <Button variant="ghost" onClick={clearCart} className="text-red-500">
                                    Clear Cart
                                </Button>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-28">
                                <h2 className="font-heading text-xl font-semibold mb-6">Order Summary</h2>

                                {/* Coupon */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">Coupon Code</label>
                                    {appliedCoupon ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-green-50 border border-green-200 rounded-lg p-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Check size={16} className="text-green-600" />
                                                    <span className="font-medium text-green-700">{appliedCoupon.code}</span>
                                                </div>
                                                <button
                                                    onClick={handleRemoveCoupon}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-green-600 mt-1">{appliedCoupon.description}</p>
                                        </motion.div>
                                    ) : (
                                        <div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    placeholder="Enter code"
                                                    className="flex-1 px-4 py-2 border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] uppercase"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleApplyCoupon}
                                                    disabled={!couponCode.trim()}
                                                >
                                                    <Tag size={16} />
                                                </Button>
                                            </div>
                                            {couponError && (
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-red-500 text-xs mt-2"
                                                >
                                                    {couponError}
                                                </motion.p>
                                            )}
                                            {couponSuccess && (
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-green-600 text-xs mt-2"
                                                >
                                                    Coupon applied successfully!
                                                </motion.p>
                                            )}
                                        </div>
                                    )}

                                    {/* Available coupons hint */}
                                    {!appliedCoupon && (
                                        <p className="text-xs text-[var(--color-text-light)] mt-2">
                                            Try: WELCOME10, MORINGA20, FLAT100
                                        </p>
                                    )}
                                </div>

                                {/* Summary */}
                                <div className="space-y-3 border-t pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--color-text-light)]">Subtotal</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>

                                    {/* Discount Row */}
                                    {appliedCoupon && discountAmount > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="flex justify-between text-green-600"
                                        >
                                            <span>Discount ({appliedCoupon.code})</span>
                                            <span>-{formatPrice(discountAmount)}</span>
                                        </motion.div>
                                    )}

                                    <div className="flex justify-between">
                                        <span className="text-[var(--color-text-light)]">Shipping</span>
                                        <span className={shipping === 0 ? 'text-green-600' : ''}>
                                            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                                        </span>
                                    </div>
                                    {shipping > 0 && (
                                        <p className="text-xs text-[var(--color-accent)]">
                                            Add {formatPrice(shippingSettings.freeShippingThreshold - priceAfterDiscount)} more for free shipping!
                                        </p>
                                    )}
                                </div>

                                <div className="border-t mt-4 pt-4">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span className="text-[var(--color-primary)]">{formatPrice(finalTotal)}</span>
                                    </div>
                                    {appliedCoupon && discountAmount > 0 && (
                                        <p className="text-xs text-green-600 mt-1">
                                            You save {formatPrice(discountAmount)} with coupon!
                                        </p>
                                    )}
                                    <p className="text-xs text-[var(--color-text-light)] mt-1">
                                        Including applicable taxes
                                    </p>
                                </div>

                                {/* Checkout Button */}
                                <Link href="/checkout" className="block mt-6">
                                    <Button variant="primary" size="lg" fullWidth icon={<ArrowRight size={20} />} iconPosition="right">
                                        Proceed to Checkout
                                    </Button>
                                </Link>

                                {/* Trust Elements */}
                                <div className="mt-6 pt-6 border-t space-y-3 text-sm text-[var(--color-text-light)]">
                                    <p className="flex items-center gap-2">
                                        <span>🔒</span> Secure Checkout
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span>↩️</span> 30-Day Returns
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span>🚚</span> Free Shipping over ₹499
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
