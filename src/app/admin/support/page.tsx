'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    MessageCircle,
    Mail,
    Phone,
    Clock,
    User,
    X,
    Send
} from 'lucide-react';

// Mock tickets data
const mockTickets = [
    {
        id: 'TKT-001',
        subject: 'Order not received',
        customer: 'Priya Sharma',
        email: 'priya@example.com',
        status: 'open',
        priority: 'high',
        createdAt: '2024-01-28 10:30',
        lastReply: '2 hours ago',
        messages: 3,
    },
    {
        id: 'TKT-002',
        subject: 'Product quality issue',
        customer: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        status: 'in_progress',
        priority: 'medium',
        createdAt: '2024-01-27 14:15',
        lastReply: '1 day ago',
        messages: 5,
    },
    {
        id: 'TKT-003',
        subject: 'Refund request',
        customer: 'Anita Desai',
        email: 'anita@example.com',
        status: 'open',
        priority: 'high',
        createdAt: '2024-01-26 09:45',
        lastReply: '2 days ago',
        messages: 2,
    },
    {
        id: 'TKT-004',
        subject: 'How to use moringa powder?',
        customer: 'Vikram Singh',
        email: 'vikram@example.com',
        status: 'resolved',
        priority: 'low',
        createdAt: '2024-01-25 16:20',
        lastReply: '3 days ago',
        messages: 4,
    },
];

const statusColors: Record<string, string> = {
    open: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700',
};

const priorityColors: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-orange-100 text-orange-700',
    low: 'bg-gray-100 text-gray-700',
};

export default function SupportPage() {
    const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
                    <p className="text-gray-500">Manage customer support requests</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium">
                    <Plus size={20} />
                    New Ticket
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Open Tickets', value: '12', color: 'text-yellow-600' },
                    { label: 'In Progress', value: '8', color: 'text-blue-600' },
                    { label: 'Resolved Today', value: '5', color: 'text-green-600' },
                    { label: 'Avg Response', value: '2.5h', color: 'text-purple-600' },
                ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option>All Status</option>
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                        <option>Closed</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option>All Priority</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </div>
            </div>

            {/* Tickets List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                {mockTickets.map((ticket, index) => (
                    <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <User size={20} className="text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-gray-500">{ticket.id}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
                                        {ticket.priority}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <h3 className="font-medium text-gray-900 truncate">{ticket.subject}</h3>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                    <span>{ticket.customer}</span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle size={14} />
                                        {ticket.messages}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {ticket.lastReply}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Ticket Detail Modal */}
            <AnimatePresence>
                {selectedTicket && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedTicket(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-gray-500">{selectedTicket.id}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedTicket.status]}`}>
                                            {selectedTicket.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                                </div>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-gray-400" />
                                        <span className="text-sm">{selectedTicket.customer}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} className="text-gray-400" />
                                        <span className="text-sm">{selectedTicket.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {/* Sample messages */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User size={16} className="text-emerald-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm">{selectedTicket.customer}</span>
                                            <span className="text-xs text-gray-500">{selectedTicket.createdAt}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm bg-gray-100 rounded-lg p-3">
                                            Hi, I placed an order 5 days ago but haven&apos;t received it yet. Can you please check the status?
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-blue-600 text-xs font-medium">AD</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm">Admin</span>
                                            <span className="text-xs text-gray-500">Yesterday</span>
                                        </div>
                                        <p className="text-gray-600 text-sm bg-emerald-50 rounded-lg p-3">
                                            Hello! Thank you for reaching out. I&apos;m checking on your order status now.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-100">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type your reply..."
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                                        <Send size={18} />
                                        Send
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
