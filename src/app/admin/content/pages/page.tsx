'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    FileText,
    Globe
} from 'lucide-react';
import Link from 'next/link';

// Mock pages data
const mockPages = [
    { id: '1', title: 'About Us', slug: '/about', status: 'published', updatedAt: '2024-01-28' },
    { id: '2', title: 'Contact', slug: '/contact', status: 'published', updatedAt: '2024-01-25' },
    { id: '3', title: 'Terms of Service', slug: '/terms', status: 'published', updatedAt: '2024-01-20' },
    { id: '4', title: 'Privacy Policy', slug: '/privacy-policy', status: 'published', updatedAt: '2024-01-20' },
    { id: '5', title: 'Shipping & Returns', slug: '/shipping-returns', status: 'published', updatedAt: '2024-01-15' },
    { id: '6', title: 'FAQ', slug: '/faq', status: 'published', updatedAt: '2024-01-10' },
];

const statusColors: Record<string, string> = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
};

export default function PagesManagementPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
                    <p className="text-gray-500">Manage static pages on your website</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium">
                    <Plus size={20} />
                    New Page
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search pages..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>

            {/* Pages List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                {mockPages.map((page, index) => (
                    <motion.div
                        key={page.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FileText size={20} className="text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{page.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Globe size={14} />
                                    <span>{page.slug}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">{page.updatedAt}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[page.status]}`}>
                                {page.status}
                            </span>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={page.slug}
                                    target="_blank"
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                >
                                    <Eye size={16} />
                                </Link>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                                    <Edit size={16} />
                                </button>
                                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
