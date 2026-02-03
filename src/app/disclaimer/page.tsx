'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export default function DisclaimerPage() {
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
                        Disclaimer
                    </motion.h1>
                    <p className="text-white/80 mt-2">Important information about our products</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Important Notice */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                                <p className="text-yellow-700">
                                    The information provided on this website is for general informational purposes only.
                                    Our products are dietary supplements and are not intended to diagnose, treat, cure,
                                    or prevent any disease.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-lg">
                        <h2>Medical Disclaimer</h2>
                        <p>
                            {SITE_CONFIG.name} products are dietary supplements made from natural ingredients.
                            They are intended to supplement the diet and should not be used as a substitute
                            for a varied diet or healthy lifestyle.
                        </p>
                        <ul>
                            <li>These statements have not been evaluated by the Food Safety and Standards Authority of India (FSSAI)</li>
                            <li>Our products are not intended to diagnose, treat, cure, or prevent any disease</li>
                            <li>Results may vary from person to person</li>
                            <li>Individual experiences are not guaranteed</li>
                        </ul>

                        <h2>Consult a Healthcare Professional</h2>
                        <p>We strongly recommend that you:</p>
                        <ul>
                            <li>Consult with a qualified healthcare professional before starting any supplement regimen</li>
                            <li>Inform your doctor of any supplements you are taking</li>
                            <li>Seek medical advice if you are pregnant, nursing, or have a medical condition</li>
                            <li>Stop use and consult a doctor if you experience any adverse reactions</li>
                        </ul>

                        <h2>Allergy Information</h2>
                        <p>
                            Our products are manufactured in facilities that may also process tree nuts,
                            peanuts, wheat, soy, and other common allergens. If you have known allergies,
                            please read the product labels carefully and consult your doctor before use.
                        </p>

                        <h2>Product Information Accuracy</h2>
                        <p>
                            We strive to provide accurate and up-to-date product information, including
                            ingredients, nutritional facts, and usage instructions. However:
                        </p>
                        <ul>
                            <li>Information may change without notice</li>
                            <li>Images are for illustrative purposes and may not reflect the actual product</li>
                            <li>Always read product labels for the most accurate information</li>
                        </ul>

                        <h2>Third-Party Links</h2>
                        <p>
                            Our website may contain links to third-party websites. We are not responsible
                            for the content, accuracy, or practices of these external sites. These links
                            are provided for convenience only.
                        </p>

                        <h2>Testimonials</h2>
                        <p>
                            Customer testimonials and reviews represent individual experiences and opinions.
                            Individual results may vary. Testimonials are not intended to make claims about
                            the effectiveness of our products.
                        </p>

                        <h2>Limitation of Liability</h2>
                        <p>
                            To the fullest extent permitted by law, {SITE_CONFIG.name} shall not be liable
                            for any direct, indirect, incidental, special, or consequential damages arising
                            from the use or inability to use our products.
                        </p>

                        <h2>Age Restrictions</h2>
                        <p>
                            Our products are intended for adult use only. Keep out of reach of children.
                            If you are under 18 years of age, please consult a parent or guardian before
                            using any dietary supplement.
                        </p>

                        <h2>Storage and Handling</h2>
                        <p>
                            For best results, store products in a cool, dry place away from direct sunlight.
                            Do not use if the safety seal is broken or missing. See product labels for
                            specific storage instructions and expiration dates.
                        </p>

                        <h2>Regulatory Compliance</h2>
                        <p>
                            {SITE_CONFIG.name} complies with all applicable food safety regulations in India,
                            including FSSAI guidelines for dietary supplements. Our products bear the
                            required certifications and license numbers on their labels.
                        </p>

                        <h2>Contact for Health Concerns</h2>
                        <p>
                            If you have any health concerns or questions about whether our products are
                            right for you, please consult a healthcare professional or contact us at:
                        </p>
                        <ul>
                            <li>Email: {SITE_CONFIG.email}</li>
                            <li>Phone: {SITE_CONFIG.phone}</li>
                        </ul>

                        <p className="text-sm text-[var(--color-text-muted)] mt-8">
                            This disclaimer was last updated in February 2026 and applies to all products
                            sold by {SITE_CONFIG.name}.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
