'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Star, Minus, Plus, ShoppingCart, Heart, Share2,
    Truck, RotateCcw, Loader2,
    Menu, X, Search, Maximize2, ShieldCheck, Zap, Leaf,
    Sparkles, CheckCircle2
} from 'lucide-react';
import { getProductBySlug, getProducts } from '@/lib/api/products';
import { getProductBySlug as getLocalProductBySlug } from '@/data/products';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductWithVariants, ProductVariant } from '@/types/database';
import { getProductReviews, getAllProductReviewStats, ProductReview } from '@/lib/api/reviews';
import ReviewModal from '@/components/products/ReviewModal';
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/constants';

interface ProductDetailClientProps {
    initialSlug?: string;
}

export function ProductDetailClient({ initialSlug }: ProductDetailClientProps) {
    const params = useParams();
    const router = useRouter();
    const slug = (initialSlug || (params?.slug as string)) || '';

    const [product, setProduct] = useState<ProductWithVariants | null>(null);
    const [localImages, setLocalImages] = useState<string[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<ProductWithVariants[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('benefits');
    const [activeImage, setActiveImage] = useState(0);
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isReviewsLoading, setIsReviewsLoading] = useState(true);

    // D2C Navigation & Modal state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    const mounted = React.useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );

    const { addItem, openCart, getTotalItems } = useCartStore();
    const cartItemCount = mounted ? getTotalItems() : 0;

    useEffect(() => {
        const fetchProductData = async () => {
            if (!slug) return;
            // 1. Fetch current product from API (Database)
            const foundProduct = await getProductBySlug(slug);

            // 2. Fetch local product for static images override
            const localProduct = getLocalProductBySlug(slug);
            if (localProduct && localProduct.images) {
                setLocalImages(localProduct.images);
            }

            if (foundProduct) {
                setProduct(foundProduct);
                // Default variant logic: Prioritize 100g -> Lowest Price -> First
                if (foundProduct.product_variants && foundProduct.product_variants.length > 0) {
                    const variant100g = foundProduct.product_variants.find(v =>
                        v.name.toLowerCase().includes('100g') ||
                        v.name.toLowerCase().includes('100 g')
                    );

                    if (variant100g) {
                        setSelectedVariant(variant100g);
                    } else {
                        try {
                            const sortedVariants = [...foundProduct.product_variants].sort((a, b) =>
                                Number(a.price) - Number(b.price)
                            );
                            setSelectedVariant(sortedVariants[0]);
                        } catch {
                            setSelectedVariant(foundProduct.product_variants[0]);
                        }
                    }
                }

                // 2. Fetch related products & real review stats
                const [allProducts, reviewStats] = await Promise.all([
                    getProducts(),
                    getAllProductReviewStats()
                ]);
                const related = allProducts
                    .filter(p => p.id !== foundProduct.id)
                    .slice(0, 3)
                    .map(p => {
                        const realStat = reviewStats[p.id];
                        return {
                            ...p,
                            rating: realStat ? realStat.rating : (p.rating || 0),
                            review_count: realStat ? realStat.count : (p.review_count || 0)
                        };
                    });
                setRelatedProducts(related);
            }
            setLoading(false);
        };

        const fetchReviews = async () => {
            if (!slug) return;
            const foundProduct = await getProductBySlug(slug);
            if (foundProduct) {
                const productReviews = await getProductReviews(foundProduct.id);
                setReviews(productReviews);
            }
            setIsReviewsLoading(false);
        };

        fetchProductData();
        fetchReviews();
    }, [slug]);

    const refreshReviews = async () => {
        if (product) {
            const productReviews = await getProductReviews(product.id);
            setReviews(productReviews);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-white" suppressHydrationWarning>
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-white" suppressHydrationWarning>
                <div className="text-center px-4">
                    <h1 className="font-heading text-3xl font-bold mb-4">Product Not Found</h1>
                    <Link href="/products">
                        <Button variant="primary">View All Products</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Determine images: Prioritize DB images, fallback to Local
    let images: string[] = [];
    if (product.images && product.images.length > 0) {
        images = product.images.map(img => {
            const sanitized = img.replace(/ /g, '-');
            if (sanitized.startsWith('http') || sanitized.startsWith('/')) return sanitized;
            return `/images/products/${sanitized}`;
        });
    } else if (localImages.length > 0) {
        images = localImages;
    }

    const benefits = product.benefits || [];
    const ingredients = product.ingredients || [];
    const certifications = product.certifications || [];
    const variants = product.product_variants || [];

    // Helper for display price
    const currentPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price);
    const originalPrice = selectedVariant?.original_price
        ? Number(selectedVariant.original_price)
        : (product.original_price ? Number(product.original_price) : 0);

    const discount = originalPrice > 0
        ? calculateDiscount(originalPrice, currentPrice)
        : 0;

    const isOutOfStock = selectedVariant ? !selectedVariant.in_stock : !product.in_stock;

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        const cartItemProduct = {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            originalPrice: product.original_price ? Number(product.original_price) : undefined,
            images: images,
            category: product.category,
            slug: product.slug,
        };

        const cartItemVariant = selectedVariant ? {
            id: selectedVariant.id,
            name: selectedVariant.name,
            weight: (selectedVariant as unknown as { weight?: string })?.weight || 'Standard',
            price: Number(selectedVariant.price),
            originalPrice: selectedVariant.original_price ? Number(selectedVariant.original_price) : undefined,
            inStock: selectedVariant.in_stock
        } : {
            id: product.id,
            name: product.name,
            weight: 'Standard',
            price: Number(product.price),
            originalPrice: product.original_price ? Number(product.original_price) : undefined,
            inStock: product.in_stock
        };

        addItem(cartItemProduct as unknown as Parameters<typeof addItem>[0], cartItemVariant as unknown as Parameters<typeof addItem>[1], quantity);
        openCart();
    };

    const handleBuyNow = () => {
        if (isOutOfStock) return;

        const cartItemProduct = {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            originalPrice: product.original_price ? Number(product.original_price) : undefined,
            images: images,
            category: product.category,
            slug: product.slug,
        };

        const cartItemVariant = selectedVariant ? {
            id: selectedVariant.id,
            name: selectedVariant.name,
            weight: (selectedVariant as unknown as { weight?: string })?.weight || 'Standard',
            price: Number(selectedVariant.price),
            originalPrice: selectedVariant.original_price ? Number(selectedVariant.original_price) : undefined,
            inStock: selectedVariant.in_stock
        } : {
            id: product.id,
            name: product.name,
            weight: 'Standard',
            price: Number(product.price),
            originalPrice: product.original_price ? Number(product.original_price) : undefined,
            inStock: product.in_stock
        };

        addItem(cartItemProduct as unknown as Parameters<typeof addItem>[0], cartItemVariant as unknown as Parameters<typeof addItem>[1], quantity);
        router.push('/checkout');
    };

    const tabs = [
        { id: 'benefits', label: 'Benefits' },
        { id: 'ingredients', label: 'Ingredients' },
        { id: 'howtouse', label: 'How to Use' },
        { id: 'reviews', label: `Reviews (${reviews.length > 0 ? reviews.length : 0})` },
    ];

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : (product.rating ? Number(product.rating).toFixed(1) : '4.8');

    const totalReviewCount = reviews.length > 0 ? reviews.length : (product.review_count || 124);

    return (
        <div className="min-h-screen bg-white text-neutral-900 selection:bg-emerald-100 selection:text-emerald-900" suppressHydrationWarning>
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                productId={product.id}
                onSuccess={refreshReviews}
            />

            {/* Lightbox / Zoom Modal */}
            <AnimatePresence>
                {isZoomOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setIsZoomOpen(false)}
                    >
                        <button
                            onClick={() => setIsZoomOpen(false)}
                            aria-label="Close zoomed image"
                            className="absolute top-5 right-5 w-11 h-11 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors z-10"
                        >
                            <X size={24} />
                        </button>
                        <div className="relative w-full max-w-2xl aspect-square">
                            {images[activeImage] && (
                                <Image
                                    src={images[activeImage]}
                                    alt={product.name}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 lg:hidden"
                    >
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                            className="absolute top-0 bottom-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col z-10"
                        >
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="relative w-28 h-8">
                                        <Image
                                            src="/images/oryizon-logo.png"
                                            alt={SITE_CONFIG.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    aria-label="Close Menu"
                                    className="w-11 h-11 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto py-4 px-5">
                                <nav className="space-y-2">
                                    {NAV_ITEMS.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block py-3 px-3 text-base font-semibold text-neutral-800 rounded-lg hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                            <div className="p-5 border-t border-gray-100 bg-gray-50">
                                <Link
                                    href="/products"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full py-3 text-center bg-[#1A3009] text-white font-bold rounded-xl shadow-md"
                                >
                                    Shop All Products
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ======================================================== */}
            {/* 1. TOP ANNOUNCEMENT BAR (Height 32px-40px, 3 equal cols) */}
            {/* ======================================================== */}
            <div className="h-[36px] bg-[#1A3009] text-white border-b border-white/10 w-full overflow-hidden">
                <div className="max-w-7xl mx-auto h-full px-2 sm:px-4 grid grid-cols-3 items-center text-center text-[10px] sm:text-[11px] md:text-[12px] font-semibold tracking-wide uppercase divide-x divide-white/10">
                    <div className="flex items-center justify-center gap-1 sm:gap-1.5 px-1 truncate">
                        <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#EAB308] shrink-0" />
                        <span className="truncate">Free Shipping</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 sm:gap-1.5 px-1 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#EAB308] shrink-0" />
                        <span className="truncate">Feature Guarantee</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 sm:gap-1.5 px-1 truncate">
                        <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#EAB308] shrink-0" />
                        <span className="truncate">100% Secure</span>
                    </div>
                </div>
            </div>

            {/* ======================================================== */}
            {/* 2. NAVIGATION HEADER (Sticky top bar with left hamburger, */}
            {/*    center logo, right search + cart icon with badge)     */}
            {/* ======================================================== */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
                    {/* Left: Accessible Hamburger Menu */}
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Open Navigation Menu"
                            className="w-11 h-11 -ml-2 rounded-xl flex items-center justify-center text-neutral-800 hover:bg-neutral-100 active:scale-95 transition-all"
                        >
                            <Menu size={22} strokeWidth={2.2} />
                        </button>
                    </div>

                    {/* Center: Brand Logo */}
                    <Link href="/" className="flex items-center justify-center group py-1">
                        <div className="relative w-28 h-8 sm:w-36 sm:h-10 transition-transform group-hover:scale-105">
                            <Image
                                src="/images/oryizon-logo.png"
                                alt={SITE_CONFIG.name}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Right: Search + Cart */}
                    <div className="flex items-center gap-1">
                        <Link
                            href="/products"
                            aria-label="Search Products"
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-neutral-800 hover:bg-neutral-100 active:scale-95 transition-all"
                        >
                            <Search size={20} strokeWidth={2.2} />
                        </Link>
                        <button
                            onClick={openCart}
                            aria-label={`Shopping Cart with ${cartItemCount} items`}
                            className="w-11 h-11 -mr-2 rounded-xl relative flex items-center justify-center text-neutral-800 hover:bg-neutral-100 active:scale-95 transition-all"
                        >
                            <ShoppingCart size={20} strokeWidth={2.2} />
                            {cartItemCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-[#EAB308] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md border-2 border-white leading-none">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Breadcrumb row */}
            <div className="bg-neutral-50/70 border-b border-neutral-100 py-2.5 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-neutral-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <Link href="/" className="hover:text-emerald-800 transition-colors">Home</Link>
                    <span className="text-neutral-300">/</span>
                    <Link href="/products" className="hover:text-emerald-800 transition-colors">Products</Link>
                    <span className="text-neutral-300">/</span>
                    <span className="text-neutral-900 truncate max-w-[200px]">{product.name}</span>
                </div>
            </div>

            {/* Main Product Layout Container */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* ======================================================== */}
                    {/* 3. MEDIA GALLERY (Split Thumbnails Layout)                */}
                    {/* ======================================================== */}
                    <div className="lg:col-span-6 w-full">
                        <div className="flex flex-row gap-3 sm:gap-4 items-start">
                            {/* Left Side: Vertical Stack of Thumbnails (3-4 images) */}
                            {images.length > 1 && (
                                <div className="flex flex-col gap-2.5 shrink-0 max-h-[420px] sm:max-h-[480px] overflow-y-auto scrollbar-hide pr-1">
                                    {images.slice(0, 5).map((image, index) => {
                                        const isActive = activeImage === index;
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => setActiveImage(index)}
                                                aria-label={`View product image ${index + 1}`}
                                                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-[8px] overflow-hidden p-0.5 transition-all min-w-[48px] min-h-[48px] flex items-center justify-center ${
                                                    isActive
                                                        ? 'border-2 border-[#1A3009] ring-2 ring-[#1A3009]/15 shadow-sm scale-102'
                                                        : 'border border-neutral-200 opacity-75 hover:opacity-100 hover:border-neutral-300'
                                                }`}
                                            >
                                                <div className="w-full h-full relative rounded-[6px] overflow-hidden bg-[var(--color-cream)]">
                                                    <Image
                                                        src={image}
                                                        alt={`${product.name} thumbnail ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Right Side: Large Main Product Image Container */}
                            <div className="flex-1 relative aspect-square bg-[var(--color-cream)] rounded-[16px] overflow-hidden shadow-lg shadow-black/5 border border-neutral-100">
                                {images[activeImage] ? (
                                    <Image
                                        src={images[activeImage]}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-4 sm:p-6 transition-transform duration-500 hover:scale-105"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-cream)] to-white">
                                        <span className="text-7xl">🌿</span>
                                    </div>
                                )}

                                {/* Discount Badge overlay */}
                                {discount > 0 && (
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="px-2.5 py-1 bg-emerald-700 text-white text-[11px] font-bold rounded-full uppercase tracking-wide shadow-md">
                                            {discount}% OFF
                                        </span>
                                    </div>
                                )}

                                {/* Floating Zoom / Expand Button */}
                                <button
                                    onClick={() => setIsZoomOpen(true)}
                                    aria-label="Expand image"
                                    className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-neutral-700 hover:text-neutral-950 shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-10 border border-neutral-100"
                                >
                                    <Maximize2 size={18} strokeWidth={2.2} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ======================================================== */}
                    {/* RIGHT COLUMN: Hierarchy 4 -> 8                          */}
                    {/* ======================================================== */}
                    <div className="lg:col-span-6 w-full flex flex-col">

                        {/* ======================================================== */}
                        {/* 4. PRODUCT META & PRICING                                */}
                        {/* ======================================================== */}
                        <div className="space-y-2 mb-5">
                            {/* Pill Badge */}
                            <div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-200">
                                    ★ {product.featured ? 'BEST SELLER' : (product.category || 'BEST SELLER')}
                                </span>
                            </div>

                            {/* Product Title */}
                            <h1 className="font-heading font-bold text-[22px] sm:text-[24px] text-neutral-900 leading-tight">
                                {product.name}
                            </h1>

                            {/* Rating Bar */}
                            <div className="flex items-center gap-2 pt-0.5">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={15}
                                            className="text-amber-400 fill-amber-400"
                                        />
                                    ))}
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-neutral-900">
                                    {averageRating}
                                </span>
                                <button
                                    onClick={() => {
                                        setActiveTab('reviews');
                                        const el = document.getElementById('product-tabs-section');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="text-xs sm:text-sm text-neutral-600 underline underline-offset-2 hover:text-emerald-800 transition-colors"
                                >
                                    ({totalReviewCount} reviews)
                                </button>
                            </div>

                            {/* Price Display */}
                            <div className="flex items-baseline gap-2.5 pt-1">
                                <span className="text-[24px] sm:text-[26px] font-bold text-[#1A3009] font-heading">
                                    {formatPrice(currentPrice)}
                                </span>
                                {originalPrice > 0 && (
                                    <>
                                        <span className="text-base sm:text-lg text-neutral-400 line-through">
                                            {formatPrice(originalPrice)}
                                        </span>
                                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                            Save {discount}%
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Subtext */}
                            <p className="text-[12px] text-neutral-500">
                                Tax included. Shipping calculated at checkout.
                            </p>
                        </div>

                        {/* Short Description */}
                        {product.short_description && (
                            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-5">
                                {product.short_description}
                            </p>
                        )}

                        {/* ======================================================== */}
                        {/* 5. SELECTORS ROW (Variants & Quantity)                   */}
                        {/* ======================================================== */}
                        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 mb-5 space-y-3">
                            {/* Variant Selector */}
                            {variants.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                                            Select Option:
                                        </span>
                                        {selectedVariant && (
                                            <span className="text-xs font-semibold text-emerald-800">
                                                {selectedVariant.name}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {variants.map((variant) => {
                                            const isSelected = selectedVariant?.id === variant.id;
                                            return (
                                                <button
                                                    key={variant.id}
                                                    type="button"
                                                    onClick={() => setSelectedVariant(variant)}
                                                    disabled={!variant.in_stock}
                                                    className={`min-h-[44px] px-4 py-2 rounded-[20px] text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                                        isSelected
                                                            ? 'border-2 border-[#1A3009] bg-[#1A3009]/5 text-[#1A3009] shadow-sm font-bold ring-2 ring-[#1A3009]/10'
                                                            : 'border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400'
                                                    } ${!variant.in_stock ? 'opacity-40 cursor-not-allowed bg-gray-100 line-through' : ''}`}
                                                >
                                                    <span>{variant.name}</span>
                                                    <span className="opacity-75">· {formatPrice(Number(variant.price))}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                                    Quantity:
                                </span>
                                <div className="inline-flex items-center bg-white border border-neutral-300 rounded-full h-11 px-1 shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        aria-label="Decrease quantity"
                                        className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 active:scale-90 transition-all"
                                    >
                                        <Minus size={15} />
                                    </button>
                                    <span className="w-9 text-center font-bold text-sm text-neutral-900" aria-live="polite">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        aria-label="Increase quantity"
                                        className="w-10 h-10 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 active:scale-90 transition-all"
                                    >
                                        <Plus size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ======================================================== */}
                        {/* 6. USP / FEATURE HIGHLIGHT GRID                          */}
                        {/* ======================================================== */}
                        <div className="mb-5">
                            <h3 className="text-[14px] sm:text-[15px] font-semibold text-neutral-800 mb-3">
                                Why you&apos;ll love it
                            </h3>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center mb-1.5 shadow-sm">
                                        <Leaf size={20} />
                                    </div>
                                    <span className="text-[11px] sm:text-[12px] font-medium text-neutral-700 leading-tight">
                                        100% Pure Organic
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center mb-1.5 shadow-sm">
                                        <Zap size={20} />
                                    </div>
                                    <span className="text-[11px] sm:text-[12px] font-medium text-neutral-700 leading-tight">
                                        Natural Energy
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center mb-1.5 shadow-sm">
                                        <Sparkles size={20} />
                                    </div>
                                    <span className="text-[11px] sm:text-[12px] font-medium text-neutral-700 leading-tight">
                                        Antioxidant Power
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center mb-1.5 shadow-sm">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <span className="text-[11px] sm:text-[12px] font-medium text-neutral-700 leading-tight">
                                        Lab Tested Purity
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ======================================================== */}
                        {/* 7. CALL-TO-ACTION (CTA) BLOCK                            */}
                        {/* ======================================================== */}
                        <div className="flex flex-col gap-2.5 sm:gap-3 w-full mb-6">
                            {/* ADD TO CART */}
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className={`w-full min-h-[48px] sm:min-h-[50px] rounded-[10px] border-2 border-[#1A3009] text-[#1A3009] bg-white hover:bg-[#1A3009]/5 active:bg-[#1A3009]/10 font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                                    isOutOfStock ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' : ''
                                }`}
                            >
                                <ShoppingCart size={18} />
                                <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
                            </button>

                            {/* BUY IT NOW */}
                            {!isOutOfStock && (
                                <button
                                    type="button"
                                    onClick={handleBuyNow}
                                    className="w-full min-h-[48px] sm:min-h-[50px] rounded-[10px] bg-[#1A3009] hover:bg-[#132406] text-white font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 active:scale-[0.99] transition-all"
                                >
                                    <span>⚡ BUY IT NOW</span>
                                </button>
                            )}
                        </div>

                        {/* ======================================================== */}
                        {/* 8. TRUST BADGES & PAYMENT ASSURANCE                      */}
                        {/* ======================================================== */}
                        <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/80 mb-6">
                            {/* 3 Micro Features */}
                            <div className="grid grid-cols-3 gap-2 pb-3 border-b border-neutral-200 text-center">
                                <div className="flex flex-col items-center">
                                    <Truck size={18} className="text-emerald-800 mb-1" />
                                    <span className="text-[11px] font-bold text-neutral-800">Free Shipping</span>
                                    <span className="text-[10px] text-neutral-500">Orders over ₹499</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <RotateCcw size={18} className="text-emerald-800 mb-1" />
                                    <span className="text-[11px] font-bold text-neutral-800">Easy Returns</span>
                                    <span className="text-[10px] text-neutral-500">7-Day Guarantee</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <ShieldCheck size={18} className="text-emerald-800 mb-1" />
                                    <span className="text-[11px] font-bold text-neutral-800">100% Secure</span>
                                    <span className="text-[10px] text-neutral-500">Encrypted Checkout</span>
                                </div>
                            </div>

                            {/* Payment Strip */}
                            <div className="pt-3 text-center">
                                <p className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                                    Guaranteed Safe Checkout
                                </p>
                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                    <div className="h-6 px-2.5 bg-white border border-neutral-200 rounded flex items-center justify-center text-[11px] font-black text-blue-800 italic shadow-xs">
                                        VISA
                                    </div>
                                    <div className="h-6 px-2.5 bg-white border border-neutral-200 rounded flex items-center justify-center gap-0.5 shadow-xs">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-90 -mr-1" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-90" />
                                        <span className="text-[9px] font-bold text-neutral-700 ml-1">Mastercard</span>
                                    </div>
                                    <div className="h-6 px-2.5 bg-white border border-neutral-200 rounded flex items-center justify-center text-[10px] font-extrabold text-emerald-800 shadow-xs">
                                        UPI
                                    </div>
                                    <div className="h-6 px-2.5 bg-white border border-neutral-200 rounded flex items-center justify-center text-[10px] font-bold text-sky-700 shadow-xs">
                                        RuPay
                                    </div>
                                    <div className="h-6 px-2.5 bg-white border border-neutral-200 rounded flex items-center justify-center text-[10px] font-bold text-purple-800 shadow-xs">
                                        Wallets
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social / Wishlist Utility */}
                        <div className="flex items-center justify-center gap-8 py-2 text-neutral-500 text-xs">
                            <button
                                type="button"
                                className="inline-flex items-center gap-1.5 hover:text-emerald-800 transition-colors"
                            >
                                <Heart size={16} />
                                <span>Save to Wishlist</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: product.name,
                                            url: window.location.href,
                                        }).catch(() => {});
                                    }
                                }}
                                className="inline-flex items-center gap-1.5 hover:text-emerald-800 transition-colors"
                            >
                                <Share2 size={16} />
                                <span>Share</span>
                            </button>
                        </div>

                    </div>
                </div>
            </main>

            {/* ======================================================== */}
            {/* EXTENDED DETAILS: Tabs (Benefits, Ingredients, Reviews)  */}
            {/* ======================================================== */}
            <section id="product-tabs-section" className="py-10 bg-neutral-50/80 border-t border-neutral-200" suppressHydrationWarning>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                    {/* Tabs Bar */}
                    <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto scrollbar-hide pb-0.5" suppressHydrationWarning>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap px-4 py-3 font-bold text-xs uppercase tracking-wider transition-all relative ${
                                    activeTab === tab.id
                                        ? 'text-[#1A3009]'
                                        : 'text-neutral-500 hover:text-neutral-800'
                                }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#1A3009] z-10"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content Box */}
                    <div className="bg-white rounded-2xl p-5 sm:p-8 mt-6 shadow-sm border border-neutral-200/80" suppressHydrationWarning>
                        {/* Benefits Tab */}
                        {activeTab === 'benefits' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-heading text-xl sm:text-2xl font-bold mb-4 text-neutral-900">
                                        Key Health Benefits
                                    </h3>
                                    {benefits.length > 0 ? (
                                        <div className="space-y-3">
                                            {benefits.map((benefit, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100"
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                                                        ✓
                                                    </div>
                                                    <span className="text-sm font-medium text-neutral-800">
                                                        {benefit}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-neutral-500 text-sm italic">Information available on packaging.</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-heading text-xl sm:text-2xl font-bold mb-4 text-neutral-900">
                                        Quality & Certifications
                                    </h3>
                                    {certifications.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            {certifications.map((cert) => (
                                                <div
                                                    key={cert}
                                                    className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center justify-center text-center"
                                                >
                                                    {cert.toUpperCase()}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-5 bg-neutral-50 rounded-xl border border-dashed border-neutral-200 text-center">
                                            <p className="text-neutral-400 text-xs uppercase font-bold tracking-wider">
                                                100% Certified Organic Farm Sourced
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Ingredients Tab */}
                        {activeTab === 'ingredients' && (
                            <div className="max-w-2xl mx-auto py-2">
                                <h3 className="font-heading text-xl sm:text-2xl font-bold mb-4 text-center text-neutral-900">
                                    Pure & Clean Ingredients
                                </h3>
                                {ingredients.length > 0 ? (
                                    <div className="space-y-2 mb-6">
                                        {ingredients.map((ingredient, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 bg-neutral-50">
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                                                <span className="text-sm font-semibold text-neutral-800">{ingredient}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-neutral-600 text-sm mb-6">
                                        100% Pure Organic Moringa Oleifera leaf powder. Free from preservatives, artificial colors, and fillers.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* How to Use Tab */}
                        {activeTab === 'howtouse' && (
                            <div className="max-w-2xl mx-auto py-2 text-center">
                                <h3 className="font-heading text-xl sm:text-2xl font-bold mb-4 text-neutral-900">
                                    Recommended Daily Use
                                </h3>
                                <div className="p-6 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                                    <p className="text-sm sm:text-base text-neutral-800 font-medium leading-relaxed">
                                        {product.how_to_use || 'Mix 1 teaspoon (approx. 5g) into warm water, smoothies, morning juice, or sprinkle over your favorite daily bowl.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="py-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                    <div>
                                        <h3 className="font-heading text-xl sm:text-2xl font-bold text-neutral-900">
                                            Customer Reviews
                                        </h3>
                                        <p className="text-xs text-neutral-500">
                                            Verified feedback from real customers
                                        </p>
                                    </div>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="rounded-xl px-5"
                                        onClick={() => setIsReviewModalOpen(true)}
                                    >
                                        Write a Review
                                    </Button>
                                </div>

                                {isReviewsLoading ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                                    </div>
                                ) : reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-sm text-neutral-900">{review.user_name}</h4>
                                                        <div className="flex gap-0.5 mt-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={13}
                                                                    className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-[11px] text-neutral-400">
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                                                    &quot;{review.comment}&quot;
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-neutral-50 rounded-2xl">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs text-xl">
                                            💬
                                        </div>
                                        <h4 className="font-heading text-lg font-bold text-neutral-900 mb-1">Be the First to Review</h4>
                                        <p className="text-xs text-neutral-500 mb-4 max-w-sm mx-auto">
                                            Share your experience with this organic superfood and help our community.
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl px-6"
                                            onClick={() => setIsReviewModalOpen(true)}
                                        >
                                            Write Review
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <section className="py-12 bg-white" suppressHydrationWarning>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-heading text-2xl font-bold text-neutral-900">
                                You May Also Like
                            </h2>
                            <Link href="/products" className="text-xs font-bold uppercase tracking-wider text-emerald-800 hover:underline">
                                View All →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6" suppressHydrationWarning>
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
