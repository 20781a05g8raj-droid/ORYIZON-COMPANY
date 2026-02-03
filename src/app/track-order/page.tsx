'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getOrderByNumber } from '@/lib/api/orders';
import type { Order } from '@/types/database';

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState<any>(null);
    const [error, setError] = useState('');

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId || !email) {
            setError('Please enter both Order ID and Email.');
            return;
        }

        setIsLoading(true);
        setError('');
        setOrderStatus(null);

        try {
            const order = await getOrderByNumber(orderId);

            if (!order) {
                setError('Order not found. Please check your Order ID.');
                return;
            }

            // Verify email (case-insensitive)
            if (order.customer_email.toLowerCase() !== email.toLowerCase()) {
                setError('Email address does not match this order.');
                return;
            }

            // Map database status to UI timeline
            // Statuses: pending, processing, shipped, delivered, cancelled
            const timeline = [
                {
                    status: 'Order Placed',
                    date: new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
                    completed: true
                },
                {
                    status: 'Processing',
                    date: order.status !== 'pending' ? 'Completed' : '-',
                    completed: ['processing', 'shipped', 'delivered'].includes(order.status)
                },
                {
                    status: 'Shipped',
                    date: ['shipped', 'delivered'].includes(order.status) ? 'Completed' : '-',
                    completed: ['shipped', 'delivered'].includes(order.status)
                },
                {
                    status: 'Out for Delivery',
                    date: order.status === 'delivered' ? 'Completed' : '-',
                    completed: order.status === 'delivered'
                },
                {
                    status: 'Delivered',
                    date: order.status === 'delivered' ? new Date(order.updated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '-',
                    completed: order.status === 'delivered'
                },
            ];

            // Estimate delivery (mock calculation for now, just adds 5 days to created_at)
            const createdDate = new Date(order.created_at);
            createdDate.setDate(createdDate.getDate() + 5);
            const eta = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            setOrderStatus({
                id: order.order_number,
                status: order.status,
                date: new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                eta: order.status === 'delivered' ? 'Delivered' : eta,
                carrier: 'Standard Shipping', // Default since not in DB
                trackingNumber: 'Not assigned yet', // Default since not in DB
                timeline: timeline
            });

        } catch (err) {
            console.error('Tracking error:', err);
            setError('Failed to track order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusStep = (status: string) => {
        const steps = ['pending', 'processing', 'shipped', 'delivered'];
        return steps.indexOf(status);
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-[#FBF9F4]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="font-heading text-4xl font-bold text-[#2C2C2C] mb-4">
                        Track Your Order
                    </h1>
                    <p className="text-[#666666]">
                        Enter your order details below to check the real-time status of your shipment.
                    </p>
                </div>

                {/* Tracking Form */}
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 mb-8">
                    <form onSubmit={handleTrack} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="orderId" className="text-sm font-medium text-[#2C2C2C]">Order ID</label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" size={20} />
                                    <input
                                        type="text"
                                        id="orderId"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        placeholder="e.g., ORY-..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-[#2C2C2C]">Email Address</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" size={20} />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                            loading={isLoading}
                            icon={!isLoading ? <Search size={20} /> : undefined}
                        >
                            {isLoading ? 'Tracking...' : 'Track Order'}
                        </Button>
                    </form>
                </div>

                {/* Tracking Results */}
                <AnimatePresence>
                    {orderStatus && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-2xl shadow-sm p-6 md:p-10"
                        >
                            {/* Order Summary */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 mb-8 gap-4">
                                <div>
                                    <div className="text-sm text-[#999999] mb-1">Order Status</div>
                                    <div className="text-2xl font-bold text-[#2D5016] flex items-center gap-2 capitalize">
                                        {orderStatus.status}
                                        {orderStatus.status === 'delivered' && <CheckCircle size={24} />}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-[#999999] mb-1">Estimated Delivery</div>
                                    <div className="font-medium text-[#2C2C2C]">{orderStatus.eta}</div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="relative pl-8 md:pl-0 space-y-8 md:space-y-0 md:flex md:justify-between md:items-center">
                                {/* Connector Line (Desktop) */}
                                <div className="hidden md:block absolute top-[1.35rem] left-0 w-full h-1 bg-gray-100 -z-0">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(getStatusStep(orderStatus.status) / 3) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className="h-full bg-[#2D5016]"
                                    />
                                </div>

                                {orderStatus.timeline.map((step: any, index: number) => {
                                    const isCompleted = step.completed;
                                    const isCurrent = orderStatus.status === ['placed', 'processing', 'shipped', 'delivered', 'delivered'][index];

                                    return (
                                        <div key={index} className="relative md:flex-1 md:text-center z-10 flex md:block items-start md:items-center gap-4">
                                            {/* Connector Line (Mobile) */}
                                            {index !== orderStatus.timeline.length - 1 && (
                                                <div className={`md:hidden absolute left-[0.9rem] top-8 bottom-[-2rem] w-1 ${isCompleted ? 'bg-[#2D5016]' : 'bg-gray-100'}`} />
                                            )}

                                            {/* Dot */}
                                            <div className={`
                                                w-8 h-8 rounded-full flex items-center justify-center border-4 transition-colors duration-500 shrink-0
                                                ${isCompleted
                                                    ? 'bg-[#2D5016] border-[#2D5016] text-white'
                                                    : 'bg-white border-gray-200 text-gray-300'}
                                            `}>
                                                {isCompleted ? <CheckCircle size={14} /> : (index + 1)}
                                            </div>

                                            {/* Info */}
                                            <div className="pt-1 md:pt-4">
                                                <div className={`font-bold text-sm mb-1 ${isCompleted ? 'text-[#2C2C2C]' : 'text-[#999999]'}`}>
                                                    {step.status}
                                                </div>
                                                <div className="text-xs text-[#999999]">
                                                    {step.date}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Additional Info */}
                            <div className="mt-10 bg-[#FBF9F4] rounded-xl p-6 grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="text-sm text-[#999999] mb-1">Carrier</div>
                                    <div className="font-medium text-[#2C2C2C] flex items-center gap-2">
                                        <Truck size={18} />
                                        {orderStatus.carrier}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-[#999999] mb-1">Tracking Number</div>
                                    <div className="font-medium text-[#2C2C2C]">{orderStatus.trackingNumber}</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
