'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Store,
    CreditCard,
    Truck,
    Bell,
    Shield,
    Mail,
    Save,
    Upload,
    Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
    getShippingSettings,
    updateShippingSettings,
    type ShippingSettings
} from '@/lib/api/settings';

const tabs = [
    { id: 'general', label: 'General', icon: <Store size={18} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={18} /> },
    { id: 'shipping', label: 'Shipping', icon: <Truck size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Shipping settings state
    const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
        freeShippingThreshold: 499,
        standardShipping: 50,
        expressShipping: 100,
        deliveryTime: {
            standard: '5-7 business days',
            express: '2-3 business days',
        },
    });

    // Fetch shipping settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getShippingSettings();
                setShippingSettings(settings);
            } catch (error) {
                console.error('Error fetching shipping settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSaveShipping = async () => {
        setSaving(true);
        try {
            const success = await updateShippingSettings(shippingSettings);
            if (success) {
                toast.success('Shipping settings saved successfully!');
            } else {
                toast.error('Failed to save settings. Please try again.');
            }
        } catch (error) {
            console.error('Error saving shipping settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleSave = () => {
        if (activeTab === 'shipping') {
            handleSaveShipping();
        } else {
            toast.success('Settings saved!');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500">Manage your store configuration</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${saving
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Tabs */}
                <div className="lg:w-64 flex-shrink-0">
                    <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === tab.id
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {tab.icon}
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {/* General Settings */}
                    {activeTab === 'general' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
                        >
                            <h2 className="text-lg font-semibold text-gray-900">Store Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                                    <input
                                        type="text"
                                        defaultValue="ORYIZON"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                                    <input
                                        type="text"
                                        defaultValue="Pure. Organic. Powerful."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Store Logo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Store size={32} className="text-gray-400" />
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Upload size={18} />
                                        Upload Logo
                                    </button>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <div className="flex items-center gap-2">
                                        <Mail size={18} className="text-gray-400" />
                                        <input
                                            type="email"
                                            defaultValue="oryizoncompany@gmail.com"
                                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        defaultValue="+91 8969124404"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <textarea
                                    rows={3}
                                    defaultValue="Raxaul, Singhpur Haraiya, Bihar- 845350 INDIA"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                />
                            </div>

                            <hr className="border-gray-100" />

                            <h2 className="text-lg font-semibold text-gray-900">Regional Settings</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                                    <select className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                        <option>INR (₹)</option>
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                                    <select className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                        <option>Asia/Kolkata (IST)</option>
                                        <option>UTC</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                                    <input
                                        type="number"
                                        defaultValue="18"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Payments Settings */}
                    {activeTab === 'payments' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
                        >
                            <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>

                            <div className="space-y-4">
                                {['Razorpay', 'PayU', 'Cash on Delivery', 'Bank Transfer'].map((method, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <CreditCard size={20} className="text-emerald-600" />
                                            </div>
                                            <span className="font-medium text-gray-900">{method}</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked={index < 2} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Shipping Settings - DATABASE CONNECTED */}
                    {activeTab === 'shipping' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Shipping Configuration</h2>
                                {loading && <Loader2 size={20} className="animate-spin text-emerald-600" />}
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                <p className="text-sm text-emerald-800">
                                    <strong>💡 Tip:</strong> Changes here will update shipping costs across the entire website including cart, checkout, and product pages.
                                </p>
                            </div>

                            {/* Free Shipping Threshold */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Free Shipping Threshold (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={shippingSettings.freeShippingThreshold}
                                        onChange={(e) => setShippingSettings({
                                            ...shippingSettings,
                                            freeShippingThreshold: parseInt(e.target.value) || 0
                                        })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="499"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Orders above this amount get free shipping
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Standard Shipping Cost (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={shippingSettings.standardShipping}
                                        onChange={(e) => setShippingSettings({
                                            ...shippingSettings,
                                            standardShipping: parseInt(e.target.value) || 0
                                        })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="50"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Default shipping cost for orders below threshold
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Express Shipping Cost (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={shippingSettings.expressShipping}
                                        onChange={(e) => setShippingSettings({
                                            ...shippingSettings,
                                            expressShipping: parseInt(e.target.value) || 0
                                        })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Cost for express/fast delivery option
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Current Settings Preview</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Free shipping on orders ₹{shippingSettings.freeShippingThreshold}+</li>
                                        <li>• Standard: ₹{shippingSettings.standardShipping}</li>
                                        <li>• Express: ₹{shippingSettings.expressShipping}</li>
                                    </ul>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <h3 className="text-md font-semibold text-gray-900">Delivery Time Estimates</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Standard Delivery Time
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingSettings.deliveryTime.standard}
                                        onChange={(e) => setShippingSettings({
                                            ...shippingSettings,
                                            deliveryTime: {
                                                ...shippingSettings.deliveryTime,
                                                standard: e.target.value
                                            }
                                        })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="5-7 business days"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Express Delivery Time
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingSettings.deliveryTime.express}
                                        onChange={(e) => setShippingSettings({
                                            ...shippingSettings,
                                            deliveryTime: {
                                                ...shippingSettings.deliveryTime,
                                                express: e.target.value
                                            }
                                        })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="2-3 business days"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Notifications Settings */}
                    {activeTab === 'notifications' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
                        >
                            <h2 className="text-lg font-semibold text-gray-900">Email Notifications</h2>

                            <div className="space-y-4">
                                {[
                                    { label: 'New order placed', description: 'Get notified when a new order is placed', defaultChecked: true },
                                    { label: 'Order shipped', description: 'Notify customer when order is shipped', defaultChecked: true },
                                    { label: 'Order delivered', description: 'Notify customer when order is delivered', defaultChecked: true },
                                    { label: 'Low stock alert', description: 'Get notified when product stock is low', defaultChecked: true },
                                    { label: 'New customer signup', description: 'Get notified when a new customer registers', defaultChecked: false },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.label}</p>
                                            <p className="text-sm text-gray-500">{item.description}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
                        >
                            <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                    </div>
                                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                                        Enable
                                    </button>
                                </div>

                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <p className="font-medium text-gray-900 mb-4">Change Password</p>
                                    <div className="space-y-4">
                                        <input
                                            type="password"
                                            placeholder="Current password"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                        <input
                                            type="password"
                                            placeholder="New password"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Confirm new password"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                                            Update Password
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">Login Activity</p>
                                        <p className="text-sm text-gray-500">View all active sessions</p>
                                    </div>
                                    <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                                        View All
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
