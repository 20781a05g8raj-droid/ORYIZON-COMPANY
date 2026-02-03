'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SITE_CONFIG } from '@/lib/constants';

export default function PrivacyPolicyPage() {
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
                        Privacy Policy
                    </motion.h1>
                    <p className="text-white/80 mt-2">Last updated: February 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to {SITE_CONFIG.name}. We are committed to protecting your personal
                        information and your right to privacy. This Privacy Policy explains how we collect,
                        use, disclose, and safeguard your information when you visit our website.
                    </p>

                    <h2>2. Information We Collect</h2>
                    <h3>Personal Information</h3>
                    <p>We may collect personal information that you voluntarily provide to us, including:</p>
                    <ul>
                        <li>Name and contact information (email, phone number, address)</li>
                        <li>Payment information (credit card details, billing address)</li>
                        <li>Account credentials</li>
                        <li>Order history and preferences</li>
                    </ul>

                    <h3>Automatically Collected Information</h3>
                    <p>When you visit our website, we automatically collect:</p>
                    <ul>
                        <li>Device and browser information</li>
                        <li>IP address</li>
                        <li>Browsing behavior and page views</li>
                        <li>Cookies and similar technologies</li>
                    </ul>

                    <h2>3. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Process and fulfill your orders</li>
                        <li>Communicate with you about your orders and account</li>
                        <li>Send promotional emails (with your consent)</li>
                        <li>Improve our website and services</li>
                        <li>Prevent fraud and ensure security</li>
                        <li>Comply with legal obligations</li>
                    </ul>

                    <h2>4. Information Sharing</h2>
                    <p>
                        We do not sell your personal information. We may share your information with:
                    </p>
                    <ul>
                        <li>Payment processors to complete transactions</li>
                        <li>Shipping partners to deliver your orders</li>
                        <li>Analytics providers to improve our services</li>
                        <li>Legal authorities when required by law</li>
                    </ul>

                    <h2>5. Cookies</h2>
                    <p>
                        We use cookies to enhance your browsing experience. You can control cookie
                        settings through your browser. Essential cookies are necessary for the website
                        to function properly.
                    </p>

                    <h2>6. Data Security</h2>
                    <p>
                        We implement appropriate security measures to protect your personal information.
                        However, no method of transmission over the internet is 100% secure.
                    </p>

                    <h2>7. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal information</li>
                        <li>Correct inaccurate information</li>
                        <li>Request deletion of your information</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Lodge a complaint with data protection authorities</li>
                    </ul>

                    <h2>8. Contact Us</h2>
                    <p>
                        If you have questions about this Privacy Policy, please contact us at:
                    </p>
                    <ul>
                        <li>Email: {SITE_CONFIG.email}</li>
                        <li>Phone: {SITE_CONFIG.phone}</li>
                        <li>Address: {SITE_CONFIG.address}</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
