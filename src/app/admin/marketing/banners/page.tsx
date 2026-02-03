'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Image as ImageIcon,
    Calendar,
    X,
    Save,
    Upload,
    Loader2
} from 'lucide-react';
import { getBanners, createBanner, updateBanner, deleteBanner } from '@/lib/api/banners';
import type { Banner, BannerInsert } from '@/types/database';
import { toast } from 'react-hot-toast';

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    // Form state
    const [formData, setFormData] = useState<Partial<BannerInsert>>({
        title: '',
        description: '',
        image_url: '',
        link: '',
        active: true,
        sort_order: 0
    });

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const data = await getBanners();
            setBanners(data);
        } catch (error) {
            console.error('Error fetching banners:', error);
            toast.error('Failed to load banners');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;
        try {
            await deleteBanner(id);
            setBanners(banners.filter(b => b.id !== id));
            toast.success('Banner deleted successfully');
        } catch (error) {
            console.error('Error deleting banner:', error);
            toast.error('Failed to delete banner');
        }
    };

    const handleEdit = (banner: Banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title,
            description: banner.description || '',
            image_url: banner.image_url,
            link: banner.link || '',
            active: banner.active,
            sort_order: banner.sort_order || 0
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        try {
            if (!formData.title || !formData.image_url) {
                toast.error('Title and Image URL are required');
                return;
            }

            if (editingBanner) {
                await updateBanner(editingBanner.id, formData);
                toast.success('Banner updated successfully');
            } else {
                await createBanner(formData as BannerInsert);
                toast.success('Banner created successfully');
            }
            setShowModal(false);
            setEditingBanner(null);
            fetchBanners();
        } catch (error) {
            console.error('Error saving banner:', error);
            toast.error('Failed to save banner');
        }
    };

    const resetForm = () => {
        setEditingBanner(null);
        setFormData({
            title: '',
            description: '',
            image_url: '',
            link: '',
            active: true,
            sort_order: 0
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Promotional Banners</h1>
                    <p className="text-gray-500">Manage website banners and promotions</p>
                </div>
                <button
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                >
                    <Plus size={20} />
                    Add Banner
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-emerald-600" size={32} />
                </div>
            ) : (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Active Banners', value: banners.filter(b => b.active).length.toString(), color: 'text-green-600' },
                            { label: 'Total Banners', value: banners.length.toString(), color: 'text-blue-600' },
                            { label: 'Inactive', value: banners.filter(b => !b.active).length.toString(), color: 'text-gray-600' },
                        ].map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Banners Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {banners.map((banner, index) => (
                            <motion.div
                                key={banner.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`bg-white rounded-xl shadow-sm border overflow-hidden ${banner.active ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}
                            >
                                <div className="h-40 bg-gray-100 relative group overflow-hidden">
                                    {banner.image_url ? (
                                        <img
                                            src={banner.image_url}
                                            alt={banner.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <ImageIcon size={40} />
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* Optional actions overlay */}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{banner.title}</h3>
                                            <p className="text-sm text-gray-500 truncate max-w-[200px]">{banner.description}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${banner.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {banner.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <Calendar size={14} />
                                        <span>Created: {new Date(banner.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {banner.link && (
                                            <a
                                                href={banner.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
                                            >
                                                <Eye size={16} />
                                                Visit Link
                                            </a>
                                        )}
                                        <button
                                            onClick={() => handleEdit(banner)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {banners.length === 0 && (
                            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
                                <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium text-gray-900">No banners found</p>
                                <p className="text-sm text-gray-500">Create your first banner to get started</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Add/Edit Banner Modal */}
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
                            className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Banner Title</label>
                                    <input
                                        type="text"
                                        placeholder="Enter banner title..."
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        placeholder="Optional description"
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Link URL (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Where should this banner link to?"
                                        value={formData.link || ''}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={formData.sort_order || 0}
                                            onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="flex items-center pt-8">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="active"
                                                checked={formData.active}
                                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                            />
                                            <label htmlFor="active" className="text-sm font-medium text-gray-700">Active</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    {editingBanner ? 'Update Banner' : 'Save Banner'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
