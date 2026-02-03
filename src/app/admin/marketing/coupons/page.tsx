'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Copy,
    Tag,
    Calendar,
    X,
    Check,
    Percent,
    DollarSign,
    Loader2
} from 'lucide-react';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/lib/api/coupons';
import type { Coupon, CouponInsert } from '@/types/database';
import { toast } from 'react-hot-toast';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [couponType, setCouponType] = useState<'percentage' | 'flat'>('percentage');

    // Form state interface (different from CouponInsert to handle date inputs)
    interface CouponFormData {
        code: string;
        description: string;
        discount_type: 'percentage' | 'flat';
        discount_value: number;
        min_order: number;
        max_uses: number | null;
        active: boolean;
        valid_from: string;
        valid_to: string;
    }

    // Form states
    const [formData, setFormData] = useState<CouponFormData>({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: 0,
        min_order: 0,
        max_uses: null,
        active: true,
        valid_from: '',
        valid_to: ''
    });

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const data = await getAllCoupons();
            setCoupons(data);
        } catch (error) {
            console.error('Error fetching coupons:', error);
            toast.error('Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success('Code copied to clipboard!');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await deleteCoupon(id);
            setCoupons(coupons.filter(c => c.id !== id));
            toast.success('Coupon deleted successfully');
        } catch (error) {
            console.error('Error deleting coupon:', error);
            toast.error('Failed to delete coupon');
        }
    };

    const handleEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            description: coupon.description || '',
            discount_type: coupon.discount_type as 'percentage' | 'flat',
            discount_value: coupon.discount_value,
            min_order: coupon.min_order,
            max_uses: coupon.max_uses,
            active: coupon.active,
            // Format dates for input field (YYYY-MM-DD)
            valid_from: coupon.starts_at ? new Date(coupon.starts_at).toISOString().split('T')[0] : '',
            valid_to: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : ''
        });
        setCouponType(coupon.discount_type as 'percentage' | 'flat');
        setShowModal(true);
    };

    const handleSubmit = async () => {
        try {
            const payload: any = {
                ...formData,
                discount_type: couponType,
                discount_value: Number(formData.discount_value),
                min_order: Number(formData.min_order),
                starts_at: formData.valid_from ? new Date(formData.valid_from as string).toISOString() : null,
                expires_at: formData.valid_to ? new Date(formData.valid_to as string).toISOString() : null,
            };

            // Remove temporary fields not in DB
            delete payload.valid_from;
            delete payload.valid_to;

            if (editingCoupon) {
                await updateCoupon(editingCoupon.id, payload);
                toast.success('Coupon updated successfully');
            } else {
                await createCoupon(payload as CouponInsert);
                toast.success('Coupon created successfully');
            }
            setShowModal(false);
            setEditingCoupon(null);
            fetchCoupons();
        } catch (error) {
            console.error('Error saving coupon:', error);
            toast.error('Failed to save coupon');
        }
    };

    const resetForm = () => {
        setEditingCoupon(null);
        setFormData({
            code: '',
            description: '',
            discount_type: 'percentage',
            discount_value: 0,
            min_order: 0,
            max_uses: null,
            active: true,
            valid_from: '',
            valid_to: ''
        });
        setCouponType('percentage');
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Coupons & Discounts</h1>
                    <p className="text-gray-500">Create and manage promotional codes</p>
                </div>
                <button
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                >
                    <Plus size={20} />
                    Create Coupon
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-emerald-600" size={32} />
                </div>
            ) : (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Active Coupons', value: coupons.filter(c => c.active).length.toString(), color: 'text-green-600' },
                            { label: 'Total Used', value: coupons.reduce((sum, c) => sum + (c.used_count || 0), 0).toString(), color: 'text-blue-600' },
                            // Placeholder for metrics not directly in coupon table
                            { label: 'Avg. Discount', value: '₹--', color: 'text-orange-600' },
                        ].map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search coupons..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                <option>All Status</option>
                                <option>Active</option>
                                <option>Expired</option>
                            </select>
                        </div>
                    </div>

                    {/* Coupons Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {coupons.map((coupon, index) => (
                            <motion.div
                                key={coupon.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-white rounded-xl shadow-sm border overflow-hidden ${coupon.active ? 'border-gray-100' : 'border-gray-200 opacity-60'
                                    }`}
                            >
                                {/* Coupon Header */}
                                <div className={`p-4 ${coupon.active ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gray-400'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-white">
                                            <Tag size={20} />
                                            <span className="font-bold text-lg tracking-wider">{coupon.code}</span>
                                        </div>
                                        <button
                                            onClick={() => copyCode(coupon.code)}
                                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
                                            title="Copy code"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                    <div className="mt-2 text-white/90 text-3xl font-bold">
                                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                                    </div>
                                </div>

                                {/* Coupon Details */}
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Min. Order</span>
                                        <span className="font-medium text-gray-900">₹{coupon.min_order}</span>
                                    </div>
                                    {coupon.max_uses && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Usage Limit</span>
                                            <span className="font-medium text-gray-900">{coupon.max_uses}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Used Count</span>
                                        <span className="font-medium text-gray-900">{coupon.used_count || 0}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar size={14} />
                                        {coupon.starts_at ? new Date(coupon.starts_at).toLocaleDateString() : 'N/A'} - {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'No Expiry'}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.active
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {coupon.active ? 'Active' : 'Inactive'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(coupon)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(coupon.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {coupons.length === 0 && (
                            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
                                <Tag size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium text-gray-900">No coupons found</p>
                                <p className="text-sm text-gray-500">Create your first coupon to get started</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Create/Edit Coupon Modal */}
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
                                    {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., WELCOME20"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <input
                                        type="text"
                                        placeholder="Internal note/description"
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setCouponType('percentage')}
                                            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${couponType === 'percentage'
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                }`}
                                        >
                                            <Percent size={20} />
                                            Percentage
                                        </button>
                                        <button
                                            onClick={() => setCouponType('flat')}
                                            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${couponType === 'flat'
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                }`}
                                        >
                                            <DollarSign size={20} />
                                            Flat Amount
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Discount Value {couponType === 'percentage' ? '(%)' : '(₹)'}
                                        </label>
                                        <input
                                            type="number"
                                            placeholder={couponType === 'percentage' ? '20' : '100'}
                                            value={formData.discount_value}
                                            onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Min. Cart Value (₹)</label>
                                        <input
                                            type="number"
                                            placeholder="500"
                                            value={formData.min_order}
                                            onChange={(e) => setFormData({ ...formData, min_order: Number(e.target.value) })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
                                        <input
                                            type="date"
                                            value={formData.valid_from as string}
                                            onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Valid To</label>
                                        <input
                                            type="date"
                                            value={formData.valid_to as string}
                                            onChange={(e) => setFormData({ ...formData, valid_to: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                                    <input
                                        type="number"
                                        placeholder="100"
                                        value={formData.max_uses || ''}
                                        onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? Number(e.target.value) : null })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

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
                            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
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
                                    <Check size={18} />
                                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

