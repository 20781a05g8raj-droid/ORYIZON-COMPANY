'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ChevronDown,
    ChevronUp,
    X,
    Save
} from 'lucide-react';

// Mock FAQ data
const mockFAQs = [
    {
        id: '1',
        question: 'What is Moringa and what are its benefits?',
        answer: 'Moringa is a nutrient-rich plant known as the "Miracle Tree". It contains vitamins, minerals, and antioxidants that support overall health, boost energy, and strengthen immunity.',
        category: 'General',
        order: 1,
    },
    {
        id: '2',
        question: 'How do I consume Moringa powder?',
        answer: 'You can mix 1-2 teaspoons of Moringa powder in water, smoothies, juices, or sprinkle it on your food. Start with a smaller amount and gradually increase.',
        category: 'Usage',
        order: 2,
    },
    {
        id: '3',
        question: 'Is your Moringa organic?',
        answer: 'Yes! Our Moringa is 100% certified organic, sourced from sustainable farms without any pesticides or artificial additives.',
        category: 'Product',
        order: 3,
    },
    {
        id: '4',
        question: 'What is your return policy?',
        answer: 'We offer a 30-day satisfaction guarantee. If you are not happy with your purchase, you can return the unused product for a full refund.',
        category: 'Shipping',
        order: 4,
    },
];

export default function FAQManagementPage() {
    const [faqs, setFaqs] = useState(mockFAQs);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
                    <p className="text-gray-500">Manage frequently asked questions</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                >
                    <Plus size={20} />
                    Add FAQ
                </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option>All Categories</option>
                        <option>General</option>
                        <option>Usage</option>
                        <option>Product</option>
                        <option>Shipping</option>
                    </select>
                </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
                {faqs.map((faq, index) => (
                    <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                            onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-medium text-sm">
                                    {faq.order}
                                </span>
                                <div>
                                    <h3 className="font-medium text-gray-900">{faq.question}</h3>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{faq.category}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                                {expandedId === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>
                        <AnimatePresence>
                            {expandedId === faq.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                                        <p className="text-gray-600">{faq.answer}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Add FAQ Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-xl w-full max-w-lg"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Add New FAQ</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                                    <input
                                        type="text"
                                        placeholder="Enter the question..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Enter the answer..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                        <option>General</option>
                                        <option>Usage</option>
                                        <option>Product</option>
                                        <option>Shipping</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                                    <Save size={18} />
                                    Save FAQ
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
