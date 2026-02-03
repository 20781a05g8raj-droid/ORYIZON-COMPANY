'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    FileText,
    Tag,
    BarChart3,
    Settings,
    HelpCircle,
    ChevronDown,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    User,
    ArrowLeft
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    {
        label: 'Products', href: '/admin/products', icon: <Package size={20} />, children: [
            { label: 'All Products', href: '/admin/products' },
            { label: 'Add Product', href: '/admin/products/new' },
            { label: 'Inventory', href: '/admin/products/inventory' },
        ]
    },
    { label: 'Orders', href: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { label: 'Customers', href: '/admin/customers', icon: <Users size={20} /> },
    {
        label: 'Content', href: '/admin/content', icon: <FileText size={20} />, children: [
            { label: 'Blog Posts', href: '/admin/content/blog' },
            { label: 'Pages', href: '/admin/content/pages' },
            { label: 'FAQ', href: '/admin/content/faq' },
        ]
    },
    {
        label: 'Marketing', href: '/admin/marketing', icon: <Tag size={20} />, children: [
            { label: 'Coupons', href: '/admin/marketing/coupons' },
            { label: 'Banners', href: '/admin/marketing/banners' },
            { label: 'Campaigns', href: '/admin/marketing/campaigns' },
        ]
    },
    { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={20} /> },
    { label: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
    { label: 'Support', href: '/admin/support', icon: <HelpCircle size={20} /> },
];

function NavItemComponent({ item, isCollapsed }: { item: NavItem; isCollapsed: boolean }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const isActive = pathname === item.href || (item.children && item.children.some(c => pathname === c.href));

    if (item.children && !isCollapsed) {
        return (
            <div suppressHydrationWarning>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${isActive
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                >
                    <span className="flex items-center gap-3">
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-4 mt-1 space-y-1"
                        >
                            {item.children.map(child => (
                                <Link
                                    key={child.href}
                                    href={child.href}
                                    className={`block px-4 py-2 rounded-lg text-sm transition-all ${pathname === child.href
                                        ? 'bg-emerald-600/20 text-emerald-400'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {child.label}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <Link
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                ? 'bg-emerald-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
            title={isCollapsed ? item.label : undefined}
        >
            {item.icon}
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
        </Link>
    );
}

export function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        suppressHydrationWarning
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full bg-gray-900 z-50 transition-all duration-300
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${isCollapsed ? 'w-20' : 'w-64'}
                `}
                suppressHydrationWarning
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800" suppressHydrationWarning>
                    {!isCollapsed && (
                        <Link href="/admin" className="text-xl font-bold text-white">
                            ORYIZON<span className="text-emerald-500">.</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 hidden lg:block"
                    >
                        <Menu size={20} />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-8rem)]">
                    {navItems.map(item => (
                        <NavItemComponent key={item.href} item={item} isCollapsed={isCollapsed} />
                    ))}

                    {/* Divider */}
                    <div className="my-4 border-t border-gray-800 mx-2" suppressHydrationWarning></div>

                    {/* Back to Home Button */}
                    <Link
                        href="/"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-emerald-400 hover:bg-gray-800 hover:text-emerald-300`}
                        title={isCollapsed ? "Back to Home" : undefined}
                    >
                        <ArrowLeft size={20} />
                        {!isCollapsed && <span className="font-medium">Back to Home</span>}
                    </Link>
                </nav>

                {/* User Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800" suppressHydrationWarning>
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`} suppressHydrationWarning>
                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold" suppressHydrationWarning>
                            A
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1" suppressHydrationWarning>
                                <p className="text-white font-medium text-sm">Admin User</p>
                                <p className="text-gray-400 text-xs">Super Admin</p>
                            </div>
                        )}
                        {!isCollapsed && (
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}

export function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6" suppressHydrationWarning>
            {/* Left */}
            <div className="flex items-center gap-4" suppressHydrationWarning>
                <button
                    onClick={onMenuClick}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
                >
                    <Menu size={20} />
                </button>

                {/* Search */}
                <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2" suppressHydrationWarning>
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none outline-none text-sm w-48 lg:w-64"
                    />
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3" suppressHydrationWarning>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Profile */}
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold" suppressHydrationWarning>
                        A
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">Admin</span>
                </button>
            </div>
        </header>
    );
}
