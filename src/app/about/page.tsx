'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Leaf, Heart, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CERTIFICATIONS } from '@/lib/constants';

export default function AboutPage() {
    const [leaves, setLeaves] = React.useState<Array<{ left: string; top: string; duration: number; delay: number }>>([]);

    React.useEffect(() => {
        setLeaves([...Array(15)].map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: 5 + Math.random() * 5,
            delay: Math.random() * 2
        })));
    }, []);

    return (
        <div className="min-h-screen pt-24">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    {leaves.map((leaf, i) => (
                        <motion.div
                            key={i}
                            animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
                            transition={{ duration: leaf.duration, repeat: Infinity, delay: leaf.delay }}
                            className="absolute text-6xl"
                            style={{ left: leaf.left, top: leaf.top }}
                        >
                            🍃
                        </motion.div>
                    ))}
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[var(--color-accent)] font-medium uppercase tracking-wider text-sm"
                        >
                            Our Story
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-heading text-4xl md:text-6xl font-bold mt-4 mb-6"
                        >
                            Bringing Nature&apos;s Best <br />
                            <span className="text-[var(--color-accent)]">To Your Doorstep</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-white/80"
                        >
                            We believe everyone deserves access to pure, powerful nutrition from nature.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[var(--color-accent)] font-medium uppercase tracking-wider text-sm">
                                Our Mission
                            </span>
                            <h2 className="font-heading text-4xl font-bold mt-2 mb-6">
                                Empowering Health Through{' '}
                                <span className="text-[var(--color-primary)]">Nature</span>
                            </h2>
                            <div className="space-y-4 text-[var(--color-text-light)] text-lg">
                                <p>
                                    Moringa Pure was founded with a simple mission: to make the incredible
                                    benefits of Moringa accessible to everyone. Known as the &quot;Miracle Tree,&quot;
                                    Moringa has been used for centuries in traditional Ayurvedic medicine
                                    and is now recognized globally as one of nature&apos;s most nutrient-dense
                                    superfoods.
                                </p>
                                <p>
                                    We partner directly with certified organic farms in South India, where
                                    Moringa trees have thrived for generations. Every step of our process—from
                                    harvesting to packaging—is carefully controlled to ensure you receive the
                                    purest, most potent Moringa available.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-6"
                        >
                            {[
                                { icon: <Leaf size={32} />, title: '100% Organic', desc: 'Certified organic farms' },
                                { icon: <Heart size={32} />, title: 'Pure & Natural', desc: 'No additives or fillers' },
                                { icon: <Award size={32} />, title: 'Lab Tested', desc: 'Third-party verified' },
                                { icon: <Users size={32} />, title: '10,000+ Customers', desc: 'Trusted nationwide' },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 bg-[var(--color-cream)] rounded-2xl"
                                >
                                    <div className="w-14 h-14 bg-[var(--color-primary)] text-white rounded-xl flex items-center justify-center mb-4">
                                        {item.icon}
                                    </div>
                                    <h3 className="font-heading font-semibold text-lg mb-1">{item.title}</h3>
                                    <p className="text-sm text-[var(--color-text-light)]">{item.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Farm to Powder Journey */}
            <section className="py-20 bg-[var(--color-cream)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-[var(--color-accent)] font-medium uppercase tracking-wider text-sm">
                            Our Process
                        </span>
                        <h2 className="font-heading text-4xl md:text-5xl font-bold mt-2 mb-4">
                            From Farm to Your Table
                        </h2>
                        <p className="text-[var(--color-text-light)] max-w-2xl mx-auto text-lg">
                            Every step is carefully monitored to ensure the highest quality product.
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-[var(--color-primary)] -translate-y-1/2" />

                        <div className="grid lg:grid-cols-5 gap-8">
                            {[
                                { step: '01', title: 'Organic Farming', desc: 'Moringa grown without pesticides on certified organic farms in South India', icon: '🌱' },
                                { step: '02', title: 'Hand Harvesting', desc: 'Leaves carefully hand-picked at peak nutrition by experienced farmers', icon: '✋' },
                                { step: '03', title: 'Gentle Drying', desc: 'Low-temperature drying preserves nutrients and natural color', icon: '☀️' },
                                { step: '04', title: 'Lab Testing', desc: 'Every batch tested by third-party labs for purity and potency', icon: '🔬' },
                                { step: '05', title: 'Fresh Packaging', desc: 'Sealed immediately to lock in freshness and shipped to you', icon: '📦' },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative text-center"
                                >
                                    {/* Step Circle */}
                                    <div className="relative z-10 mx-auto w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center text-4xl mb-4">
                                        {item.icon}
                                    </div>
                                    <div className="bg-white rounded-xl p-6 shadow-sm">
                                        <span className="text-[var(--color-accent)] font-bold">{item.step}</span>
                                        <h3 className="font-heading font-semibold text-lg my-2">{item.title}</h3>
                                        <p className="text-sm text-[var(--color-text-light)]">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-[var(--color-accent)] font-medium uppercase tracking-wider text-sm">
                            What We Stand For
                        </span>
                        <h2 className="font-heading text-4xl md:text-5xl font-bold mt-2 mb-4">
                            Our Values
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Quality First',
                                desc: 'We never compromise on quality. Every product is tested and verified to meet the highest standards.',
                                icon: '🏆',
                            },
                            {
                                title: 'Sustainability',
                                desc: 'Our farming practices support the environment and local communities for generations to come.',
                                icon: '🌍',
                            },
                            {
                                title: 'Transparency',
                                desc: 'We believe you have the right to know exactly what\'s in your supplements and where it comes from.',
                                icon: '🔍',
                            },
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="p-8 bg-[var(--color-cream)] rounded-2xl text-center"
                            >
                                <span className="text-5xl block mb-4">{value.icon}</span>
                                <h3 className="font-heading text-2xl font-semibold mb-3">{value.title}</h3>
                                <p className="text-[var(--color-text-light)]">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certifications */}
            <section className="py-20 bg-[var(--color-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                            Our Certifications
                        </h2>
                        <p className="text-white/80 max-w-2xl mx-auto">
                            We hold ourselves to the highest standards and our certifications prove it.
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-6">
                        {CERTIFICATIONS.map((cert, index) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white rounded-xl p-6 text-center min-w-[150px]"
                            >
                                <span className="text-4xl block mb-2">{cert.icon}</span>
                                <h4 className="font-semibold">{cert.name}</h4>
                                <p className="text-xs text-[var(--color-text-light)] mt-1">{cert.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-[var(--color-cream)]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-heading text-4xl font-bold mb-4">
                            Ready to Start Your Wellness Journey?
                        </h2>
                        <p className="text-[var(--color-text-light)] text-lg mb-8">
                            Experience the power of pure, organic Moringa today.
                        </p>
                        <Link href="/products">
                            <Button variant="primary" size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
                                Shop Now
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
