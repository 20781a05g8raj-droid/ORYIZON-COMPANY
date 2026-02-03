'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Package,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    ArrowUpDown,
    Loader2,
    RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, deleteProduct } from '@/lib/api/products';
import type { ProductWithVariants } from '@/types/database';
import { formatPrice } from '@/lib/utils';

const statusBadge: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    low_stock: 'bg-yellow-100 text-yellow-700',
    out_of_stock: 'bg-red-100 text-red-700',
    draft: 'bg-gray-100 text-gray-700',
};

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductWithVariants[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            alert('Failed to delete product');
            console.error(err);
        }
    };

    const getStockStatus = (product: ProductWithVariants) => {
        if (!product.in_stock) return 'out_of_stock';
        const hasLowStock = product.product_variants?.some(v => !v.in_stock);
        if (hasLowStock) return 'low_stock';
        return 'active';
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(products.map(p => p.category))];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={fetchProducts}
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
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500">Manage your product catalog ({products.length} products)</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchProducts}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                        title="Refresh"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                    >
                        <Plus size={20} />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                                    <button className="flex items-center gap-1 hover:text-gray-900">
                                        Product <ArrowUpDown size={14} />
                                    </button>
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                                    <button className="flex items-center gap-1 hover:text-gray-900">
                                        Price <ArrowUpDown size={14} />
                                    </button>
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Variants</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Category</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product, index) => {
                                    const status = getStockStatus(product);
                                    return (
                                        <motion.tr
                                            key={product.id}
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
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                        {product.images?.[0] ? (
                                                            <Image
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                width={48}
                                                                height={48}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                                                                <Package size={20} className="text-emerald-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{product.name}</p>
                                                        <p className="text-xs text-gray-500">{product.short_description?.slice(0, 40)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
                                                    {product.original_price && (
                                                        <p className="text-xs text-gray-400 line-through">₹{product.original_price}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {product.product_variants?.length || 0} variants
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge[status]}`}>
                                                    {status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/products/${product.slug}`}
                                                        target="_blank"
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                                        title="View Product"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/${product.id}`}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                                        title="Edit Product"
                                                    >
                                                        <Edit size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        Showing {filteredProducts.length} of {products.length} products
                    </p>
                </div>
            </div>
        </div>
    );
}
