'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, Package, MapPin, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setUser(session.user);
            setLoading(false);
        };
        getUser();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success('Logged out successfully');
        router.push('/login');
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-[#FBF9F4]">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 font-heading">My Account</h1>
                            <p className="text-gray-500">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium w-fit"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Profile Section */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <User className="text-emerald-600" size={20} />
                                Profile Details
                            </h2>
                            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
                                    <p className="text-gray-900 font-medium">{user?.user_metadata?.full_name || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                                    <p className="text-gray-900 font-medium">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders Placeholder */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Package className="text-emerald-600" size={20} />
                                Recent Orders
                            </h2>
                            <div className="bg-gray-50 p-6 rounded-xl text-center py-12">
                                <p className="text-gray-500">No orders found.</p>
                                <button className="mt-4 text-emerald-600 font-medium hover:underline">
                                    Start Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
