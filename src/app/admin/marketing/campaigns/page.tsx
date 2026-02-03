'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Calendar,
    Target,
    X,
    Save,
    Loader2
} from 'lucide-react';
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign } from '@/lib/api/campaigns';
import type { Campaign, CampaignInsert } from '@/types/database';
import { toast } from 'react-hot-toast';

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

    // Form state
    const [formData, setFormData] = useState<Partial<CampaignInsert>>({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        active: true,
        discount_percentage: 0
    });

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const data = await getCampaigns();
            setCampaigns(data);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            toast.error('Failed to load campaigns');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this campaign?')) return;
        try {
            await deleteCampaign(id);
            setCampaigns(campaigns.filter(c => c.id !== id));
            toast.success('Campaign deleted successfully');
        } catch (error) {
            console.error('Error deleting campaign:', error);
            toast.error('Failed to delete campaign');
        }
    };

    const handleEdit = (campaign: Campaign) => {
        setEditingCampaign(campaign);
        setFormData({
            name: campaign.name,
            description: campaign.description || '',
            start_date: campaign.start_date ? new Date(campaign.start_date).toISOString().split('T')[0] : '',
            end_date: campaign.end_date ? new Date(campaign.end_date).toISOString().split('T')[0] : '',
            active: campaign.active,
            discount_percentage: campaign.discount_percentage || 0
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        try {
            if (!formData.name) {
                toast.error('Campaign name is required');
                return;
            }

            // Adjust dates to ISO strings for DB
            const payload: any = {
                ...formData,
                discount_percentage: Number(formData.discount_percentage),
                start_date: formData.start_date ? new Date(formData.start_date as string).toISOString() : null,
                end_date: formData.end_date ? new Date(formData.end_date as string).toISOString() : null,
            };

            if (editingCampaign) {
                await updateCampaign(editingCampaign.id, payload);
                toast.success('Campaign updated successfully');
            } else {
                await createCampaign(payload as CampaignInsert);
                toast.success('Campaign created successfully');
            }
            setShowModal(false);
            setEditingCampaign(null);
            fetchCampaigns();
        } catch (error) {
            console.error('Error saving campaign:', error);
            toast.error('Failed to save campaign');
        }
    };

    const resetForm = () => {
        setEditingCampaign(null);
        setFormData({
            name: '',
            description: '',
            start_date: '',
            end_date: '',
            active: true,
            discount_percentage: 0
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Marketing Campaigns</h1>
                    <p className="text-gray-500">Create and manage marketing campaigns</p>
                </div>
                <button
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                >
                    <Plus size={20} />
                    Create Campaign
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
                            { label: 'Active Campaigns', value: campaigns.filter(c => c.active).length.toString(), icon: <Target size={20} />, color: 'text-green-600' },
                            { label: 'Total Campaigns', value: campaigns.length.toString(), icon: <Calendar size={20} />, color: 'text-blue-600' },
                            // Placeholder stats
                            { label: 'Avg. Duration', value: '15 Days', icon: <Calendar size={20} />, color: 'text-purple-600' },
                            { label: 'Drafts', value: campaigns.filter(c => !c.active).length.toString(), icon: <Edit size={20} />, color: 'text-orange-600' },
                        ].map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <span className={stat.color}>{stat.icon}</span>
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Campaigns Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Campaign Name</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Period</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Discount</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {campaigns.map((campaign, index) => (
                                        <motion.tr
                                            key={campaign.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-gray-50 hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{campaign.name}</div>
                                                {campaign.description && (
                                                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{campaign.description}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'N/A'}
                                                {' - '}
                                                {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                {campaign.discount_percentage ? `${campaign.discount_percentage}%` : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${campaign.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {campaign.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(campaign)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(campaign.id)}
                                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {campaigns.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                No campaigns found. Create one to get started.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Create/Edit Campaign Modal */}
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
                                    {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Summer Sale 2024"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        placeholder="Internal notes about this campaign"
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                        <input
                                            type="date"
                                            value={formData.start_date as string}
                                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                        <input
                                            type="date"
                                            value={formData.end_date as string}
                                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage (%)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={formData.discount_percentage || ''}
                                        onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div className="flex items-center pt-2">
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
                                    {editingCampaign ? 'Update Campaign' : 'Save Campaign'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
