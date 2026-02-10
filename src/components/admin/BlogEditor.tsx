'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    Eye,
    Upload,
    Bold,
    Italic,
    List,
    Link as LinkIcon,
    Image as ImageIcon,
    Loader2,
    X,
    Check
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import type { BlogPost, BlogPostUpdate } from '@/types/database';
import { toast } from 'react-hot-toast';

interface BlogEditorProps {
    initialData?: Partial<BlogPost>;
    isEditing?: boolean;
    onSave: (data: any) => Promise<void>;
}

export function BlogEditor({ initialData, isEditing = false, onSave }: BlogEditorProps) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        category: initialData?.category || 'Health',
        status: initialData?.published ? 'published' : 'draft',
        author: initialData?.author || 'Admin',
        image: initialData?.image || '',
        read_time: initialData?.read_time || '',
        featured: initialData?.featured || false,
    });

    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [showPreview, setShowPreview] = useState(false); // Toggle preview pane
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialData?.slug);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-generate slug from title
    useEffect(() => {
        if (!isEditing && !slugManuallyEdited && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title, isEditing, slugManuallyEdited]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'slug') setSlugManuallyEdited(true);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, featured: e.target.checked }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `blog-images/${fileName}`;

            // Check if bucket exists/is accessible (implicit by upload attempt)
            const { error: uploadError } = await supabase.storage
                .from('blog-images') // Assumes bucket exists
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('blog-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image: data.publicUrl }));
            toast.success('Image uploaded successfully');
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(`Upload failed: ${error.message}. Ensure 'blog-images' bucket exists.`);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const insertText = (before: string, after: string = '') => {
        const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const beforeText = text.substring(0, start);
        const selectedText = text.substring(start, end);
        const afterText = text.substring(end);

        const newText = beforeText + before + selectedText + after + afterText;
        setFormData(prev => ({ ...prev, content: newText }));

        // Use timeout to set selection after render
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.content) {
            toast.error('Title and Content are required');
            return;
        }

        try {
            setSaving(true);
            await onSave({
                ...formData,
                published: formData.status === 'published',
                updated_at: new Date().toISOString(),
                // If creating, add created_at? handled by parent usually or component
            });
            // Parent handles redirect/refresh
        } catch (error: any) {
            console.error('Save error:', error);
            toast.error(error.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/content/blog"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <span className="text-xl">←</span>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Post' : 'New Blog Post'}</h1>
                        <p className="text-gray-500">{isEditing ? 'Update your article' : 'Create a new article'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showPreview ? 'bg-gray-100 border-gray-300' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                        <Eye size={18} />
                        {showPreview ? 'Hide Preview' : 'Preview'}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium disabled:opacity-70"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Saving...' : (isEditing ? 'Update' : 'Publish')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter post title..."
                            className="w-full text-2xl font-bold border-none outline-none placeholder-gray-300 focus:ring-0"
                        />
                    </div>

                    {/* Content Editor */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4 overflow-x-auto">
                            <button onClick={() => insertText('<b>', '</b>')} className="p-2 hover:bg-gray-100 rounded" title="Bold"><Bold size={18} /></button>
                            <button onClick={() => insertText('<i>', '</i>')} className="p-2 hover:bg-gray-100 rounded" title="Italic"><Italic size={18} /></button>
                            <button onClick={() => insertText('<h3>', '</h3>')} className="p-2 hover:bg-gray-100 rounded font-bold text-sm" title="Heading">H3</button>
                            <button onClick={() => insertText('<ul>\n  <li>', '</li>\n</ul>')} className="p-2 hover:bg-gray-100 rounded" title="List"><List size={18} /></button>
                            <button onClick={() => insertText('<a href="url">', '</a>')} className="p-2 hover:bg-gray-100 rounded" title="Link"><LinkIcon size={18} /></button>
                            <button onClick={() => insertText('<img src="url" alt="desc" class="w-full rounded-lg my-4" />')} className="p-2 hover:bg-gray-100 rounded" title="Image Code"><ImageIcon size={18} /></button>
                        </div>

                        <div className={`grid gap-4 h-[600px] ${showPreview ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Write your post content (HTML supported)..."
                                className="w-full h-full border-none outline-none resize-none placeholder-gray-400 font-mono text-sm p-2 bg-gray-50/50 rounded-lg"
                            />
                            {showPreview && (
                                <div className="h-full overflow-y-auto border-l border-gray-100 pl-4 prose prose-emerald max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-400 italic">Preview will appear here...</p>' }} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                            placeholder="Brief summary for cards and SEO..."
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Status & Meta */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Publish Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                                <input
                                    type="text"
                                    name="read_time"
                                    value={formData.read_time}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="e.g. 5 min read"
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={handleCheckboxChange}
                                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                />
                                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Post</label>
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Featured Image</h3>
                        <div
                            className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {uploading ? (
                                <Loader2 className="animate-spin mx-auto text-emerald-500" size={32} />
                            ) : formData.image ? (
                                <div className="relative">
                                    <img src={formData.image} alt="Preview" className="w-full h-auto rounded-lg max-h-40 object-cover mx-auto" />
                                    <div className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 cursor-pointer shadow-sm hover:bg-white" onClick={(e) => { e.stopPropagation(); setFormData(p => ({ ...p, image: '' })); }}>
                                        <X size={16} />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">Click to upload image</p>
                                    <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP</p>
                                </>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        {formData.image && (
                            <div className="mt-3">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1 text-xs border border-gray-200 rounded text-gray-600 focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        )}
                    </div>

                    {/* SEO Slug */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">SEO Settings</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono text-gray-600"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
