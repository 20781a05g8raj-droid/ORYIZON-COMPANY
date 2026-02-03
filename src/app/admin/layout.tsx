'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { AdminSidebar, AdminTopbar } from '@/components/admin/AdminLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    React.useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // Middleware handles this, but safe to have
                router.push('/admin/login');
                return;
            }

            // STRICT Check: Only allow allowlisted admin email
            // In a real app, you'd check a 'role' in public.users or metadata
            if (session.user.email !== 'admin@oryizon.com') {
                router.push('/'); // Redirect unauthorized users to home
                return;
            }

            setLoading(false);
        };

        checkAdmin();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100" suppressHydrationWarning={true}>
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100" suppressHydrationWarning>
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:ml-64 transition-all duration-300" suppressHydrationWarning>
                <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
