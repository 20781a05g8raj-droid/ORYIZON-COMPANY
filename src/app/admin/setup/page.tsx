'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

export default function AdminSetupPage() {
    const [status, setStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const createAdmin = async () => {
        setLoading(true);
        setStatus('Creating user...');

        try {
            // 1. Try to Sign Up (creates the user)
            const { data, error } = await supabase.auth.signUp({
                email: 'admin@oryizon.com',
                password: 'admin123',
                options: {
                    data: {
                        role: 'admin'
                    }
                }
            });

            if (error) {
                // If user already exists, try to log in to verify
                if (error.message.includes('already registered')) {
                    setStatus('User already exists. Trying to login...');
                    const { error: loginError } = await supabase.auth.signInWithPassword({
                        email: 'admin@oryizon.com',
                        password: 'admin123'
                    });

                    if (loginError) throw loginError;
                    setStatus('Success! User exists and password is correct. You can go to /admin now.');
                } else {
                    throw error;
                }
            } else {
                setStatus('Success! Admin user created. You can now login at /admin/login');
            }
        } catch (err: any) {
            console.error(err);
            setStatus(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-4">Admin Setup</h1>
                <p className="mb-6 text-gray-600">
                    Click below to create the default admin user securely via the API.
                </p>

                <Button
                    onClick={createAdmin}
                    loading={loading}
                    fullWidth
                >
                    Create Admin User
                </Button>

                {status && (
                    <div className={`mt-6 p-4 rounded-lg text-sm ${status.includes('Success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}
