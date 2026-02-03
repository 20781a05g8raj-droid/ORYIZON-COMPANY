'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (error) throw error;

            toast.success('Account created! You can now log in.');
            // Automatically log in or redirect to login
            // Supabase auto-confirms if email confirmation is off, so we might need to check that.
            // For now, let's redirect to account if session exists, or login if not.

            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push('/account');
            } else {
                router.push('/login');
            }
            router.refresh();

        } catch (error: any) {
            console.error('Signup error:', error);
            toast.error(error.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#FBF9F4] flex items-center justify-center p-4" suppressHydrationWarning>
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-gray-100" suppressHydrationWarning>
                <div className="p-8 text-center" suppressHydrationWarning>
                    <h1 className="text-3xl font-bold text-[#2D5016] font-heading mb-2">Create Account</h1>
                    <p className="text-gray-500">Join ORYIZON for exclusive benefits</p>
                </div>

                <div className="p-8 pt-0" suppressHydrationWarning>
                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2D5016]/20 focus:border-[#2D5016] transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="signup-email"
                                    id="signup-email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2D5016]/20 focus:border-[#2D5016] transition-all"
                                    placeholder="you@example.com"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    name="signup-password"
                                    id="signup-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2D5016]/20 focus:border-[#2D5016] transition-all"
                                    placeholder="••••••••"
                                    minLength={6}
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-white bg-[#2D5016] hover:bg-[#1a300d] focus:outline-none focus:ring-2 focus:ring-[#2D5016] disabled:opacity-50 transition-all font-medium"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin mr-2" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Sign Up
                                    <ArrowRight size={18} className="ml-2" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#2D5016] font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
