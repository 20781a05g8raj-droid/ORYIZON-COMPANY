'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Ban,
    Mail,
    ArrowUpDown,
    Download,
    Loader2,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { getCustomers, getCustomerStats } from '@/lib/api/customers';
import type { Customer } from '@/types/database';

interface CustomerWithStats extends Customer {
    order_count: number;
    total_spent: number;
    last_order_date: string | null;
}

interface Stats {
    totalCustomers: number;
    activeCustomers: number;
    newThisMonth: number;
    avgLifetimeValue: number;
}

export default function CustomersPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalCustomers: 0,
        activeCustomers: 0,
        newThisMonth: 0,
        avgLifetimeValue: 0
    });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [customersData, statsData] = await Promise.all([
                getCustomers(),
                getCustomerStats()
            ]);

            setCustomers(customersData);
            setStats(statsData);
        } catch (err: any) {
            console.error('Customers fetch error:', err);
            const message = err?.message || 'Failed to load customers';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredCustomers = customers.filter(customer =>
        (customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64" suppressHydrationWarning>
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="ml-2 text-gray-600">Loading customers...</span>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-500">Manage your customer database</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium">
                    <Download size={20} />
                    Export
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" suppressHydrationWarning>
                {[
                    { label: 'Total Customers', value: stats.totalCustomers.toString(), color: 'text-gray-900' },
                    { label: 'Active', value: stats.activeCustomers.toString(), color: 'text-green-600' },
                    { label: 'New This Month', value: stats.newThisMonth.toString(), color: 'text-blue-600' },
                    { label: 'Avg. Lifetime Value', value: `₹${stats.avgLifetimeValue.toLocaleString()}`, color: 'text-purple-600' },
                ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100" suppressHydrationWarning>
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
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Blocked</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Filter size={18} />
                        Filters
                    </button>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" suppressHydrationWarning>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Customer</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Phone</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                                    <button className="flex items-center gap-1 hover:text-gray-900">
                                        Orders <ArrowUpDown size={14} />
                                    </button>
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                                    <button className="flex items-center gap-1 hover:text-gray-900">
                                        Total Spent <ArrowUpDown size={14} />
                                    </button>
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Last Order</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody suppressHydrationWarning>
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer, index) => (
                                    <motion.tr
                                        key={customer.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                                                    {(customer.name || customer.email).charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{customer.name || 'N/A'}</p>
                                                    <p className="text-sm text-gray-500">{customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{customer.phone || '-'}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.order_count}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">₹{customer.total_spent.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/customers/${customer.id}`}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600" title="Email">
                                                    <Mail size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" title="Block">
                                                    <Ban size={16} />
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
                    <p className="text-sm text-gray-600">Showing {filteredCustomers.length} of {stats.totalCustomers} customers</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
                            Previous
                        </button>
                        <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm">1</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
