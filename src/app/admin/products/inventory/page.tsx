'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Package,
    Search,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Save
} from 'lucide-react';

// Mock inventory data
const mockInventory = [
    { id: '1', name: 'Organic Moringa Powder', sku: 'MOR-100', stock: 45, threshold: 10, status: 'in_stock' },
    { id: '2', name: 'Moringa Capsules 60ct', sku: 'MOR-CAP-60', stock: 12, threshold: 20, status: 'low_stock' },
    { id: '3', name: 'Moringa Tea Bags 30pk', sku: 'MOR-TEA-30', stock: 8, threshold: 15, status: 'low_stock' },
    { id: '4', name: 'Moringa Powder 500g', sku: 'MOR-500', stock: 5, threshold: 10, status: 'low_stock' },
    { id: '5', name: 'Premium Moringa Bundle', sku: 'MOR-BUNDLE', stock: 0, threshold: 5, status: 'out_of_stock' },
];

const statusColors: Record<string, string> = {
    in_stock: 'bg-green-100 text-green-700',
    low_stock: 'bg-yellow-100 text-yellow-700',
    out_of_stock: 'bg-red-100 text-red-700',
};

export default function InventoryPage() {
    const [inventory, setInventory] = useState(mockInventory);
    const [saved, setSaved] = useState(false);

    const updateStock = (id: string, value: number) => {
        setInventory(prev => prev.map(item =>
            item.id === id ? { ...item, stock: value } : item
        ));
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-500">Track and update stock levels</p>
                </div>
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${saved
                            ? 'bg-green-600 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                >
                    <Save size={18} />
                    {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Products', value: '24', icon: <Package size={20} />, color: 'text-gray-600' },
                    { label: 'In Stock', value: '18', icon: <TrendingUp size={20} />, color: 'text-green-600' },
                    { label: 'Low Stock', value: '4', icon: <AlertTriangle size={20} />, color: 'text-yellow-600' },
                    { label: 'Out of Stock', value: '2', icon: <TrendingDown size={20} />, color: 'text-red-600' },
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

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by product name or SKU..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Product</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">SKU</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Current Stock</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Threshold</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Adjust</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((item, index) => (
                            <motion.tr
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-gray-50 hover:bg-gray-50"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                                            <Package size={18} className="text-emerald-600" />
                                        </div>
                                        <span className="font-medium text-gray-900">{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{item.sku}</td>
                                <td className="px-6 py-4">
                                    <span className={`font-medium ${item.stock === 0 ? 'text-red-600' :
                                            item.stock < item.threshold ? 'text-yellow-600' : 'text-gray-900'
                                        }`}>
                                        {item.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{item.threshold}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                                        {item.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <input
                                        type="number"
                                        value={item.stock}
                                        onChange={(e) => updateStock(item.id, parseInt(e.target.value) || 0)}
                                        className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
                                    />
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
