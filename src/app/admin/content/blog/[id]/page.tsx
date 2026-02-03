'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Save,
    Eye,
    Upload,
    Bold,
    Italic,
    List,
    Link as LinkIcon,
    Image as ImageIcon,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock blog posts for editing
const mockPosts: Record<string, any> = {
    '1': {
        title: 'The Ultimate Guide to Moringa Benefits',
        excerpt: 'Discover the incredible health benefits of moringa and how it can transform your wellness routine.',
        content: 'Moringa, often called the "Miracle Tree," has been used for centuries in traditional medicine...',
        author: 'Dr. Priya Sharma',
        category: 'Health',
        status: 'published',
    },
    '2': {
        title: '5 Delicious Moringa Smoothie Recipes',
        excerpt: 'Try these amazing smoothie recipes packed with moringa powder for a nutritious boost.',
        content: 'Start your day with these nutrient-packed moringa smoothie recipes...',
        author: 'Chef Rahul',
        category: 'Recipes',
        status: 'published',
    },
    '3': {
        title: 'How to Incorporate Superfoods into Your Daily Diet',
        excerpt: 'A practical guide to adding superfoods like moringa to your everyday meals.',
        content: 'Superfoods are nutrient-dense foods that provide exceptional health benefits...',
        author: 'Nutritionist Anita',
        category: 'Wellness',
        status: 'draft',
    },
};

export default function EditBlogPostPage() {
    const params = useParams();
    const postId = params.id as string;
    const post = mockPosts[postId] || mockPosts['1'];

    const [formData, setFormData] = useState({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        status: post.status,
        author: post.author,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/content/blog"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
                        <p className="text-gray-500">Update blog post content</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Eye size={18} />
                        Preview
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={18} />
                        Delete
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium">
                        <Save size={18} />
                        Update
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter post title..."
                            className="w-full text-2xl font-bold border-none outline-none placeholder-gray-300"
                        />
                    </div>

                    {/* Editor */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                <Bold size={18} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                <Italic size={18} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                <List size={18} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                <LinkIcon size={18} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                <ImageIcon size={18} />
                            </button>
                        </div>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your post content..."
                            rows={15}
                            className="w-full border-none outline-none resize-none placeholder-gray-400"
                        />
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            placeholder="Write a short summary..."
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Publish Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Publish Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option>Health</option>
                                    <option>Recipes</option>
                                    <option>Wellness</option>
                                    <option>Education</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Featured Image</h3>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">SEO Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                                <input
                                    type="text"
                                    defaultValue={formData.title}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                                <textarea
                                    rows={2}
                                    defaultValue={formData.excerpt}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
