'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Package,
    Truck,
    MapPin,
    CreditCard,
    User,
    Mail,
    Phone,
    Calendar,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock order data
const mockOrders: Record<string, any> = {
    'ORD-2024-001': {
        id: 'ORD-2024-001',
        customer: {
            name: 'Priya Sharma',
            email: 'priya@example.com',
            phone: '+91 98765 43210',
        },
        shipping: {
            address: '123 MG Road, Bangalore, Karnataka 560001',
            method: 'Express Delivery',
            tracking: 'TRK123456789',
        },
        payment: {
            method: 'Credit Card',
            status: 'paid',
            transactionId: 'TXN-2024-001',
        },
        status: 'delivered',
        date: '2024-02-01',
        items: [
            { id: '1', name: 'Organic Moringa Powder', quantity: 2, price: 499, image: '/products/moringa-powder.jpg' },
            { id: '2', name: 'Moringa Capsules (60 caps)', quantity: 1, price: 599, image: '/products/moringa-capsules.jpg' },
        ],
        subtotal: 1597,
        shipping_cost: 0,
        tax: 287,
        total: 1884,
    },
};

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    processing: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    shipped: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
    delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
};

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params.id as string;
    const order = mockOrders[orderId] || mockOrders['ORD-2024-001'];
    const [status, setStatus] = useState(order.status);

    const StatusIcon = statusConfig[status]?.icon || Clock;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/orders"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{order.id}</h1>
                        <div className="flex items-center gap-2 text-gray-500">
                            <Calendar size={16} />
                            <span>{order.date}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium">
                        Update Status
                    </button>
                </div>
            </div>

            {/* Status Banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${statusConfig[status]?.bg || 'bg-gray-100'} rounded-xl p-4 flex items-center gap-4`}
            >
                <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center ${statusConfig[status]?.color}`}>
                    <StatusIcon size={24} />
                </div>
                <div>
                    <p className={`font-semibold capitalize ${statusConfig[status]?.color}`}>
                        Order {status}
                    </p>
                    <p className="text-sm text-gray-600">
                        {status === 'delivered' && 'Order was successfully delivered to the customer.'}
                        {status === 'shipped' && `Tracking: ${order.shipping.tracking}`}
                        {status === 'processing' && 'Order is being prepared for shipment.'}
                        {status === 'pending' && 'Waiting for payment confirmation.'}
                        {status === 'cancelled' && 'This order has been cancelled.'}
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item: any, index: number) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 flex items-center gap-4"
                                >
                                    <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <Package size={24} className="text-emerald-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                                </motion.div>
                            ))}
                        </div>
                        <div className="p-6 bg-gray-50 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="text-gray-900">₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Shipping</span>
                                <span className="text-gray-900">{order.shipping_cost === 0 ? 'Free' : `₹${order.shipping_cost}`}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tax (GST 18%)</span>
                                <span className="text-gray-900">₹{order.tax}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                <span className="font-semibold text-gray-900">Total</span>
                                <span className="font-bold text-lg text-emerald-600">₹{order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Customer</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User size={18} className="text-gray-400" />
                                <span className="text-gray-900">{order.customer.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-gray-400" />
                                <span className="text-gray-900">{order.customer.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-gray-400" />
                                <span className="text-gray-900">{order.customer.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Shipping</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-gray-400 mt-1" />
                                <span className="text-gray-900">{order.shipping.address}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Truck size={18} className="text-gray-400" />
                                <span className="text-gray-900">{order.shipping.method}</span>
                            </div>
                            {order.shipping.tracking && (
                                <div className="pt-2 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                                    <p className="font-mono text-sm text-emerald-600">{order.shipping.tracking}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Payment</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <CreditCard size={18} className="text-gray-400" />
                                <span className="text-gray-900">{order.payment.method}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.payment.status === 'paid'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {order.payment.status}
                                </span>
                            </div>
                            <div className="pt-2 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                                <p className="font-mono text-sm">{order.payment.transactionId}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
