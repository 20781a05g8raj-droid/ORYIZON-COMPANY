'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, ArrowRight, Loader, UserPlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

function SignUpAlertModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="bg-gradient-to-br from-[#2D5016] to-[#1A3009] p-6 text-center">
                            <motion.div
                                initial={{ rotate: -10, scale: 0.8 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md"
                            >
                                <UserPlus className="text-white" size={32} />
                            </motion.div>
                            <h3 className="text-xl font-bold text-white mb-1">Account Required</h3>
                        </div>

                        <div className="p-6 text-center">
                            <p className="text-gray-600 mb-6 text-lg">
                                Please <span className="font-bold text-[#2D5016]">Sign Up</span> to access the admin portal.
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full py-3 px-4 bg-[#2D5016] text-white rounded-xl font-medium hover:bg-[#1a300d] transition-colors shadow-lg shadow-[#2D5016]/20"
                            >
                                Got it
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSignUpAlert, setShowSignUpAlert] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            toast.success('Welcome back, Admin!');
            router.push('/admin');
            router.refresh();
        } catch (error: any) {
            console.error('Login error:', error);

            // Check for invalid credentials error
            if (error.message === 'Invalid login credentials') {
                setShowSignUpAlert(true);
            } else {
                toast.error(error.message || 'Failed to login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center p-4" suppressHydrationWarning>
            <SignUpAlertModal isOpen={showSignUpAlert} onClose={() => setShowSignUpAlert(false)} />

            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-gray-100" suppressHydrationWarning>
                {/* Header */}
                <div className="bg-[#2D5016] p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <Lock className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 font-heading">Admin Portal</h1>
                        <p className="text-emerald-100 text-sm">Secure access for authorized personnel only</p>
                    </div>
                </div>

                {/* Form */}
                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-[#2D5016]">
                                    <Mail size={18} className="text-gray-400 group-focus-within:text-[#2D5016] transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2D5016]/20 focus:border-[#2D5016] transition-all duration-200"
                                    placeholder="admin@oryizon.com"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-400 group-focus-within:text-[#2D5016] transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2D5016]/20 focus:border-[#2D5016] transition-all duration-200"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#2D5016] hover:bg-[#1a300d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D5016] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader size={18} className="animate-spin mr-2" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400">
                            Protected by ORYIZON Security • <a href="/" className="text-[#2D5016] hover:underline">Return to Home</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Ensure layout is clean (no header/footer) by exporting this page structure
// Next.js App Router uses layout.tsx, so we might need to handle this in layout or use a route group
