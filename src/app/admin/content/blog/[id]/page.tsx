'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBlogPostById } from '@/lib/api/blog';
import { deleteBlogPostAction, updateBlogPostAction } from '@/app/actions/blog';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
// import { supabase } from '@/lib/supabase'; // Not needed anymore for delete

export default function EditBlogPostPage() {
    const params = useParams();
    const router = useRouter();
    const postId = params.id as string;

    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return;
            try {
                setLoading(true);
                const data = await getBlogPostById(postId);
                if (data) {
                    setPost(data);
                } else {
                    setError('Post not found');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch post');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleUpdate = async (data: any) => {
        // Prepare update object
        // Omit id, created_at
        const { id, created_at, ...updateData } = data;

        await updateBlogPostAction(postId, updateData);
        toast.success('Post updated successfully!');
        router.push('/admin/content/blog');
        router.refresh();
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;

        try {
            // Use Server Action to bypass RLS
            await deleteBlogPostAction(postId);

            toast.success('Post deleted successfully');
            router.push('/admin/content/blog');
            router.refresh();
        } catch (err: any) {
            console.error('Delete error:', err);
            toast.error('Failed to delete post: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="ml-2 text-gray-600">Loading editor...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <p className="text-red-600 text-lg">{error}</p>
                <button
                    onClick={() => router.push('/admin/content/blog')}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                    Back to List
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Delete button positioned absolute or passed to editor? 
                 Editor doesn't have delete button props currently.
                 Let's wrap Editor or add a Delete button below it or above it. 
                 Since Editor handles the header, we can't easily inject buttons into its header without modifying Editor props.
                 
                 Option 1: Modify BlogEditor to accept additionalActions or onDelete.
                 Option 2: Just place Delete button below.
                 Option 3: Place Delete button absolutely positioned at top right (might conflict).
                 
                 Let's Modify BlogEditor to accept onDelete prop for better UX. 
                 But for now, I'll place it at the bottom to avoid changing Component signature again immediately or place it above.
              */}

            {/* Actually, let's update BlogEditor to handle delete if we want consistent UI. 
                 But simpler is to put it here.
             */}

            <BlogEditor initialData={post} isEditing onSave={handleUpdate} />

            <div className="mt-8 border-t pt-6">
                <div className="flex justify-end">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={18} />
                        Delete Post
                    </button>
                </div>
            </div>
        </div>
    );
}
