// Admin Types & Interfaces

export type UserRole = 'super_admin' | 'operations_manager' | 'content_manager' | 'marketing_manager' | 'support_executive';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    createdAt: Date;
    lastLogin?: Date;
    isActive: boolean;
}

export interface DashboardStats {
    totalRevenue: number;
    revenueChange: number;
    totalOrders: number;
    ordersChange: number;
    activeCustomers: number;
    customersChange: number;
    conversionRate: number;
    conversionChange: number;
}

// Product Types
export interface AdminProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: number;
    compareAtPrice?: number;
    sku: string;
    stock: number;
    lowStockThreshold: number;
    images: string[];
    category: string;
    tags: string[];
    variants: ProductVariant[];
    isActive: boolean;
    isFeatured: boolean;
    seo: SEOMetadata;
    nutritionalFacts?: NutritionalInfo;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductVariant {
    id: string;
    name: string; // e.g., "100g", "250g", "500g"
    sku: string;
    price: number;
    stock: number;
    weight: number;
}

export interface NutritionalInfo {
    servingSize: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    vitamins: { name: string; amount: string; dailyValue: string }[];
    minerals: { name: string; amount: string; dailyValue: string }[];
}

// Order Types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'returned';

export interface Order {
    id: string;
    orderNumber: string;
    customer: Customer;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    status: OrderStatus;
    paymentMethod: string;
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    shippingAddress: Address;
    billingAddress: Address;
    notes?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    variantName?: string;
    quantity: number;
    price: number;
    total: number;
    image: string;
}

// Customer Types
export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    addresses: Address[];
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: Date;
    isBlocked: boolean;
    notes?: string;
    createdAt: Date;
}

export interface Address {
    id: string;
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
}

// Marketing Types
export type CouponType = 'percentage' | 'flat';

export interface Coupon {
    id: string;
    code: string;
    type: CouponType;
    value: number;
    minCartValue?: number;
    maxDiscount?: number;
    usageLimit?: number;
    usedCount: number;
    validFrom: Date;
    validTo: Date;
    isActive: boolean;
    applicableProducts?: string[];
    applicableCategories?: string[];
    userSpecific?: string[];
}

export interface Banner {
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    link?: string;
    position: 'hero' | 'sidebar' | 'popup';
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
}

// Content Types
export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    author: string;
    category: string;
    tags: string[];
    status: 'draft' | 'published';
    seo: SEOMetadata;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
    isActive: boolean;
}

export interface SEOMetadata {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
}

// Analytics Types
export interface SalesReport {
    date: string;
    revenue: number;
    orders: number;
    averageOrderValue: number;
}

export interface ProductSalesReport {
    productId: string;
    productName: string;
    unitsSold: number;
    revenue: number;
}

// Support Types
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SupportTicket {
    id: string;
    subject: string;
    description: string;
    customer: Customer;
    orderId?: string;
    status: TicketStatus;
    priority: TicketPriority;
    assignedTo?: AdminUser;
    messages: TicketMessage[];
    createdAt: Date;
    updatedAt: Date;
}

export interface TicketMessage {
    id: string;
    content: string;
    sender: 'customer' | 'admin';
    senderName: string;
    createdAt: Date;
}

// Return Types
export type ReturnStatus = 'requested' | 'approved' | 'rejected' | 'shipped' | 'received' | 'refunded';

export interface ReturnRequest {
    id: string;
    orderId: string;
    orderNumber: string;
    customer: Customer;
    items: OrderItem[];
    reason: string;
    status: ReturnStatus;
    refundAmount?: number;
    adminNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Activity Log
export interface ActivityLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: string;
    ipAddress: string;
    createdAt: Date;
}

// Settings
export interface SiteSettings {
    brandName: string;
    tagline: string;
    logo: string;
    favicon: string;
    currency: string;
    taxRate: number;
    shippingRules: ShippingRule[];
    returnPolicy: string;
    privacyPolicy: string;
    termsOfService: string;
}

export interface ShippingRule {
    id: string;
    name: string;
    minOrderValue: number;
    maxOrderValue?: number;
    shippingCost: number;
    estimatedDays: string;
    isActive: boolean;
}

// RBAC Permissions
export interface Permission {
    resource: string;
    actions: ('create' | 'read' | 'update' | 'delete')[];
}

export const rolePermissions: Record<UserRole, Permission[]> = {
    super_admin: [
        { resource: '*', actions: ['create', 'read', 'update', 'delete'] },
    ],
    operations_manager: [
        { resource: 'orders', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'inventory', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'customers', actions: ['read'] },
        { resource: 'support', actions: ['read', 'update'] },
    ],
    content_manager: [
        { resource: 'products', actions: ['read', 'update'] },
        { resource: 'content', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'orders', actions: ['read'] },
    ],
    marketing_manager: [
        { resource: 'marketing', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'analytics', actions: ['read'] },
        { resource: 'products', actions: ['read'] },
        { resource: 'orders', actions: ['read'] },
    ],
    support_executive: [
        { resource: 'orders', actions: ['read', 'update'] },
        { resource: 'customers', actions: ['read'] },
        { resource: 'support', actions: ['create', 'read', 'update'] },
        { resource: 'returns', actions: ['create', 'read', 'update'] },
    ],
};

export function hasPermission(role: UserRole, resource: string, action: 'create' | 'read' | 'update' | 'delete'): boolean {
    const permissions = rolePermissions[role];
    return permissions.some(p =>
        (p.resource === '*' || p.resource === resource) && p.actions.includes(action)
    );
}
