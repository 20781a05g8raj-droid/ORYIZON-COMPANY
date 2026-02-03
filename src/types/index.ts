// Product Types
export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    description: string;
    shortDescription: string;
    images: string[];
    category: string;
    variants: ProductVariant[];
    benefits: string[];
    ingredients: string[];
    nutritionFacts: NutritionFact[];
    dosage: DosageInfo;
    certifications: string[];
    rating: number;
    reviewCount: number;
    inStock: boolean;
    featured: boolean;
}

export interface ProductVariant {
    id: string;
    name: string;
    weight: string;
    price: number;
    originalPrice?: number;
    inStock: boolean;
}

export interface NutritionFact {
    name: string;
    value: string;
    dailyValue?: string;
}

export interface DosageInfo {
    adults: string;
    elders: string;
    children: string;
    notes?: string;
}

// Cart Types
export interface CartItem {
    product: Product;
    variant: ProductVariant;
    quantity: number;
}

export interface CartState {
    items: CartItem[];
    addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
    removeItem: (productId: string, variantId: string) => void;
    updateQuantity: (productId: string, variantId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

// Review Types
export interface Review {
    id: string;
    author: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    verified: boolean;
    helpful: number;
}

// Testimonial Types
export interface Testimonial {
    id: string;
    name: string;
    location: string;
    avatar?: string;
    rating: number;
    content: string;
    productUsed?: string;
}

// FAQ Types
export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
}

// Blog Types
export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image?: string;
    icon?: string;
    author: string;
    date: string;
    category: string;
    tags: string[];
    readTime: string;
    featured?: boolean;
}

// Contact Form Types
export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

// Order Types
export interface Order {
    id: string;
    items: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    status: OrderStatus;
    createdAt: string;
}

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Navigation Types
export interface NavItem {
    label: string;
    href: string;
    children?: NavItem[];
}

// Certification Types
export interface Certification {
    id: string;
    name: string;
    icon: string;
    description: string;
}
