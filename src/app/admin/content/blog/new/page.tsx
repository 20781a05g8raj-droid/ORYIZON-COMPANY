'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { createBlogPostAction } from '@/app/actions/blog';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { toast } from 'react-hot-toast';

export default function NewBlogPostPage() {
    const router = useRouter();

    const handleCreate = async (data: any) => {
        // Insert into DB using Server Action
        await createBlogPostAction({
            ...data,
            created_at: new Date().toISOString()
        });

        toast.success('Blog post created successfully!');
        router.push('/admin/content/blog');
        router.refresh();
    };

    return <BlogEditor onSave={handleCreate} />;
}
