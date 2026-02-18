'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface ImageUploadProps {
    images: string[];
    altTexts: string[];
    onImagesChange: (images: string[]) => void;
    onAltTextsChange: (altTexts: string[]) => void;
}

export default function ImageUpload({
    images,
    altTexts,
    onImagesChange,
    onAltTextsChange
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setUploading(true);
        const newImages: string[] = [];
        const newAltTexts: string[] = [];

        try {
            for (const file of acceptedFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, file);

                if (uploadError) {
                    throw uploadError;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);

                newImages.push(publicUrl);
                newAltTexts.push(''); // Initialize with empty alt text
            }

            onImagesChange([...images, ...newImages]);
            onAltTextsChange([...altTexts, ...newAltTexts]);
            toast.success('Images uploaded successfully');
        } catch (error: any) {
            console.error('Error uploading images:', error);
            toast.error('Failed to upload images: ' + error.message);
        } finally {
            setUploading(false);
        }
    }, [images, altTexts, onImagesChange, onAltTextsChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        multiple: true
    });

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        const newAltTexts = altTexts.filter((_, i) => i !== index);
        onImagesChange(newImages);
        onAltTextsChange(newAltTexts);
    };

    const updateAltText = (index: number, value: string) => {
        const newAltTexts = [...altTexts];
        newAltTexts[index] = value;
        onAltTextsChange(newAltTexts);
    };

    return (
        <div className="space-y-6">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-400'
                    }`}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-emerald-600" size={40} />
                        <p className="text-gray-600 font-medium">Uploading...</p>
                    </div>
                ) : (
                    <>
                        <Upload className="mx-auto text-gray-400 mb-4" size={40} />
                        <p className="text-gray-600 font-medium mb-1">
                            {isDragActive ? 'Drop images here' : 'Drag & drop images here, or click to select'}
                        </p>
                        <p className="text-gray-400 text-sm">Supports PNG, JPG, JPEG, WEBP</p>
                    </>
                )}
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-lg p-3 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
                                <img
                                    src={img}
                                    alt={altTexts[idx] || `Product image ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    title="Remove image"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Alt Text (SEO)</label>
                                <input
                                    type="text"
                                    value={altTexts[idx] || ''}
                                    onChange={(e) => updateAltText(idx, e.target.value)}
                                    placeholder="Describe this image..."
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
