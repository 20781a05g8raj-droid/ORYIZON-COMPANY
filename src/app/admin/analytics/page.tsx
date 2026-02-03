'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    Calendar,
    ArrowUpRight,
    ChevronDown,
    Loader2,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import { getRevenueData, getTopProducts, getAnalyticsStats } from '@/lib/api/analytics';
import type { RevenueData, TopProduct, AnalyticsStats } from '@/lib/api/analytics';

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState('last_30_days');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [stats, setStats] = useState<AnalyticsStats>({
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        newCustomers: 0
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [revenue, products, analyticsStats] = await Promise.all([
                getRevenueData(),
                getTopProducts(),
                getAnalyticsStats()
            ]);

            setRevenueData(revenue);
            setTopProducts(products);
            setStats(analyticsStats);

        } catch (err: any) {
            console.error('Analytics fetch error:', err);
            const message = err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
            setError(`Failed to load analytics data: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const maxRevenue = revenueData.length > 0 ? Math.max(...revenueData.map(d => d.revenue)) : 0;
    // Prevent division by zero if maxRevenue is 0
    const chartMaxRevenue = maxRevenue > 0 ? maxRevenue : 100;

    const maxOrders = revenueData.length > 0 ? Math.max(...revenueData.map(d => d.orders)) : 0;
    const chartMaxOrders = maxOrders > 0 ? maxOrders : 10;

    const displayStats = [
        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, change: '+0%', trend: 'up' as const, icon: <DollarSign size={24} /> },
        { label: 'Total Orders', value: stats.totalOrders.toString(), change: '+0%', trend: 'up' as const, icon: <ShoppingCart size={24} /> },
        { label: 'Avg. Order Value', value: `₹${stats.avgOrderValue.toLocaleString()}`, change: '+0%', trend: 'up' as const, icon: <Package size={24} /> },
        { label: 'Total Customers', value: stats.newCustomers.toString(), change: '+0%', trend: 'up' as const, icon: <Users size={24} /> },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64" suppressHydrationWarning>
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="ml-2 text-gray-600">Loading analytics...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4" suppressHydrationWarning>
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-red-600 text-center max-w-lg">{error}</p>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-500">Track your store performance and insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="today">Today</option>
                        <option value="last_7_days">Last 7 Days</option>
                        <option value="last_30_days">Last 30 Days</option>
                        <option value="last_90_days">Last 90 Days</option>
                        <option value="this_year">This Year</option>
                    </select>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayStats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                                {/* 
                                <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    <span>{stat.change}</span>
                                    <span className="text-gray-400">vs last period</span>
                                </div>
                                */}
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                                {stat.icon}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
                        <button className="text-sm text-gray-500 flex items-center gap-1">
                            Last 6 Months <ChevronDown size={16} />
                        </button>
                    </div>
                    {/* Simple Bar Chart */}
                    <div className="h-64 flex items-end justify-between gap-2">
                        {revenueData.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No revenue data available
                            </div>
                        ) : (
                            revenueData.map((data, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col items-center">
                                        <span className="text-xs text-gray-500 mb-1">₹{(data.revenue / 1000).toFixed(0)}k</span>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(data.revenue / chartMaxRevenue) * 180}px` }}
                                            transition={{ delay: index * 0.1, duration: 0.5 }}
                                            className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg min-h-[4px]"
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500">{data.month}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Orders Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Orders Trend</h2>
                        <button className="text-sm text-gray-500 flex items-center gap-1">
                            Last 6 Months <ChevronDown size={16} />
                        </button>
                    </div>
                    {/* Simple Line Chart (Using bars for simplicity) */}
                    <div className="h-64 flex items-end justify-between gap-2">
                        {revenueData.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No order data available
                            </div>
                        ) : (
                            revenueData.map((data, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col items-center">
                                        <span className="text-xs text-gray-500 mb-1">{data.orders}</span>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(data.orders / chartMaxOrders) * 180}px` }}
                                            transition={{ delay: index * 0.1, duration: 0.5 }}
                                            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg min-h-[4px]"
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500">{data.month}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {topProducts.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No products sold yet.
                            </div>
                        ) : (
                            topProducts.map((product, index) => (
                                <div key={index} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                    <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.sales} sales</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">₹{product.revenue.toLocaleString()}</p>
                                        <p className="text-sm text-green-600 flex items-center justify-end gap-1">
                                            <ArrowUpRight size={14} />
                                            {/* Calculate percentage if needed */}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Traffic Sources - Still Mock or Hidden? User asked for database link only for orders/customers */}
                {/* Hiding Traffic Sources as we don't have real data and user wants 0/real data */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Traffic Sources</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="text-center text-gray-500 py-4">
                            Details about traffic sources will appear here once tracking is implemented.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
