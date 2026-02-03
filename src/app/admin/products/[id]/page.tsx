'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Upload,
    Plus,
    Trash2,
    Save,
    Eye,
    X,
    GripVertical,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
    getProductById,
    updateProduct,
    updateProductVariant,
    addProductVariant,
    deleteProductVariant
} from '@/lib/api/products';
import { Product, ProductVariant } from '@/types/database';

// Extended type for UI handling
type EditableVariant = Partial<ProductVariant> & {
    tempId?: string; // For new variants not yet saved to DB
    isDeleted?: boolean;
};

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('General');

    // Product State
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        short_description: '',
        category: 'Powder',
        in_stock: true, // Maps to Status
        price: 0,
        original_price: 0,
        images: [],
    });

    // Variants State
    const [variants, setVariants] = useState<EditableVariant[]>([]);
    const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([]);

    // Images State (Local handling before upload logic - simple URL list for now)
    const [imageInput, setImageInput] = useState('');

    const tabs = ['General', 'Pricing', 'Images', 'Variants', 'SEO'];

    useEffect(() => {
        loadProduct();
    }, [productId]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await getProductById(productId);
            if (!data) {
                toast.error('Product not found');
                router.push('/admin/products');
                return;
            }

            setFormData({
                name: data.name,
                description: data.description || '',
                short_description: data.short_description || '',
                category: data.category,
                in_stock: data.in_stock,
                price: data.price,
                original_price: data.original_price || 0,
                images: data.images || [],
            });

            // Map variants
            if (data.product_variants) {
                setVariants(data.product_variants.map(v => ({ ...v })));
            } else {
                setVariants([]);
            }

        } catch (error) {
            console.error('Error loading product:', error);
            toast.error('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let val: any = value;
        if (type === 'number') {
            val = Number(value);
        } else if (name === 'in_stock') {
            // Handle select for status mapping to boolean
            val = value === 'active';
        }

        setFormData(prev => ({ ...prev, [name]: val }));
    };

    // Variant Handlers
    const handleAddVariant = () => {
        const newVariant: EditableVariant = {
            tempId: `new-${Date.now()}`,
            product_id: productId,
            name: '',
            sku: '',
            price: 0,
            original_price: 0,
            in_stock: true,
        };
        setVariants([...variants, newVariant]);
    };

    const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
        const updated = [...variants];
        updated[index] = { ...updated[index], [field]: value };
        setVariants(updated);
    };

    const handleDeleteVariant = (index: number) => {
        const variant = variants[index];
        if (variant.id) {
            setDeletedVariantIds(prev => [...prev, variant.id!]);
        }
        const updated = variants.filter((_, i) => i !== index);
        setVariants(updated);
    };

    // Save All
    const handleSave = async () => {
        try {
            setSaving(true);

            // 1. Update Main Product
            console.log('Updating main product...', productId);
            await updateProduct(productId, {
                ...formData,
                updated_at: new Date().toISOString(),
            });

            // 2. Process Variants
            // 2. Process Variants
            const variantPromises = variants.map(async (v) => {
                const sku = v.sku === '' ? null : v.sku; // Convert empty SKU to null

                if (v.id) {
                    // Update existing
                    // Extract non-DB fields and readonly fields
                    const { tempId, isDeleted, created_at, sku: oldSku, ...rest } = v;
                    return updateProductVariant(v.id, { ...rest, sku });
                } else {
                    // Create new
                    // Extract non-DB fields and 'id'
                    const { tempId, id, isDeleted, created_at, sku: oldSku, ...rest } = v;
                    // Ensure product_id is set
                    return addProductVariant({
                        ...rest,
                        sku,
                        product_id: productId,
                        name: rest.name || 'New Variant',
                        price: rest.price || 0
                    } as any);
                }
            });

            // 3. Process Deletions
            const deletePromises = deletedVariantIds.map(id => deleteProductVariant(id));

            await Promise.all([...variantPromises, ...deletePromises]);

            toast.success('Product updated successfully');
            loadProduct(); // Reload to get fresh IDs etc.
            setDeletedVariantIds([]);

        } catch (error: any) {
            console.error('Error saving product:', error?.message || error);
            toast.error(error?.message || 'Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-gray-50 z-10 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/products"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                        <p className="text-gray-500">{formData.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Eye size={18} />
                        Preview
                    </button> */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50/50">
                    <nav className="flex gap-1 p-2 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
                                    ? 'bg-white text-emerald-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* General Tab */}
                    {activeTab === 'General' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name*</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleProductChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleProductChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="Powder">Powder</option>
                                        <option value="Capsules">Capsules</option>
                                        <option value="Tea">Tea</option>
                                        <option value="Bundle">Bundle</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                                <input
                                    type="text"
                                    name="short_description"
                                    value={formData.short_description || ''}
                                    onChange={handleProductChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleProductChange}
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-mono text-sm"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Pricing Tab */}
                    {activeTab === 'Pricing' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                                <div className="mt-1 text-blue-600">ℹ️</div>
                                <p className="text-sm text-blue-800">
                                    This is the base price for the product. If you have variants, their prices will override this.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (₹)*</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleProductChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                                    <input
                                        type="number"
                                        name="original_price"
                                        value={formData.original_price || 0}
                                        onChange={handleProductChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Status</label>
                                <select
                                    name="in_stock"
                                    value={formData.in_stock ? 'active' : 'out_of_stock'}
                                    onChange={handleProductChange}
                                    className="w-full md:w-1/2 px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="active">Active (In Stock)</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                </select>
                            </div>
                        </motion.div>
                    )}

                    {/* Variants Tab */}
                    {activeTab === 'Variants' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-medium text-gray-900">Product Variants</h3>
                                    <p className="text-sm text-gray-500">Manage sizes, packs, or flavors.</p>
                                </div>
                                <button
                                    onClick={handleAddVariant}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                                >
                                    <Plus size={18} />
                                    Add Variant
                                </button>
                            </div>

                            <div className="space-y-4">
                                {variants.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <p className="text-gray-500">No variants added yet.</p>
                                    </div>
                                ) : (
                                    variants.map((variant, index) => (
                                        <div key={variant.id || variant.tempId} className="p-5 bg-gray-50 border border-gray-200 rounded-xl relative group transition-shadow hover:shadow-md">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                                <div className="lg:col-span-1">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Variant Name</label>
                                                    <input
                                                        type="text"
                                                        value={variant.name}
                                                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                                                        placeholder="e.g. 100g Pouch"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    />
                                                </div>
                                                <div className="lg:col-span-1">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">SKU</label>
                                                    <input
                                                        type="text"
                                                        value={variant.sku || ''}
                                                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                                        placeholder="SKU-123"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    />
                                                </div>
                                                <div className="lg:col-span-1">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Price (₹)</label>
                                                    <input
                                                        type="number"
                                                        value={variant.price || ''}
                                                        onChange={(e) => handleVariantChange(index, 'price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    />
                                                </div>
                                                <div className="lg:col-span-1">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Orig. Price (₹)</label>
                                                    <input
                                                        type="number"
                                                        value={variant.original_price || ''}
                                                        onChange={(e) => handleVariantChange(index, 'original_price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    />
                                                </div>
                                                <div className="lg:col-span-1">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Status</label>
                                                    <select
                                                        value={variant.in_stock ? 'active' : 'inactive'}
                                                        onChange={(e) => handleVariantChange(index, 'in_stock', e.target.value === 'active')}
                                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${variant.in_stock ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}
                                                    >
                                                        <option value="active">In Stock</option>
                                                        <option value="inactive">Out of Stock</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteVariant(index)}
                                                className="absolute -top-3 -right-3 p-2 bg-white text-red-500 border border-gray-200 rounded-full shadow-sm hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete Variant"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Images Tab */}
                    {activeTab === 'Images' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <p className="text-sm text-gray-500">
                                Image management is currently simplified. Add direct URLs below.
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="https://example.com/image.jpg"
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                                    value={imageInput}
                                    onChange={(e) => setImageInput(e.target.value)}
                                />
                                <button
                                    onClick={() => {
                                        if (imageInput) {
                                            setFormData(prev => ({ ...prev, images: [...(prev.images || []), imageInput] }));
                                            setImageInput('');
                                        }
                                    }}
                                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.images?.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    images: prev.images?.filter((_, i) => i !== idx)
                                                }));
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
