'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant, CartItem } from '@/types';

// Available coupons
export const AVAILABLE_COUPONS: Record<string, { discount: number; type: 'percentage' | 'flat'; minOrder?: number; description: string }> = {
    'WELCOME10': { discount: 10, type: 'percentage', description: '10% off on your first order' },
    'MORINGA20': { discount: 20, type: 'percentage', minOrder: 500, description: '20% off on orders above ₹500' },
    'FLAT100': { discount: 100, type: 'flat', minOrder: 800, description: '₹100 off on orders above ₹800' },
    'HEALTH15': { discount: 15, type: 'percentage', description: '15% off on all products' },
    'NEWYEAR25': { discount: 25, type: 'percentage', minOrder: 1000, description: '25% off on orders above ₹1000' },
};

interface AppliedCoupon {
    code: string;
    discount: number;
    type: 'percentage' | 'flat';
    description: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    appliedCoupon: AppliedCoupon | null;
    couponError: string | null;
    addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
    removeItem: (productId: string, variantId: string) => void;
    updateQuantity: (productId: string, variantId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    getDiscountAmount: () => number;
    getFinalPrice: () => number;
    applyCoupon: (code: string) => boolean;
    removeCoupon: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            appliedCoupon: null,
            couponError: null,

            addItem: (product: Product, variant: ProductVariant, quantity: number = 1) => {
                set((state) => {
                    // Safe check for existing item
                    const existingItemIndex = state.items.findIndex(
                        (item) => item.product.id === product.id && (item.variant?.id ?? item.product.id) === (variant?.id ?? product.id)
                    );

                    if (existingItemIndex > -1) {
                        const updatedItems = [...state.items];
                        updatedItems[existingItemIndex].quantity += quantity;
                        return { items: updatedItems };
                    }

                    return {
                        items: [...state.items, { product, variant, quantity }],
                    };
                });
            },

            removeItem: (productId: string, variantId: string) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) => !(item.product.id === productId && (item.variant?.id ?? item.product.id) === variantId)
                    ),
                }));
            },

            updateQuantity: (productId: string, variantId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(productId, variantId);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId && (item.variant?.id ?? item.product.id) === variantId
                            ? { ...item, quantity }
                            : item
                    ),
                }));
            },

            clearCart: () => set({ items: [], appliedCoupon: null, couponError: null }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce(
                    (total, item) => {
                        const price = item.variant?.price ?? item.product.price ?? 0;
                        return total + price * item.quantity;
                    },
                    0
                );
            },

            getDiscountAmount: () => {
                const coupon = get().appliedCoupon;
                if (!coupon) return 0;

                const totalPrice = get().getTotalPrice();

                if (coupon.type === 'percentage') {
                    return Math.round((totalPrice * coupon.discount) / 100);
                } else {
                    return Math.min(coupon.discount, totalPrice);
                }
            },

            getFinalPrice: () => {
                const totalPrice = get().getTotalPrice();
                const discount = get().getDiscountAmount();
                return totalPrice - discount;
            },

            applyCoupon: (code: string) => {
                const upperCode = code.toUpperCase().trim();
                const couponData = AVAILABLE_COUPONS[upperCode];

                if (!couponData) {
                    set({ couponError: 'Invalid coupon code' });
                    return false;
                }

                const totalPrice = get().getTotalPrice();

                if (couponData.minOrder && totalPrice < couponData.minOrder) {
                    set({ couponError: `Minimum order of ₹${couponData.minOrder} required for this coupon` });
                    return false;
                }

                set({
                    appliedCoupon: {
                        code: upperCode,
                        discount: couponData.discount,
                        type: couponData.type,
                        description: couponData.description,
                    },
                    couponError: null,
                });
                return true;
            },

            removeCoupon: () => {
                set({ appliedCoupon: null, couponError: null });
            },

            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
        }),
        {
            name: 'moringa-cart',
        }
    )
);
