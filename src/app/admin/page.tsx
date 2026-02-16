'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Package,
    ShoppingBag,
    TrendingUp,
    TrendingDown,
    Users,
    FileText,
    ArrowRight,
    DollarSign,
    Eye,
    Loader2,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import { getProducts } from '@/lib/api/products';
import { getAllBlogPosts } from '@/lib/api/blog';
import { getOrders, getOrderStats } from '@/lib/api/orders';
import { getContactStats } from '@/lib/api/contacts';
import type { ProductWithVariants, BlogPost, Order } from '@/types/database';

interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalBlogPosts: number;
    totalRevenue: number;
    pendingOrders: number;
    newMessages: number;
}

interface StatCardProps {
    stat: {
        label: string;
        value: string;
        change: string;
        trend: 'up' | 'down';
        icon: React.ComponentType<{ className?: string }>;
        color: string;
    };
}

function StatCard({ stat }: StatCardProps) {
    const colorClasses: Record<string, { bg: string; icon: string }> = {
        emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600' },
        blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
        purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
        orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            suppressHydrationWarning
        >
            <div className="flex items-start justify-between" suppressHydrationWarning>
                <div suppressHydrationWarning>
                    <p className="text-gray-500 text-sm font-medium" suppressHydrationWarning>{stat.label}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1" suppressHydrationWarning>{stat.value}</h3>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`} suppressHydrationWarning>
                        {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span suppressHydrationWarning>{stat.change}</span>
                    </div>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[stat.color]?.bg || 'bg-gray-50'}`} suppressHydrationWarning>
                    <stat.icon className={`h-6 w-6 ${colorClasses[stat.color]?.icon || 'text-gray-600'}`} />
                </div>
            </div>
        </motion.div>
    );
}

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<ProductWithVariants[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
        totalProducts: 0,
        totalOrders: 0,
        totalBlogPosts: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        newMessages: 0,
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch data individually to identify which one fails
            let productsData: ProductWithVariants[] = [];
            let blogData: BlogPost[] = [];
            let ordersData: Order[] = [];
            let orderStatsData = { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
            let contactStatsData = { new: 0, total: 0 };

            try {
                productsData = await getProducts();
            } catch (e) {
                console.error('Failed to fetch products:', e);
            }

            try {
                blogData = await getAllBlogPosts();
            } catch (e) {
                console.error('Failed to fetch blog posts:', e);
            }

            try {
                ordersData = await getOrders();
            } catch (e) {
                console.error('Failed to fetch orders:', e);
                // Throwing here because orders are critical for the dashboard
                throw new Error(`Orders fetch failed: ${JSON.stringify(e)}`);
            }

            try {
                orderStatsData = await getOrderStats();
            } catch (e) {
                console.error('Failed to fetch order stats:', e);
            }

            try {
                contactStatsData = await getContactStats();
            } catch (e) {
                console.error('Failed to fetch contact stats:', e);
            }

            setProducts(productsData);
            setBlogPosts(blogData);
            setOrders(ordersData);

            const totalRevenue = ordersData.reduce((sum, o) => sum + (o.total || 0), 0);

            setDashboardStats({
                totalProducts: productsData.length,
                totalOrders: ordersData.length,
                totalBlogPosts: blogData.length,
                totalRevenue,
                pendingOrders: orderStatsData.pending,
                newMessages: contactStatsData.new,
            });
        } catch (err: any) {
            console.error('Dashboard fetch error:', err);
            // Better error message extraction
            const message = err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
            setError(`Failed to load dashboard data: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const stats = [
        {
            label: 'Total Products',
            value: dashboardStats.totalProducts.toString(),
            change: 'Active catalog',
            trend: 'up' as const,
            icon: Package,
            color: 'emerald',
        },
        {
            label: 'Total Orders',
            value: dashboardStats.totalOrders.toString(),
            change: `${dashboardStats.pendingOrders} pending`,
            trend: 'up' as const,
            icon: ShoppingBag,
            color: 'blue',
        },
        {
            label: 'Blog Posts',
            value: dashboardStats.totalBlogPosts.toString(),
            change: 'Published articles',
            trend: 'up' as const,
            icon: FileText,
            color: 'purple',
        },
        {
            label: 'Revenue',
            value: `₹${dashboardStats.totalRevenue.toLocaleString()}`,
            change: `${dashboardStats.newMessages} new messages`,
            trend: 'up' as const,
            icon: DollarSign,
            color: 'orange',
        },
    ];

    const statusColors: Record<string, string> = {
        delivered: 'bg-green-100 text-green-700',
        shipped: 'bg-blue-100 text-blue-700',
        processing: 'bg-yellow-100 text-yellow-700',
        pending: 'bg-gray-100 text-gray-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64" suppressHydrationWarning>
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="ml-2 text-gray-600">Loading dashboard...</span>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" suppressHydrationWarning>
                <div suppressHydrationWarning>
                    <h1 className="text-2xl font-bold text-gray-900" suppressHydrationWarning>Dashboard</h1>
                    <p className="text-gray-500" suppressHydrationWarning>Welcome back! Here&apos;s what&apos;s happening with your store.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    suppressHydrationWarning
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" suppressHydrationWarning>
                {stats.map((stat, index) => (
                    <StatCard key={index} stat={stat} />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" suppressHydrationWarning>
                {/* Products Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100" suppressHydrationWarning>
                    <div className="flex items-center justify-between p-6 border-b border-gray-100" suppressHydrationWarning>
                        <h2 className="text-lg font-semibold text-gray-900" suppressHydrationWarning>Products Overview</h2>
                        <Link href="/admin/products" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto" suppressHydrationWarning>
                        <table className="w-full" suppressHydrationWarning>
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody suppressHydrationWarning>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            No products found. <Link href="/admin/products/new" className="text-emerald-600">Add your first product</Link>
                                        </td>
                                    </tr>
                                ) : (
                                    products.slice(0, 5).map((product) => (
                                        <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors" suppressHydrationWarning>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900" suppressHydrationWarning>{product.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600" suppressHydrationWarning>{product.category}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900" suppressHydrationWarning>₹{product.price}</td>
                                            <td className="px-6 py-4" suppressHydrationWarning>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} suppressHydrationWarning>
                                                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Blog Posts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100" suppressHydrationWarning>
                    <div className="flex items-center justify-between p-6 border-b border-gray-100" suppressHydrationWarning>
                        <h2 className="text-lg font-semibold text-gray-900" suppressHydrationWarning>Recent Blog Posts</h2>
                        <Link href="/admin/content/blog" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="p-4 space-y-3" suppressHydrationWarning>
                        {blogPosts.length === 0 ? (
                            <div className="py-8 text-center text-gray-500" suppressHydrationWarning>
                                No blog posts found. <Link href="/admin/content/blog/new" className="text-emerald-600">Create your first post</Link>
                            </div>
                        ) : (
                            blogPosts.slice(0, 4).map((post) => (
                                <div key={post.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors" suppressHydrationWarning>
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0" suppressHydrationWarning>
                                        <span className="text-lg" suppressHydrationWarning>{post.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0" suppressHydrationWarning>
                                        <h3 className="font-medium text-gray-900 truncate" suppressHydrationWarning>{post.title}</h3>
                                        <p className="text-sm text-gray-500" suppressHydrationWarning>
                                            {post.category} • {new Date(post.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`} suppressHydrationWarning>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100" suppressHydrationWarning>
                <div className="flex items-center justify-between p-6 border-b border-gray-100" suppressHydrationWarning>
                    <h2 className="text-lg font-semibold text-gray-900" suppressHydrationWarning>Recent Orders</h2>
                    <Link href="/admin/orders" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>
                <div className="overflow-x-auto" suppressHydrationWarning>
                    <table className="w-full" suppressHydrationWarning>
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody suppressHydrationWarning>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500" suppressHydrationWarning>
                                        No orders yet. Orders will appear here when customers make purchases.
                                    </td>
                                </tr>
                            ) : (
                                orders.slice(0, 5).map((order) => (
                                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors" suppressHydrationWarning>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900" suppressHydrationWarning>{order.order_number}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600" suppressHydrationWarning>{order.customer_name}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900" suppressHydrationWarning>₹{order.total}</td>
                                        <td className="px-6 py-4" suppressHydrationWarning>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`} suppressHydrationWarning>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500" suppressHydrationWarning>
                                            {new Date(order.created_at).toLocaleString('en-IN', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
