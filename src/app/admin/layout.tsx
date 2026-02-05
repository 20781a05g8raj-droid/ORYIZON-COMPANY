'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { AdminSidebar, AdminTopbar } from '@/components/admin/AdminLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const isAdmin = session?.user?.email === 'admin@oryizon.com';

            // Case 1: Login Page
            if (pathname === '/admin/login') {
                if (isAdmin) {
                    router.push('/admin');
                    return;
                }
                setLoading(false);
                return;
            }

            // Case 2: Protected Admin Pages
            if (!isAdmin) {
                setIsUnauthorized(true);
                setLoading(false);
                return;
            }

            setLoading(false);
        };

        checkAdmin();
    }, [router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100" suppressHydrationWarning={true}>
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (isUnauthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-black font-bold text-3xl" suppressHydrationWarning>
                KUCH NAHI HAI BAHI
            </div>
        );
    }

    // Don't show admin sidebar/layout on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
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
