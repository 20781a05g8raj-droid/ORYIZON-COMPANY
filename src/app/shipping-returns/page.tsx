'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, RotateCcw, Package, Clock, MapPin, CreditCard } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { getShippingSettings, type ShippingSettings } from '@/lib/api/settings';

export default function ShippingReturnsPage() {
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

    return (
        <div className="min-h-screen pt-24">
            {/* Hero */}
            <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-heading text-4xl font-bold text-white"
                    >
                        Shipping & Returns
                    </motion.h1>
                    <p className="text-white/80 mt-2">Everything you need to know about delivery and returns</p>
                </div>
            </section>

            {/* Quick Info */}
            <section className="py-12 bg-[var(--color-cream)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { icon: <Truck size={28} />, title: 'Free Shipping', desc: `On orders over ${formatPrice(shippingSettings.freeShippingThreshold)}` },
                            { icon: <Clock size={28} />, title: 'Fast Delivery', desc: `${shippingSettings.deliveryTime.standard}` },
                            { icon: <RotateCcw size={28} />, title: 'Easy Returns', desc: '7-day return policy' },
                            { icon: <CreditCard size={28} />, title: 'Secure Payment', desc: 'Multiple payment options' },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl p-6 text-center"
                            >
                                <div className="w-14 h-14 bg-[var(--color-secondary)] rounded-xl flex items-center justify-center mx-auto mb-4 text-[var(--color-primary)]">
                                    {item.icon}
                                </div>
                                <h3 className="font-semibold mb-1">{item.title}</h3>
                                <p className="text-sm text-[var(--color-text-light)]">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        {/* Shipping */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Package className="text-[var(--color-primary)]" size={28} />
                                <h2 className="font-heading text-2xl font-bold">Shipping Information</h2>
                            </div>

                            <div className="bg-[var(--color-cream)] rounded-xl p-6 mb-6">
                                <h3 className="font-semibold mb-4">Shipping Rates</h3>
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b">
                                            <th className="pb-2">Order Value</th>
                                            <th className="pb-2">Shipping Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="py-3">Under {formatPrice(shippingSettings.freeShippingThreshold)}</td>
                                            <td className="py-3">{formatPrice(shippingSettings.standardShipping)}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3">{formatPrice(shippingSettings.freeShippingThreshold)} and above</td>
                                            <td className="py-3 text-green-600 font-semibold">FREE</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="space-y-4 text-[var(--color-text-light)]">
                                <h3 className="font-semibold text-[var(--color-text)]">Delivery Times</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Metro cities (Mumbai, Delhi, Bangalore, etc.): 3-5 business days</li>
                                    <li>Tier 2 cities: 5-7 business days</li>
                                    <li>Other areas: 7-10 business days</li>
                                    <li>Remote locations may take additional time</li>
                                </ul>

                                <h3 className="font-semibold text-[var(--color-text)] pt-4">Order Processing</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Orders are processed within 1-2 business days</li>
                                    <li>You will receive a confirmation email with tracking information</li>
                                    <li>Orders placed after 2 PM will be processed the next business day</li>
                                    <li>We do not ship on Sundays and public holidays</li>
                                </ul>

                                <h3 className="font-semibold text-[var(--color-text)] pt-4">Tracking Your Order</h3>
                                <p>
                                    Once your order is shipped, you will receive an email with your tracking number.
                                    You can track your order on our partner courier&apos;s website or by contacting our
                                    customer support.
                                </p>
                            </div>
                        </div>

                        {/* Returns */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <RotateCcw className="text-[var(--color-primary)]" size={28} />
                                <h2 className="font-heading text-2xl font-bold">Returns & Refunds</h2>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                                <h3 className="font-semibold text-green-800 mb-2">7-Day Money Back Guarantee</h3>
                                <p className="text-green-700">
                                    We stand behind the quality of our products. If you&apos;re not satisfied,
                                    return it within 7 days for a full refund.
                                </p>
                            </div>

                            <div className="space-y-4 text-[var(--color-text-light)]">
                                <h3 className="font-semibold text-[var(--color-text)]">Return Eligibility</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Products must be returned within 7 days of delivery</li>
                                    <li>Unused products in original, sealed packaging</li>
                                    <li>Damaged or defective products (report within 48 hours)</li>
                                    <li>Wrong product delivered</li>
                                </ul>

                                <h3 className="font-semibold text-[var(--color-text)] pt-4">Non-Returnable Items</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Opened or used products (unless defective)</li>
                                    <li>Products damaged due to misuse</li>
                                    <li>Free samples or promotional items</li>
                                </ul>

                                <h3 className="font-semibold text-[var(--color-text)] pt-4">How to Return</h3>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>Contact our customer support at {SITE_CONFIG.email}</li>
                                    <li>Provide your order number and reason for return</li>
                                    <li>We will arrange for pickup or provide a return shipping label</li>
                                    <li>Pack the product securely in original packaging</li>
                                </ol>

                                <h3 className="font-semibold text-[var(--color-text)] pt-4">Refund Process</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Refunds are processed within 5-7 business days of receiving the return</li>
                                    <li>Refund will be credited to the original payment method</li>
                                    <li>Bank processing may take an additional 3-5 business days</li>
                                    <li>You will receive an email confirmation when refund is processed</li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="bg-[var(--color-cream)] rounded-xl p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="text-[var(--color-primary)]" size={24} />
                                <h3 className="font-heading text-xl font-semibold">Need Help?</h3>
                            </div>
                            <p className="text-[var(--color-text-light)] mb-4">
                                For any questions about shipping or returns, please don&apos;t hesitate to contact us.
                            </p>
                            <ul className="space-y-2">
                                <li>Email: {SITE_CONFIG.email}</li>
                                <li>Phone: {SITE_CONFIG.phone}</li>
                                <li>WhatsApp: +91 {SITE_CONFIG.whatsapp}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
