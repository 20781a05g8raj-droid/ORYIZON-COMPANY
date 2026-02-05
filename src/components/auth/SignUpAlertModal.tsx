'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SignUpAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SignUpAlertModal({ isOpen, onClose }: SignUpAlertModalProps) {
    const router = useRouter();

    const handleSignUpClick = () => {
        onClose();
        router.push('/signup');
    };

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
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-white/50 rounded-full p-1"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        <div className="bg-gradient-to-br from-[#2D5016] to-[#1A3009] p-8 text-center relative overflow-hidden">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                            <motion.div
                                initial={{ rotate: -10, scale: 0.8 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="relative z-10 w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-lg"
                            >
                                <UserPlus className="text-white" size={40} />
                            </motion.div>
                            <h3 className="relative z-10 text-2xl font-bold text-white mb-1 font-heading">Account Required</h3>
                            <p className="relative z-10 text-emerald-100 text-sm">Join our community to continue</p>
                        </div>

                        <div className="p-8 text-center">
                            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                We couldn't find an account with that email. Please <span className="font-bold text-[#2D5016]">Sign Up</span> first to access these features.
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={handleSignUpClick}
                                    className="w-full py-3.5 px-4 bg-[#2D5016] text-white rounded-xl font-medium hover:bg-[#1a300d] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#2D5016]/20 flex items-center justify-center gap-2"
                                >
                                    <UserPlus size={18} />
                                    Create Account
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3.5 px-4 bg-gray-50 text-gray-600 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Try Another Email
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
