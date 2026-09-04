'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { ChevronLeft, CreditCard, Truck, Shield, Check, Tag, X, Loader2, Copy, MessageSquare, ExternalLink } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { getShippingSettings, type ShippingSettings } from '@/lib/api/settings';
import { createOrder, getOrCreateCustomer, updateOrderStatus } from '@/lib/api/orders';
import { getProductBySlug as fetchProductBySlug } from '@/lib/api/products';
import type { Order } from '@/types/database';
import { toast } from 'react-hot-toast';

declare global {
    interface Window {
        Razorpay: any;
    }
}

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

    const [paymentMethod, setPaymentMethod] = useState('online');

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

    const processOrderCreation = async (paymentDetails: any = null, isPending: boolean = false) => {
        try {
            const effectiveEmail = shippingData.email.trim() || 
                (shippingData.phone ? `${shippingData.phone.replace(/\D/g, '')}@customer.oryizon.com` : 'customer@oryizon.com');

            // 1. Create or get customer
            await getOrCreateCustomer({
                email: effectiveEmail,
                name: `${shippingData.firstName} ${shippingData.lastName}`.trim(),
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
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);

                if (!isUuid && item.product.slug) {
                    try {
                        const product = await fetchProductBySlug(item.product.slug);
                        if (product) {
                            productId = product.id;
                        }
                    } catch (err) {
                        console.error(`Failed to resolve product UUID for slug ${item.product.slug}`, err);
                    }
                }

                return {
                    product_id: productId,
                    product_name: item.product.name,
                    variant_name: item.variant?.name || 'Standard',
                    quantity: item.quantity,
                    price: item.variant?.price ?? item.product.price,
                    total: (item.variant?.price ?? item.product.price) * item.quantity
                };
            }));

            // 3. Create order
            const order = await createOrder({
                customer_name: `${shippingData.firstName} ${shippingData.lastName}`.trim(),
                customer_email: shippingData.email.trim() || effectiveEmail,
                customer_phone: shippingData.phone,

                // Cost Breakdown
                subtotal: totalPrice,
                discount: discountAmount,
                shipping: shipping,
                total: finalTotal,
                coupon_code: appliedCoupon ? appliedCoupon.code : null,
                notes: paymentDetails ? `Payment ID: ${paymentDetails.razorpay_payment_id}` : '',

                status: 'pending', // Always start as pending
                payment_status: paymentMethod === 'cod' ? 'pending' : (paymentDetails ? 'paid' : 'pending'),
                shipping_address: shippingData.address,
                city: shippingData.city,
                state: shippingData.state,
                pincode: shippingData.pincode,
                payment_method: paymentMethod
            }, orderItems);

            if (isPending) {
                return order; // Return order for Razorpay flow
            }

            setCreatedOrder(order);
            setIsProcessing(false);
            setOrderComplete(true);
            clearCart();
            toast.success('Order placed successfully!');
            return order;
        } catch (error: any) {
            console.error('Order creation failed:', error);
            setIsProcessing(false);
            toast.error(`Failed to place order: ${error.message || 'Unknown error'}`);
            throw error;
        }
    };

    const handleRazorpayPayment = async () => {
        // 1. Create Pending Order FIRST
        let orderId: string | null = null;
        let createdOrderData: Order | null = null;
        try {
            const order = await processOrderCreation(null, true); // true = isPending
            if (!order) return;
            orderId = order.id;
            createdOrderData = order;
            setCreatedOrder(order);
        } catch (error) {
            console.error('Failed to create pending order:', error);
            toast.error('Could not initiate order. Please try again.');
            return;
        }

        // 2. Create Razorpay Order
        const res = await fetch('/api/razorpay/order', {
            method: 'POST',
            body: JSON.stringify({
                amount: finalTotal,
                currency: 'INR',
                receipt: `rcpt_${orderId.slice(-20)}`,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();

        if (!data.id) {
            console.error('Order creation failed:', data);
            toast.error(data.error || 'Could not create payment order');
            setIsProcessing(false);
            return;
        }

        const options = {
            key: data.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: "Oryizon",
            description: "Organic Moringa Products",
            image: "/logo.png",
            order_id: data.id,
            notes: {
                internal_order_id: orderId // Link Razorpay order to our DB order
            },
            handler: async function (response: any) {
                // Verify Payment
                try {
                    const verifyRes = await fetch('/api/razorpay/verify', {
                        method: 'POST',
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        // Update Order to PAID
                        await updateOrderStatus(orderId!, 'processing', 'paid', response);
                        if (createdOrderData) {
                            setCreatedOrder({
                                ...createdOrderData,
                                payment_status: 'paid',
                                status: 'processing',
                            });
                        }
                        setOrderComplete(true);
                        clearCart();
                        toast.success('Order placed successfully!');
                    } else {
                        // Update to Failed (or keep pending)
                        await updateOrderStatus(orderId!, 'pending', 'failed');
                        toast.error('Payment verification failed');
                    }
                } catch (error) {
                    console.error('Verification error:', error);
                    await updateOrderStatus(orderId!, 'pending', 'failed');
                    toast.error('Payment verification failed');
                } finally {
                    setIsProcessing(false);
                }
            },
            prefill: {
                name: `${shippingData.firstName} ${shippingData.lastName}`.trim(),
                email: shippingData.email.trim() || undefined,
                contact: shippingData.phone,
            },
            theme: {
                color: "#16a34a",
            },
            modal: {
                ondismiss: async function () {
                    setIsProcessing(false);
                    toast.error('Payment cancelled');
                    // Mark as Failed/Cancelled if user closes modal
                    if (orderId) {
                        await updateOrderStatus(orderId, 'pending', 'failed');
                    }
                }
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response: any) {
            console.error('Payment failed:', response.error);
            toast.error(response.error?.description || 'Payment transaction failed');
            setIsProcessing(false);
        });
        paymentObject.open();
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        await handleRazorpayPayment();
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
        const trackingId = createdOrder?.order_number || 'PENDING';
        const cleanPhone = shippingData.phone.replace(/\D/g, '').slice(-10);
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.oryizon.com';
        const trackUrl = `${origin}/track-order?orderId=${encodeURIComponent(trackingId)}&phone=${encodeURIComponent(cleanPhone)}`;

        const companyWhatsappNumber = '918969124404';
        const whatsappMessage = `🌿 *New Order Placed - Oryizon* 🌿\n\n📦 *Tracking ID:* ${trackingId}\n👤 *Customer Name:* ${shippingData.firstName} ${shippingData.lastName}\n📞 *Customer Phone:* ${shippingData.phone}\n💰 *Amount:* ₹${finalTotal}\n📍 *Delivery Address:* ${shippingData.address}, ${shippingData.city}, ${shippingData.state} - ${shippingData.pincode}\n\n🚚 *Track Order Link:*\n${trackUrl}\n\nPlease confirm my order shipment updates on this WhatsApp. Thank you!`;

        const whatsappCompanyUrl = `https://wa.me/${companyWhatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        const handleCopyTracking = () => {
            if (navigator.clipboard && trackingId !== 'PENDING') {
                navigator.clipboard.writeText(trackingId);
                toast.success('Tracking ID copied to clipboard!');
            }
        };

        return (
            <div className="min-h-screen pt-28 pb-20 bg-[#FBF9F4]">
                <div className="max-w-2xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-emerald-100 text-center"
                    >
                        {/* Success Icon */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                            <Check size={36} className="text-emerald-600 stroke-[3]" />
                        </div>

                        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            Order Confirmed Successfully! 🎉
                        </h1>
                        <p className="text-gray-600 mb-6 text-sm sm:text-base">
                            Thank you, <span className="font-semibold text-gray-800">{shippingData.firstName}</span>. Your order has been placed and is being prepared for shipment.
                        </p>

                        {/* Prominent Tracking ID Box */}
                        <div className="bg-emerald-50/70 border-2 border-dashed border-emerald-300 rounded-2xl p-5 sm:p-6 mb-6 text-left">
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                                    Your Official Tracking ID
                                </span>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-semibold">
                                    Active
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-emerald-200">
                                <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-700 tracking-wider select-all">
                                    {trackingId}
                                </span>
                                <button
                                    onClick={handleCopyTracking}
                                    type="button"
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
                                >
                                    <Copy size={15} />
                                    Copy Tracking ID
                                </button>
                            </div>

                            <p className="text-xs text-gray-500 mt-2.5">
                                Keep this Tracking ID safe to check your live shipment status anytime.
                            </p>
                        </div>

                        {/* WhatsApp Notification Card */}
                        <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-5 mb-6 text-left">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                                    <MessageSquare size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 text-sm">
                                        Send Order & Tracking Details to WhatsApp
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-0.5 mb-3">
                                        Click below to send your order details & Tracking ID directly to our WhatsApp support (+91 8969124404) for quick confirmation and live tracking updates.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <a
                                            href={whatsappCompanyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                                        >
                                            <MessageSquare size={16} />
                                            Send to Company WhatsApp (+91 8969124404)
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Mini Box */}
                        <div className="border border-gray-100 rounded-xl p-4 text-left text-xs space-y-2 mb-8 bg-gray-50/50">
                            <div className="flex justify-between text-gray-600">
                                <span>Phone Number:</span>
                                <span className="font-semibold text-gray-800">{shippingData.phone}</span>
                            </div>
                            {shippingData.email && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Email:</span>
                                    <span className="font-semibold text-gray-800">{shippingData.email}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Address:</span>
                                <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">
                                    {shippingData.address}, {shippingData.city} ({shippingData.pincode})
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Payment Status:</span>
                                <span className="font-semibold text-emerald-600 uppercase">Paid (Online)</span>
                            </div>
                            <div className="flex justify-between text-gray-600 pt-1 border-t border-gray-200/60">
                                <span>Total Paid:</span>
                                <span className="font-bold text-gray-900 text-sm">₹{finalTotal}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href={`/track-order?orderId=${encodeURIComponent(trackingId)}&phone=${encodeURIComponent(cleanPhone)}`} className="flex-1">
                                <Button variant="primary" size="lg" fullWidth>
                                    Track Order Now
                                </Button>
                            </Link>
                            <Link href="/" className="flex-1">
                                <Button variant="outline" size="lg" fullWidth>
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
        <div className="min-h-screen pt-20 sm:pt-24 bg-[var(--color-cream)] w-full max-w-full overflow-x-hidden" suppressHydrationWarning>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            {/* Header */}
            <section className="bg-white py-4 sm:py-6 border-b w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/cart" className="inline-flex items-center gap-2 text-sm sm:text-base text-[var(--color-text-light)] hover:text-[var(--color-primary)] mb-3 sm:mb-4">
                        <ChevronLeft size={18} />
                        Back to Cart
                    </Link>
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold">Checkout</h1>

                    {/* Steps */}
                    <div className="flex items-center gap-2 sm:gap-4 mt-4 sm:mt-6 max-w-md">
                        <div className={`flex items-center gap-1.5 sm:gap-2 ${step >= 1 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${step >= 1 ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-secondary)]'}`}>
                                {step > 1 ? '✓' : '1'}
                            </div>
                            <span className="font-medium text-xs sm:text-sm">Shipping</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-[var(--color-secondary)] min-w-[20px]" />
                        <div className={`flex items-center gap-1.5 sm:gap-2 ${step >= 2 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${step >= 2 ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-secondary)]'}`}>
                                2
                            </div>
                            <span className="font-medium text-xs sm:text-sm">Payment</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Checkout Content */}
            <section className="py-6 sm:py-12 w-full">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Forms */}
                        <div className="lg:col-span-2 w-full max-w-full">
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 w-full max-w-full box-border"
                                >
                                    <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                                        <Truck className="text-[var(--color-primary)] flex-shrink-0" size={22} />
                                        <h2 className="font-heading text-lg sm:text-xl font-semibold">Shipping Information</h2>
                                    </div>

                                    <form onSubmit={handleShippingSubmit} className="space-y-4 sm:space-y-6 w-full">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                                            <div className="w-full">
                                                <label className="block text-xs sm:text-sm font-medium mb-1.5">First Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={shippingData.firstName}
                                                    onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                                                    className="w-full box-border px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                            </div>
                                            <div className="w-full">
                                                <label className="block text-xs sm:text-sm font-medium mb-1.5">Last Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={shippingData.lastName}
                                                    onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                                                    className="w-full box-border px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                                            <div className="w-full">
                                                <label className="block text-xs sm:text-sm font-medium mb-1.5">
                                                    Email <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    value={shippingData.email}
                                                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                                                    placeholder="name@example.com (optional)"
                                                    className="w-full box-border px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                            </div>
                                            <div className="w-full">
                                                <label className="block text-xs sm:text-sm font-medium mb-1.5">Phone *</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={shippingData.phone}
                                                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                                                    className="w-full box-border px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <label className="block text-xs sm:text-sm font-medium mb-1.5">Address *</label>
                                            <input
                                                type="text"
                                                required
                                                value={shippingData.address}
                                                onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                                className="w-full box-border px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                placeholder="Street address, apartment, etc."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                                            <div className="w-full">
                                                <label className="block text-xs sm:text-sm font-medium mb-1.5">City *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={shippingData.city}
                                                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                                    className="w-full box-border px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                            </div>
                                            <div className="w-full">
                                                <label className="block text-xs sm:text-sm font-medium mb-1.5">State *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={shippingData.state}
                                                    onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                                                    className="w-full box-border px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                            </div>
                                            <div className="w-full">
                                                <label className="block text-xs sm:text-sm font-medium mb-1.5">PIN Code *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={shippingData.pincode}
                                                    onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                                                    className="w-full box-border px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-[var(--color-secondary)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <Button type="submit" variant="primary" size="lg" fullWidth>
                                                Continue to Payment
                                            </Button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 w-full max-w-full box-border"
                                >
                                    <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                                        <CreditCard className="text-[var(--color-primary)] flex-shrink-0" size={22} />
                                        <h2 className="font-heading text-lg sm:text-xl font-semibold">Payment Method</h2>
                                    </div>

                                    <div className="space-y-4 mb-6 sm:mb-8 w-full">
                                        {[
                                            { id: 'online', label: 'Online Payment (Razorpay)', description: 'UPI (GPay, PhonePe, Paytm), Cards, NetBanking', icon: '💳' },
                                        ].map((method) => (
                                            <label
                                                key={method.id}
                                                className={`flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 border-2 rounded-xl cursor-pointer transition-colors w-full box-border ${paymentMethod === method.id
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
                                                <span className="text-xl sm:text-2xl mt-0.5 sm:mt-1 flex-shrink-0">{method.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center justify-between gap-1">
                                                        <span className="font-medium text-sm sm:text-base block">{method.label}</span>
                                                        <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold whitespace-nowrap">100% Secure</span>
                                                    </div>
                                                    <span className="text-xs sm:text-sm text-gray-500 block mt-0.5">{method.description}</span>
                                                </div>
                                                {paymentMethod === method.id && (
                                                    <Check size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-1" />
                                                )}
                                            </label>
                                        ))}
                                    </div>

                                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                                        <Button variant="outline" onClick={() => setStep(1)} disabled={isProcessing} className="w-full sm:w-auto">
                                            Back
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            fullWidth
                                            loading={isProcessing}
                                            onClick={handlePlaceOrder}
                                            className="w-full"
                                        >
                                            {isProcessing ? 'Processing...' : `Pay ${formatPrice(finalTotal)}`}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1 w-full max-w-full">
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 sticky top-24 sm:top-28 w-full box-border">
                                <h2 className="font-heading text-xl font-semibold mb-6">Order Summary</h2>

                                {/* Items */}
                                <div className="space-y-4 max-h-60 overflow-y-auto mb-6">
                                    {items.map((item) => (
                                        <div key={`${item.product.id}-${item.variant?.id || item.product.id}`} className="flex gap-3">
                                            <div className="w-16 h-16 bg-[var(--color-cream)] rounded-lg flex-shrink-0 overflow-hidden relative">
                                                {item.product.images?.[0] ? (
                                                    <img
                                                        src={(() => {
                                                            const img = item.product.images?.[0];
                                                            if (!img) return '/images/products/product-1.png';
                                                            if (img.startsWith('http')) return img;
                                                            if (img.startsWith('/')) return img;
                                                            return `/images/products/${img}`;
                                                        })()}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = '/images/products/product-1.png';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-2xl">🌿</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                                                <p className="text-xs text-[var(--color-text-light)]">{item.variant?.name || 'Standard'} × {item.quantity}</p>
                                            </div>
                                            <p className="font-medium text-sm">
                                                {formatPrice((item.variant?.price ?? item.product.price) * item.quantity)}
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
                                                icon={<Tag size={16} />}
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
