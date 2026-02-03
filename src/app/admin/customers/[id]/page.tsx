'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Package,
    DollarSign,
    User,
    Edit,
    Ban,
    Eye
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock customer data
const mockCustomers: Record<string, any> = {
    '1': {
        id: '1',
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 98765 43210',
        address: '123 MG Road, Bangalore, Karnataka 560001',
        orders: 12,
        spent: 15680,
        lastOrder: '2024-02-01',
        status: 'active',
        joinDate: '2023-06-15',
    },
    '2': {
        id: '2',
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+91 87654 32109',
        address: '456 Park Street, Mumbai, Maharashtra 400001',
        orders: 5,
        spent: 4599,
        lastOrder: '2024-01-28',
        status: 'active',
        joinDate: '2023-09-20',
    },
};

const recentOrders = [
    { id: 'ORD-2024-001', date: '2024-02-01', items: 2, total: 1299, status: 'delivered' },
    { id: 'ORD-2024-008', date: '2024-01-15', items: 1, total: 599, status: 'delivered' },
    { id: 'ORD-2023-145', date: '2023-12-20', items: 3, total: 2499, status: 'delivered' },
];

const statusColors: Record<string, string> = {
    delivered: 'bg-green-100 text-green-700',
    shipped: 'bg-purple-100 text-purple-700',
    processing: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
};

export default function CustomerDetailPage() {
    const params = useParams();
    const customerId = params.id as string;
    const customer = mockCustomers[customerId] || mockCustomers['1'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/customers"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl font-bold">
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                            <p className="text-gray-500">Customer since {customer.joinDate}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Mail size={18} />
                        Send Email
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Edit size={18} />
                        Edit
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                        <Ban size={18} />
                        Block
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Orders', value: customer.orders, icon: <Package size={20} />, color: 'text-blue-600' },
                    { label: 'Total Spent', value: `₹${customer.spent.toLocaleString()}`, icon: <DollarSign size={20} />, color: 'text-green-600' },
                    { label: 'Last Order', value: customer.lastOrder, icon: <Calendar size={20} />, color: 'text-purple-600' },
                    { label: 'Status', value: customer.status, icon: <User size={20} />, color: customer.status === 'active' ? 'text-green-600' : 'text-red-600' },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <span className={stat.color}>{stat.icon}</span>
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contact Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-gray-900">{customer.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="text-gray-900">{customer.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin size={18} className="text-gray-400 mt-1" />
                            <div>
                                <p className="text-xs text-gray-500">Address</p>
                                <p className="text-gray-900">{customer.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm text-emerald-600 hover:text-emerald-700">
                            View All
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 flex items-center justify-between hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <Package size={18} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{order.id}</p>
                                        <p className="text-sm text-gray-500">{order.items} items • {order.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="font-medium text-gray-900">₹{order.total}</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                        {order.status}
                                    </span>
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                    >
                                        <Eye size={16} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
