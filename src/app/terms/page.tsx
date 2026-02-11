'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SITE_CONFIG } from '@/lib/constants';

export default function TermsPage() {
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
                        Terms & Conditions
                    </motion.h1>
                    <p className="text-white/80 mt-2">Last updated: February 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
                    <h2>1. Agreement to Terms</h2>
                    <p>
                        By accessing or using the {SITE_CONFIG.name} website, you agree to be bound by
                        these Terms and Conditions. If you do not agree to these terms, please do not
                        use our website or services.
                    </p>

                    <h2>2. Use of Our Website</h2>
                    <p>You agree to use our website only for lawful purposes and in a way that does not:</p>
                    <ul>
                        <li>Infringe the rights of others</li>
                        <li>Restrict or inhibit anyone else&apos;s use of the website</li>
                        <li>Violate any applicable laws or regulations</li>
                        <li>Transmit harmful or malicious content</li>
                    </ul>

                    <h2>3. Products and Pricing</h2>
                    <ul>
                        <li>All prices are listed in Indian Rupees (₹) and include applicable taxes</li>
                        <li>We reserve the right to modify prices without prior notice</li>
                        <li>Product images are for illustration purposes and may vary slightly</li>
                        <li>We strive for accuracy but cannot guarantee all information is error-free</li>
                    </ul>

                    <h2>4. Orders and Payment</h2>
                    <ul>
                        <li>By placing an order, you make an offer to purchase products</li>
                        <li>We reserve the right to accept or reject orders at our discretion</li>
                        <li>Payment must be completed at the time of order placement</li>
                        <li>We accept major credit/debit cards, UPI, net banking, and Cash on Delivery</li>
                    </ul>

                    <h2>5. Shipping and Delivery</h2>
                    <p>
                        Please refer to our <a href="/shipping-returns">Shipping & Returns</a> page for
                        detailed information about delivery times, shipping costs, and our return policy.
                    </p>

                    <h2>6. Returns and Refunds</h2>
                    <ul>
                        <li>Products can be returned within 7 days of delivery</li>
                        <li>Items must be unused and in original packaging</li>
                        <li>Refunds will be processed within 5-7 business days</li>
                        <li>Shipping costs for returns may apply</li>
                    </ul>

                    <h2>7. Intellectual Property</h2>
                    <p>
                        All content on this website, including text, graphics, logos, images, and software,
                        is the property of {SITE_CONFIG.name} and is protected by intellectual property laws.
                    </p>

                    <h2>8. Disclaimer of Warranties</h2>
                    <p>
                        Our products are dietary supplements and are not intended to diagnose, treat, cure,
                        or prevent any disease. Results may vary. Always consult a healthcare professional
                        before starting any supplement regimen.
                    </p>

                    <h2>9. Limitation of Liability</h2>
                    <p>
                        {SITE_CONFIG.name} shall not be liable for any indirect, incidental, special, or
                        consequential damages arising from the use of our products or services.
                    </p>

                    <h2>10. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of India.
                        Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, India.
                    </p>

                    <h2>11. Changes to Terms</h2>
                    <p>
                        We may update these Terms at any time. Continued use of the website after changes
                        constitutes acceptance of the modified Terms.
                    </p>

                    <h2>12. Contact Information</h2>
                    <p>For questions about these Terms, contact us at:</p>
                    <ul>
                        <li>Email: {SITE_CONFIG.email}</li>
                        <li>Phone: {SITE_CONFIG.phone}</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
