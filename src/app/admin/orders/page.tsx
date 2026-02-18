'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Truck,
    Download,
    ArrowUpDown,
    Loader2,
    RefreshCw,
    AlertCircle,
    Edit,
    X,
    Save,
    CheckCircle,
    Calendar,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { getOrders, getOrderStats, updateOrder, deleteOrder } from '@/lib/api/orders';
import { formatDateTime } from '@/lib/utils';
import type { Order, OrderUpdate } from '@/types/database';
import { toast } from 'react-hot-toast';

interface OrderStats {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    failed: number;
}

const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    processing: { bg: 'bg-blue-100', text: 'text-blue-700' },
    shipped: { bg: 'bg-purple-100', text: 'text-purple-700' },
    delivered: { bg: 'bg-green-100', text: 'text-green-700' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
    failed: { bg: 'bg-red-50', text: 'text-red-600' },
};

const paymentColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    paid: { bg: 'bg-green-100', text: 'text-green-700' },
    failed: { bg: 'bg-red-100', text: 'text-red-700' },
    refunded: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

export default function OrdersPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<OrderStats>({
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        failed: 0
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Edit Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [editForm, setEditForm] = useState<{ status: string; payment_status: string }>({
        status: '',
        payment_status: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [ordersData, statsData] = await Promise.all([
                getOrders(),
                getOrderStats()
            ]);

            setOrders(ordersData);
            setStats(statsData);
        } catch (err: any) {
            console.error('Orders fetch error:', err);
            const message = err?.message || 'Failed to load orders';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditClick = (order: Order) => {
        setEditingOrder(order);
        setEditForm({
            status: order.status,
            payment_status: order.payment_status
        });
        setShowEditModal(true);
    };

    const handleDeleteOrder = async (id: string) => {
        if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;

        try {
            await deleteOrder(id);
            toast.success('Order deleted successfully');
            setOrders(orders.filter(o => o.id !== id));

            // Re-fetch stats to stay accurate
            const statsData = await getOrderStats();
            setStats(statsData);
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Failed to delete order');
        }
    };

    const handleUpdateOrder = async () => {
        if (!editingOrder) return;

        try {
            const updates: OrderUpdate = {
                status: editForm.status,
                payment_status: editForm.payment_status
            };

            await updateOrder(editingOrder.id, updates);
            toast.success('Order updated successfully');

            // update local state
            setOrders(orders.map(o => o.id === editingOrder.id ? { ...o, ...updates } : o));

            // Re-fetch stats to stay accurate
            const statsData = await getOrderStats();
            setStats(statsData);

            setShowEditModal(false);
            setEditingOrder(null);
        } catch (error) {
            console.error('Error updating order:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            toast.error(`Failed to update order: ${(error as any)?.message || 'Unknown error'}`);
        }
    };

    const filteredOrders = orders.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64" suppressHydrationWarning>
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="ml-2 text-gray-600">Loading orders...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4" suppressHydrationWarning>
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-red-600">{error}</p>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg"
                >
                    <RefreshCw size={18} /> Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6" suppressHydrationWarning>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" suppressHydrationWarning>
                <div suppressHydrationWarning>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500">Manage and track customer orders</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium">
                    <Download size={20} />
                    Export
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" suppressHydrationWarning>
                {[
                    { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
                    { label: 'Processing', value: stats.processing, color: 'text-blue-600' },
                    { label: 'Shipped', value: stats.shipped, color: 'text-purple-600' },
                    { label: 'Delivered', value: stats.delivered, color: 'text-green-600' },
                ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100" suppressHydrationWarning>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4" suppressHydrationWarning>
                <div className="flex flex-col md:flex-row gap-4" suppressHydrationWarning>
                    <div className="flex-1 relative" suppressHydrationWarning>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option>All Status</option>
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                        <option>Failed</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Filter size={18} />
                        Filters
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" suppressHydrationWarning>
                <div className="overflow-x-auto" suppressHydrationWarning>
                    <table className="w-full" suppressHydrationWarning>
                        <thead suppressHydrationWarning>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                                    <button className="flex items-center gap-1 hover:text-gray-900">
                                        Order ID <ArrowUpDown size={14} />
                                    </button>
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Customer</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Total</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Payment</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                                    <button className="flex items-center gap-1 hover:text-gray-900">
                                        Date <ArrowUpDown size={14} />
                                    </button>
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody suppressHydrationWarning>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order, index) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-emerald-600">{order.order_number}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{order.customer_name}</p>
                                                <p className="text-sm text-gray-500">{order.customer_email}</p>
                                                {order.customer_phone && (
                                                    <p className="text-sm text-gray-500 font-mono">{order.customer_phone}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">₹{order.total}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]?.bg || 'bg-gray-100'} ${statusColors[order.status]?.text || 'text-gray-700'} capitalize`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentColors[order.payment_status]?.bg || 'bg-gray-100'} ${paymentColors[order.payment_status]?.text || 'text-gray-700'} capitalize`}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDateTime(order.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditClick(order)}
                                                    className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600"
                                                    title="Edit Order"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                                    title="Delete Order"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">Showing {filteredOrders.length} of {stats.total} orders</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
                            Previous
                        </button>
                        <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm">1</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>

            {/* Edit Order Modal */}
            <AnimatePresence>
                {showEditModal && editingOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowEditModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-xl"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Update Order</h2>
                                    <p className="text-sm text-gray-500">{editingOrder.order_number}</p>
                                </div>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                                    <select
                                        value={editForm.status}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                                    <select
                                        value={editForm.payment_status}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, payment_status: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="failed">Failed</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start">
                                    <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
                                    <p className="text-sm text-blue-800">
                                        Changing the status will update the customer's order tracking immediately.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-white transition-colors text-gray-700 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateOrder}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
