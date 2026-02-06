'use client';

// ... imports
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import SignUpAlertModal from '@/components/auth/SignUpAlertModal';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSignUpAlert, setShowSignUpAlert] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            toast.success('Successfully logged in!');
            router.push('/account');
            router.refresh();
        } catch (error: any) {
            console.error('Login error:', error);

            // Check for specific error message regarding invalid credentials
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
        <div className="min-h-screen pt-24 pb-12 bg-[#FBF9F4] flex items-center justify-center p-4" suppressHydrationWarning>
            <SignUpAlertModal isOpen={showSignUpAlert} onClose={() => setShowSignUpAlert(false)} />

            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-gray-100" suppressHydrationWarning>
                <div className="p-8 text-center" suppressHydrationWarning>
                    <h1 className="text-3xl font-bold text-[#2D5016] font-heading mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to access your account</p>
                </div>

                <div className="p-8 pt-0" suppressHydrationWarning>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="login-email"
                                    id="login-email"
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
                                    name="login-password"
                                    id="login-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2D5016]/20 focus:border-[#2D5016] transition-all"
                                    placeholder="••••••••"
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
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} className="ml-2" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={async () => {
                            try {
                                await supabase.auth.signInWithOAuth({
                                    provider: 'google',
                                    options: {
                                        redirectTo: `${window.location.origin}/auth/callback`,
                                    },
                                });
                            } catch (error: any) {
                                toast.error(error.message || 'Failed to login with Google');
                            }
                        }}
                        type="button"
                        className="w-full flex justify-center items-center py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all font-medium text-gray-700"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            className="w-5 h-5 mr-3"
                        />
                        Continue with Google
                    </button>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-[#2D5016] font-medium hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

