'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, CreditCard, Truck, Shield, Check, Tag, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { PAYMENT_METHODS } from '@/lib/constants';
import { getShippingSettings, type ShippingSettings } from '@/lib/api/settings';
import { createOrder, getOrCreateCustomer } from '@/lib/api/orders';
import { getProductBySlug as fetchProductBySlug } from '@/lib/api/products';
import type { Order } from '@/types/database';

export default function CheckoutPage() {
    const {
        items,
        getTotalPrice,
        clearCart,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        getDiscountAmount,
        getFinalPrice
    } = useCartStore();

    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

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

    const [shippingData, setShippingData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('card');

    const totalPrice = getTotalPrice();
    const discountAmount = getDiscountAmount();
    const priceAfterDiscount = getFinalPrice();
    const shipping = priceAfterDiscount >= shippingSettings.freeShippingThreshold ? 0 : shippingSettings.standardShipping;
    const finalTotal = priceAfterDiscount + shipping;

    const handleApplyCoupon = () => {
        applyCoupon(couponCode);
        setCouponCode('');
    };

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        try {
            // 1. Create or get customer
            await getOrCreateCustomer({
                email: shippingData.email,
                name: `${shippingData.firstName} ${shippingData.lastName}`,
                phone: shippingData.phone,
                address: shippingData.address,
                city: shippingData.city,
                state: shippingData.state,
                pincode: shippingData.pincode
            });

            // 2. Prepare order items with valid UUIDs
            console.log('Resolving product IDs...');
            const orderItems = await Promise.all(items.map(async (item) => {
                let productId = item.product.id;

                // If ID is not a UUID (assumed if it doesn't look like one), try to find by slug
                // Simple check for UUID format (8-4-4-4-12 hex digits)
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);

                if (!isUuid && item.product.slug) {
                    console.log(`Resolving UUID for product: ${item.product.name} (${item.product.slug})`);
                    try {
                        const product = await fetchProductBySlug(item.product.slug);
                        if (product) {
                            productId = product.id;
                            console.log(`Resolved to UUID: ${productId}`);
                        } else {
                            console.warn(`Could not resolve UUID for slug: ${item.product.slug}`);
                        }
                    } catch (err) {
                        console.error(`Failed to resolve product UUID for slug ${item.product.slug}`, err);
                    }
                }

                return {
                    product_id: productId,
                    product_name: item.product.name,
                    // variant_id removed as it does not exist in schema
                    variant_name: item.variant.name,
                    quantity: item.quantity,
                    price: item.variant.price,
                    total: item.variant.price * item.quantity
                };
            }));

            // 3. Create order
            const order = await createOrder({
                customer_name: `${shippingData.firstName} ${shippingData.lastName}`,
                customer_email: shippingData.email,
                customer_phone: shippingData.phone,

                // Cost Breakdown
                subtotal: totalPrice,
                discount: discountAmount,
                shipping: shipping,
                total: finalTotal,
                coupon_code: appliedCoupon ? appliedCoupon.code : null,
                notes: '',

                status: 'pending',
                payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
                shipping_address: shippingData.address,
                city: shippingData.city,
                state: shippingData.state,
                pincode: shippingData.pincode,
                payment_method: paymentMethod
            }, orderItems);

            setCreatedOrder(order);
            setIsProcessing(false);
            setOrderComplete(true);
            clearCart();
        } catch (error: any) {
            console.error('Order creation failed:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            setIsProcessing(false);
            alert(`Failed to place order: ${error.message || 'Unknown error'}. Please check console for details.`);
        }
    };

    if (items.length === 0 && !orderComplete) {
        return (
            <div className="min-h-screen pt-32 pb-20">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <h1 className="font-heading text-3xl font-bold mb-4">Your Cart is Empty</h1>
                    <p className="text-[var(--color-text-light)] mb-8">
                        Add some products to checkout.
                    </p>
                    <Link href="/products">
                        <Button variant="primary" size="lg">Shop Now</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (orderComplete) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-[var(--color-cream)]">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-12 shadow-sm"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check size={40} className="text-green-600" />
                        </div>
                        <h1 className="font-heading text-3xl font-bold mb-4">Order Confirmed!</h1>
                        <p className="text-[var(--color-text-light)] mb-2">
                            Thank you for your order. We&apos;ve sent a confirmation email to your inbox.
                        </p>
                        <p className="text-[var(--color-primary)] font-semibold mb-8">
                            Order #{createdOrder?.order_number || 'PENDING'}
                        </p>
                        <div className="space-y-3 mt-8">
                            <Link href="/">
                                <Button variant="primary" size="lg" fullWidth>
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 bg-[var(--color-cream)]" suppressHydrationWarning>
            {/* Header */}
            <section className="bg-white py-6 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/cart" className="inline-flex items-center gap-2 text-[var(--color-text-light)] hover:text-[var(--color-primary)] mb-4">
                        <ChevronLeft size={20} />
                        Back to Cart
                    </Link>
                    <h1 className="font-heading text-3xl font-bold">Checkout</h1>

                    {/* Steps */}
                    <div className="flex items-center gap-4 mt-6">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-secondary)]'}`}>
                                {step > 1 ? '✓' : '1'}
                            </div>
                            <span className="font-medium">Shipping</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-[var(--color-secondary)]" />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-secondary)]'}`}>
                                2
                            </div>
                            <span className="font-medium">Payment</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Checkout Content */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Forms */}
                        <div className="lg:col-span-2">
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white rounded-xl shadow-sm p-6"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <Truck className="text-[var(--color-primary)]" size={24} />
                                        <h2 className="font-heading text-xl font-semibold">Shipping Information</h2>
                                    </div>

                                    <form onSubmit={handleShippingSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">First Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={shippingData.firstName}
                                                    onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                                                    className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Last Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={shippingData.lastName}
                                                    onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                                                    className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Email *</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={shippingData.email}
                                                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                                                    className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Phone *</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={shippingData.phone}
                                                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Address *</label>
                                            <input
                                                type="text"
                                                required
                                                value={shippingData.address}
                                                onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                                className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                placeholder="Street address, apartment, etc."
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">City *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={shippingData.city}
                                                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                                    className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">State *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={shippingData.state}
                                                    onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                                                    className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">PIN Code *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={shippingData.pincode}
                                                    onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                                                    className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                            </div>
                                        </div>

                                        <Button type="submit" variant="primary" size="lg" fullWidth>
                                            Continue to Payment
                                        </Button>
                                    </form>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white rounded-xl shadow-sm p-6"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <CreditCard className="text-[var(--color-primary)]" size={24} />
                                        <h2 className="font-heading text-xl font-semibold">Payment Method</h2>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        {[
                                            { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                                            { id: 'upi', label: 'UPI', icon: '📱' },
                                            { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
                                            { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                                        ].map((method) => (
                                            <label
                                                key={method.id}
                                                className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === method.id
                                                    ? 'border-[var(--color-primary)] bg-[var(--color-cream)]'
                                                    : 'border-[var(--color-secondary)] hover:border-[var(--color-primary-light)]'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value={method.id}
                                                    checked={paymentMethod === method.id}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="sr-only"
                                                />
                                                <span className="text-2xl">{method.icon}</span>
                                                <span className="font-medium">{method.label}</span>
                                                {paymentMethod === method.id && (
                                                    <Check size={20} className="ml-auto text-[var(--color-primary)]" />
                                                )}
                                            </label>
                                        ))}
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <div className="space-y-4 mb-8 p-4 bg-[var(--color-cream)] rounded-xl">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Card Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="1234 5678 9012 3456"
                                                    className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Expiry</label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">CVV</label>
                                                    <input
                                                        type="text"
                                                        placeholder="123"
                                                        className="w-full px-4 py-3 border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <Button variant="outline" onClick={() => setStep(1)}>
                                            Back
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            fullWidth
                                            loading={isProcessing}
                                            onClick={handlePlaceOrder}
                                        >
                                            {isProcessing ? 'Processing...' : `Pay ${formatPrice(finalTotal)}`}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-28">
                                <h2 className="font-heading text-xl font-semibold mb-6">Order Summary</h2>

                                {/* Items */}
                                <div className="space-y-4 max-h-60 overflow-y-auto mb-6">
                                    {items.map((item) => (
                                        <div key={`${item.product.id}-${item.variant.id}`} className="flex gap-3">
                                            <div className="w-16 h-16 bg-[var(--color-cream)] rounded-lg flex-shrink-0 flex items-center justify-center">
                                                <span className="text-2xl">🌿</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                                                <p className="text-xs text-[var(--color-text-light)]">{item.variant.name} × {item.quantity}</p>
                                            </div>
                                            <p className="font-medium text-sm">
                                                {formatPrice(item.variant.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Coupon Section */}
                                <div className="border-t pt-4 mb-4">
                                    {appliedCoupon ? (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Tag size={16} className="text-green-600" />
                                                    <span className="font-medium text-green-700">{appliedCoupon.code}</span>
                                                </div>
                                                <button
                                                    onClick={removeCoupon}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-green-600 mt-1">{appliedCoupon.description}</p>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder="Coupon code"
                                                className="flex-1 px-3 py-2 text-sm border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] uppercase"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleApplyCoupon}
                                                disabled={!couponCode.trim()}
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                    )}
                                    {couponError && (
                                        <p className="text-red-500 text-xs mt-2">{couponError}</p>
                                    )}
                                </div>

                                {/* Summary */}
                                <div className="space-y-3 border-t pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--color-text-light)]">Subtotal</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>

                                    {/* Discount Row */}
                                    {appliedCoupon && discountAmount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Discount ({appliedCoupon.code})</span>
                                            <span>-{formatPrice(discountAmount)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--color-text-light)]">Shipping</span>
                                        <span className={shipping === 0 ? 'text-green-600' : ''}>
                                            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                                        </span>
                                    </div>
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
                                </div>

                                {/* Security */}
                                <div className="mt-6 pt-6 border-t flex items-center gap-2 text-sm text-[var(--color-text-light)]">
                                    <Shield size={18} className="text-green-600" />
                                    <span>Secure checkout with SSL encryption</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
