'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Upload,
    Plus,
    Trash2,
    Save,
    Eye,
    X,
    GripVertical
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createProduct, addProductVariant } from '@/lib/api/products';
import { generateSlug } from '@/lib/utils';
import toast from 'react-hot-toast';
import { ProductVariantInsert } from '@/types/database';

interface ProductVariantState {
    id: string; // temporary id for UI
    name: string;
    sku: string;
    price: number | '';
    stock: number;
    weight: number;
    in_stock: boolean;
}

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    // General
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [category, setCategory] = useState({ value: 'Powder', label: 'Powder' });
    const [shortDescription, setShortDescription] = useState('');
    const [fullDescription, setFullDescription] = useState('');
    const [tags, setTags] = useState('');

    // Pricing & Inventory (Main Product)
    const [price, setPrice] = useState<number | ''>('');
    const [originalPrice, setOriginalPrice] = useState<number | ''>('');
    const [sku, setSku] = useState('');     // Not directly on product table in current schema, but good to have in mind
    const [stock, setStock] = useState<number | ''>(''); // Not directly on product table
    const [inStock, setInStock] = useState(true);

    // Images
    const [images, setImages] = useState<string[]>([]);
    const [imageInput, setImageInput] = useState('');

    // SEO
    const [seoTitle, setSeoTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [seoKeywords, setSeoKeywords] = useState('');

    // Variants
    const [variants, setVariants] = useState<ProductVariantState[]>([
        { id: '1', name: '100g', sku: '', price: '', stock: 0, weight: 100, in_stock: true }
    ]);

    const tabs = [
        { id: 'general', label: 'General' },
        { id: 'pricing', label: 'Pricing & Inventory' },
        { id: 'images', label: 'Images' },
        { id: 'variants', label: 'Variants' },
        { id: 'seo', label: 'SEO' },
    ];

    const generateSlugFromName = () => {
        if (name && !slug) {
            setSlug(generateSlug(name));
        }
    };

    const handleAddImage = () => {
        if (imageInput.trim()) {
            setImages([...images, imageInput.trim()]);
            setImageInput('');
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const addVariant = () => {
        setVariants([...variants, {
            id: Date.now().toString(),
            name: '',
            sku: '',
            price: '',
            stock: 0,
            weight: 0,
            in_stock: true
        }]);
    };

    const removeVariant = (id: string) => {
        setVariants(variants.filter(v => v.id !== id));
    };

    const updateVariant = (id: string, field: keyof ProductVariantState, value: any) => {
        setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const handleSave = async () => {
        if (!name || !price) {
            toast.error('Name and Price are required');
            return;
        }

        setLoading(true);
        try {
            // 1. Create Product
            const productData = {
                name,
                slug: slug || generateSlug(name),
                description: fullDescription,
                short_description: shortDescription,
                price: Number(price),
                original_price: originalPrice ? Number(originalPrice) : null,
                category: category.value,
                in_stock: inStock,
                featured: false, // Default
                images: images,
                // Using array-based data for now as simple placeholders if needed, 
                // or you could parse 'tags' into benefits/ingredients
                benefits: [],
                ingredients: [],
                certifications: [],
                rating: 5,
                review_count: 0
            };

            const newProduct = await createProduct(productData);

            // 2. Create Variants
            if (variants.length > 0) {
                for (const v of variants) {
                    if (v.name && v.price) {
                        const variantData: ProductVariantInsert = {
                            product_id: newProduct.id,
                            name: v.name,
                            price: Number(v.price),
                            // original_price: null, // Add if UI supports it
                            in_stock: v.in_stock,
                            sku: v.sku || null
                        };
                        await addProductVariant(variantData);
                    }
                }
            }

            toast.success('Product created successfully!');
            router.push('/admin/products');

        } catch (error: any) {
            console.error('Error creating product:', error);
            toast.error(error.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                        <p className="text-gray-500">Create a new product listing</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                        <Save size={18} />
                        {loading ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100" suppressHydrationWarning>
                <div className="border-b border-gray-100">
                    <nav className="flex gap-1 p-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* General Tab */}
                    <div className={activeTab === 'general' ? 'block' : 'hidden'}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onBlur={generateSlugFromName}
                                        placeholder="e.g., Organic Moringa Powder"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                                    <div className="flex items-center">
                                        <span className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-gray-500 text-sm">
                                            /products/
                                        </span>
                                        <input
                                            type="text"
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                            placeholder="organic-moringa-powder"
                                            className="flex-1 px-4 py-3 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={category.value}
                                        onChange={(e) => setCategory({ value: e.target.value, label: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                    >
                                        <option value="Powder">Powder</option>
                                        <option value="Capsules">Capsules</option>
                                        <option value="Tea">Tea</option>
                                        <option value="Bundle">Bundle</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                                    <textarea
                                        rows={3}
                                        value={shortDescription}
                                        onChange={(e) => setShortDescription(e.target.value)}
                                        placeholder="Brief product description..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="organic, superfood, moringa (comma separated)"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                            <textarea
                                rows={6}
                                value={fullDescription}
                                onChange={(e) => setFullDescription(e.target.value)}
                                placeholder="Detailed product description with benefits, usage, etc..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                            />
                        </div>
                    </div>

                    {/* Pricing Tab */}
                    <div className={activeTab === 'pricing' ? 'block' : 'hidden'}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                    placeholder="599"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                                <input
                                    type="number"
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                    placeholder="799"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={inStock}
                                    onChange={(e) => setInStock(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-sm text-gray-700">In Stock</span>
                            </label>
                        </div>
                    </div>

                    {/* Images Tab */}
                    <div className={activeTab === 'images' ? 'block' : 'hidden'}>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-emerald-400 transition-colors">
                            <Upload className="mx-auto text-gray-400 mb-4" size={40} />
                            <p className="text-gray-600 font-medium mb-4">Add Image URL</p>
                            <div className="flex gap-2 max-w-md mx-auto">
                                <input
                                    type="text"
                                    value={imageInput}
                                    onChange={(e) => setImageInput(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <button
                                    onClick={handleAddImage}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Variants Tab */}
                    <div className={activeTab === 'variants' ? 'block' : 'hidden'}>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-gray-600">Add product variants like different sizes</p>
                            <button
                                onClick={addVariant}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                <Plus size={18} />
                                Add Variant
                            </button>
                        </div>
                        <div className="space-y-4">
                            {variants.map((variant) => (
                                <div key={variant.id} className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-1 min-w-[150px]">
                                        <input
                                            type="text"
                                            value={variant.name}
                                            onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                                            placeholder="Name (e.g. 100g)"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="w-32">
                                        <input
                                            type="number"
                                            value={variant.price}
                                            onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                                            placeholder="Price"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div className="w-32">
                                        <input
                                            type="text"
                                            value={variant.sku}
                                            onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                                            placeholder="SKU"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={variant.in_stock}
                                            onChange={(e) => updateVariant(variant.id, 'in_stock', e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm text-gray-700">In Stock</span>
                                    </label>
                                    <button
                                        onClick={() => removeVariant(variant.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SEO Tab */}
                    <div className={activeTab === 'seo' ? 'block' : 'hidden'}>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
                                <input
                                    type="text"
                                    value={seoTitle}
                                    onChange={(e) => setSeoTitle(e.target.value)}
                                    placeholder="Organic Moringa Powder | ORYIZON"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                                <textarea
                                    rows={3}
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    placeholder="Premium organic moringa powder packed with nutrients..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                                <input
                                    type="text"
                                    value={seoKeywords}
                                    onChange={(e) => setSeoKeywords(e.target.value)}
                                    placeholder="moringa powder, organic superfood"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
