'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Star, Minus, Plus, ShoppingCart, Heart, Share2,
    Check, Truck, RotateCcw, Shield, ChevronDown, Loader2
} from 'lucide-react';
import { getProductBySlug, getProducts } from '@/lib/api/products';
import { getProductBySlug as getLocalProductBySlug } from '@/data/products';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductCard } from '@/components/ui/Card';
import { ProductWithVariants, ProductVariant } from '@/types/database';
import { getProductReviews, ProductReview } from '@/lib/api/reviews';
import ReviewModal from '@/components/products/ReviewModal';

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
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

    const { addItem, openCart } = useCartStore();

    useEffect(() => {
        const fetchProductData = async () => {
            // 1. Fetch current product from API (Database)
            const foundProduct = await getProductBySlug(params.slug as string);

            // 2. Fetch local product for static images override
            const localProduct = getLocalProductBySlug(params.slug as string);
            if (localProduct && localProduct.images) {
                setLocalImages(localProduct.images);
            }

            if (foundProduct) {
                setProduct(foundProduct);
                // Default variant logic: Prioritize 100g -> Lowest Price -> First
                if (foundProduct.product_variants && foundProduct.product_variants.length > 0) {
                    // 1. Try to find 100g variant
                    const variant100g = foundProduct.product_variants.find(v =>
                        v.name.toLowerCase().includes('100g') ||
                        v.name.toLowerCase().includes('100 g')
                    );

                    if (variant100g) {
                        setSelectedVariant(variant100g);
                    } else {
                        // 2. Fallback to lowest price
                        try {
                            const sortedVariants = [...foundProduct.product_variants].sort((a, b) =>
                                Number(a.price) - Number(b.price)
                            );
                            setSelectedVariant(sortedVariants[0]);
                        } catch (e) {
                            // Safety fallback
                            setSelectedVariant(foundProduct.product_variants[0]);
                        }
                    }
                }

                // 2. Fetch related products (e.g., random 3 for now, or same category in future)
                const allProducts = await getProducts();
                const related = allProducts
                    .filter(p => p.id !== foundProduct.id)
                    .slice(0, 3);
                setRelatedProducts(related);
            }
            setLoading(false);
        };

        const fetchReviews = async () => {
            if (!params.slug) return;
            const foundProduct = await getProductBySlug(params.slug as string);
            if (foundProduct) {
                const productReviews = await getProductReviews(foundProduct.id);
                setReviews(productReviews);
            }
            setIsReviewsLoading(false);
        };

        fetchProductData();
        fetchReviews();
    }, [params.slug]);

    const refreshReviews = async () => {
        if (product) {
            const productReviews = await getProductReviews(product.id);
            setReviews(productReviews);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center" suppressHydrationWarning>
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center" suppressHydrationWarning>
                <div className="text-center">
                    <h1 className="font-heading text-3xl font-bold mb-4">Product Not Found</h1>
                    <Link href="/products">
                        <Button variant="primary">View All Products</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Determine images: Use Local Images if available, otherwise fallback to DB images (with sanitization)
    let images: string[] = [];
    if (localImages.length > 0) {
        images = localImages;
    } else {
        images = product.images?.map(img => {
            const sanitized = img.replace(/ /g, '-');
            if (sanitized.startsWith('http') || sanitized.startsWith('/')) return sanitized;
            return `/images/products/${sanitized}`;
        }) || [];
    }

    const benefits = product.benefits || [];
    const ingredients = product.ingredients || [];
    const certifications = product.certifications || [];
    const variants = product.product_variants || [];

    // Helper for display price
    const currentPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price);
    const originalPrice = selectedVariant?.original_price ? Number(selectedVariant.original_price) : (product.original_price ? Number(product.original_price) : 0);

    const discount = originalPrice > 0
        ? calculateDiscount(originalPrice, currentPrice)
        : 0;

    const isOutOfStock = selectedVariant ? !selectedVariant.in_stock : !product.in_stock;

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        // Map database product to CartItem structure expected by store
        // We might need to adjust types in cartStore if they mismatch
        // For now, mapping broadly
        const cartItemProduct = {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            originalPrice: product.original_price ? Number(product.original_price) : undefined,
            images: images,
            category: product.category,
            slug: product.slug,
            // ... other fields if needed
        };

        const cartItemVariant = selectedVariant ? {
            id: selectedVariant.id,
            name: selectedVariant.name,
            price: Number(selectedVariant.price),
            originalPrice: selectedVariant.original_price ? Number(selectedVariant.original_price) : undefined,
        } : undefined;

        addItem(cartItemProduct as any, cartItemVariant as any, quantity);
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
            price: Number(selectedVariant.price),
            originalPrice: selectedVariant.original_price ? Number(selectedVariant.original_price) : undefined,
        } : undefined;

        addItem(cartItemProduct as any, cartItemVariant as any, quantity);
        router.push('/checkout');
    };

    const tabs = [
        { id: 'benefits', label: 'Benefits' },
        { id: 'ingredients', label: 'Ingredients' },
        { id: 'howtouse', label: 'How to Use' },
        { id: 'reviews', label: `Reviews (${reviews.length > 0 ? reviews.length : 0})` },
    ];

    return (
        <div className="min-h-screen pt-16 md:pt-24 bg-white" suppressHydrationWarning>
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                productId={product.id}
                onSuccess={refreshReviews}
            />
            {/* Breadcrumb - More compact on mobile */}
            <div className="bg-[var(--color-cream)]/50 py-3 md:py-4 border-b border-[var(--color-secondary)]/30" suppressHydrationWarning>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest font-bold text-[var(--color-text-light)] overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
                        <span className="opacity-30">/</span>
                        <Link href="/products" className="hover:text-[var(--color-primary)] transition-colors">Products</Link>
                        <span className="opacity-30">/</span>
                        <span className="text-[var(--color-primary)] truncate max-w-[150px] sm:max-w-none">{product.name}</span>
                    </div>
                </div>
            </div>

            {/* Product Section */}
            <section className="py-6 sm:py-8 md:py-12 lg:py-16" suppressHydrationWarning>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-start" suppressHydrationWarning>
                        {/* Image Gallery */}
                        <div suppressHydrationWarning className="space-y-4 md:space-y-6">
                            {/* Main Image */}
                            <motion.div
                                key={activeImage}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="aspect-[4/5] sm:aspect-square bg-[var(--color-cream)] rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-black/5 group"
                                suppressHydrationWarning
                            >
                                {images[activeImage] ? (
                                    <Image
                                        src={images[activeImage]}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        priority
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-cream)] to-white">
                                        <span className="text-6xl sm:text-8xl md:text-9xl animate-spin-slow">🌿</span>
                                    </div>
                                )}

                                {/* Badges */}
                                <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex flex-col gap-2 z-10">
                                    {discount > 0 && (
                                        <Badge variant="accent" size="sm" className="sm:size-md shadow-lg backdrop-blur-md">
                                            {discount}% OFF
                                        </Badge>
                                    )}
                                    {product.featured && (
                                        <Badge variant="success" size="sm" className="sm:size-md shadow-lg backdrop-blur-md">
                                            ⭐ Best Seller
                                        </Badge>
                                    )}
                                </div>
                            </motion.div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                                    {images.map((image, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setActiveImage(index)}
                                            className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-sm ${activeImage === index
                                                ? 'border-[var(--color-primary)] scale-105 shadow-md ring-4 ring-[var(--color-primary)]/10'
                                                : 'border-transparent opacity-60 hover:opacity-100 hover:border-[var(--color-secondary)]'
                                                }`}
                                        >
                                            <div className="w-full h-full bg-[var(--color-cream)] flex items-center justify-center">
                                                <Image
                                                    src={image}
                                                    alt={`${product.name} ${index + 1}`}
                                                    width={100}
                                                    height={100}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div suppressHydrationWarning className="flex flex-col">
                            {/* Title & Brand */}
                            <div className="mb-6 md:mb-8" suppressHydrationWarning>
                                <span className="text-[var(--color-accent)] font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] mb-2 block">
                                    {product.category || 'Premium Superfood'}
                                </span>
                                <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-[1.2] sm:leading-[1.1] text-[var(--color-text)]">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-3 sm:gap-4 flex-wrap" suppressHydrationWarning>
                                    <div className="flex items-center gap-1 bg-[var(--color-cream)] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={12}
                                                className="sm:size-[14px] text-[var(--color-accent)]"
                                                fill={i < Math.round(reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0) ? 'currentColor' : 'none'}
                                            />
                                        ))}
                                        <span className="text-[10px] sm:text-xs md:text-sm font-bold ml-1 text-[var(--color-text)]">
                                            {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('reviews')}
                                        className="text-[10px] sm:text-xs md:text-sm text-[var(--color-text-light)] font-medium underline underline-offset-4 cursor-pointer hover:text-[var(--color-primary)] transition-colors"
                                    >
                                        {reviews.length} Reviews
                                    </button>
                                </div>
                            </div>

                            {/* Price Card */}
                            <div className="bg-[var(--color-cream)]/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-[var(--color-secondary)]/30" suppressHydrationWarning>
                                <div className="flex items-center flex-wrap gap-3 sm:gap-4 mb-1 sm:mb-2">
                                    <span className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-primary)]">
                                        {formatPrice(currentPrice)}
                                    </span>
                                    {originalPrice > 0 && (
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <span className="text-lg sm:text-xl lg:text-2xl text-[var(--color-text-muted)] line-through">
                                                {formatPrice(originalPrice)}
                                            </span>
                                            <Badge variant="success" size="sm" className="sm:size-md">
                                                -{discount}%
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[9px] sm:text-xs font-bold text-green-600 uppercase tracking-widest">
                                    Inclusive of all taxes
                                </p>
                            </div>

                            {/* Description Short */}
                            <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-light)] mb-6 sm:mb-8 leading-relaxed">
                                {product.short_description}
                            </p>

                            {/* Variants Selection */}
                            {variants.length > 0 && (
                                <div className="mb-6 sm:mb-8" suppressHydrationWarning>
                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <p className="font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-wider text-[var(--color-text-light)]">Select Size</p>
                                        <button className="text-[10px] sm:text-xs font-bold text-[var(--color-primary)] underline">Size Guide</button>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                        {variants.map((variant) => (
                                            <motion.button
                                                key={variant.id}
                                                whileHover={variant.in_stock ? { y: -2 } : {}}
                                                whileTap={variant.in_stock ? { scale: 0.98 } : {}}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`flex flex-col items-center justify-center p-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all shadow-sm ${selectedVariant?.id === variant.id
                                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-2 sm:ring-4 ring-[var(--color-primary)]/10'
                                                    : 'border-[var(--color-secondary)] bg-white hover:border-[var(--color-primary)]/30'
                                                    } ${!variant.in_stock ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-100 grayscale' : ''}`}
                                            >
                                                <span className={`font-bold text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 ${selectedVariant?.id === variant.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
                                                    {variant.name}
                                                </span>
                                                <span className={`text-[10px] sm:text-xs font-medium ${selectedVariant?.id === variant.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-light)]'}`}>
                                                    {formatPrice(Number(variant.price))}
                                                </span>
                                                {!variant.in_stock && (
                                                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-bold rounded-full border border-red-200 uppercase">Sold Out</span>
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity & Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10" suppressHydrationWarning>
                                <div className="flex items-center h-12 sm:h-14 md:h-16 border-2 border-[var(--color-secondary)]/50 rounded-xl sm:rounded-2xl bg-white p-1 min-w-[120px] sm:min-w-[140px] shadow-sm">
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 sm:w-12 h-full rounded-lg sm:rounded-xl hover:bg-[var(--color-cream)] transition-colors flex items-center justify-center text-[var(--color-text)]"
                                    >
                                        <Minus size={16} />
                                    </motion.button>
                                    <span className="flex-1 text-center font-bold text-base sm:text-lg">{quantity}</span>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 sm:w-12 h-full rounded-lg sm:rounded-xl hover:bg-[var(--color-cream)] transition-colors flex items-center justify-center text-[var(--color-text)]"
                                    >
                                        <Plus size={16} />
                                    </motion.button>
                                </div>

                                <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 flex-1">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        className={`h-12 sm:h-14 md:h-16 text-sm sm:text-lg rounded-xl sm:rounded-2xl shadow-xl shadow-emerald-900/10 ${isOutOfStock ? 'bg-gray-400 border-gray-400' : ''}`}
                                        icon={isOutOfStock ? undefined : <ShoppingCart size={20} className="sm:size-[22px]" />}
                                        onClick={handleAddToCart}
                                        disabled={isOutOfStock}
                                    >
                                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                                    </Button>
                                    {!isOutOfStock && (
                                        <Button
                                            variant="accent"
                                            size="lg"
                                            fullWidth
                                            className="h-12 sm:h-14 md:h-16 text-sm sm:text-lg rounded-xl sm:rounded-2xl shadow-xl shadow-gold/10"
                                            onClick={handleBuyNow}
                                        >
                                            Buy Now
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Trust Note - Premium Badge style */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10" suppressHydrationWarning>
                                <div className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-xl sm:rounded-2xl border border-emerald-100 group transition-colors hover:bg-emerald-50">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
                                        <Truck size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[10px] sm:text-xs uppercase tracking-wider text-emerald-900">Free Delivery</p>
                                        <p className="text-[9px] sm:text-[10px] font-medium text-emerald-700">Orders over ₹499</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-amber-50/50 rounded-xl sm:rounded-2xl border border-amber-100 group transition-colors hover:bg-amber-50">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-50">
                                        <RotateCcw size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[10px] sm:text-xs uppercase tracking-wider text-amber-900">7-Day Return</p>
                                        <p className="text-[9px] sm:text-[10px] font-medium text-amber-700">Money back guarantee</p>
                                    </div>
                                </div>
                            </div>

                            {/* Utility Actions */}
                            <div className="flex items-center justify-center gap-6 sm:gap-8 py-4 border-t border-b border-[var(--color-secondary)]/30" suppressHydrationWarning>
                                <button className="flex items-center gap-2 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors group">
                                    <Heart size={16} />
                                    <span>Wishlist</span>
                                </button>
                                <button className="flex items-center gap-2 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors">
                                    <Share2 size={16} />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Details Tabs - Premium Glassy Look */}
            <section className="py-10 sm:py-16 md:py-24 bg-[var(--color-cream)]/30 border-t border-[var(--color-secondary)]/30" suppressHydrationWarning>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                    {/* Tabs Navigation */}
                    <div className="flex justify-start sm:justify-center lg:justify-start gap-1 sm:gap-2 md:gap-4 mb-6 sm:mb-8 md:mb-12 border-b-2 border-[var(--color-secondary)]/20 overflow-x-auto scrollbar-hide pb-0.5" suppressHydrationWarning>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4 font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-widest transition-all relative ${activeTab === tab.id
                                    ? 'text-[var(--color-primary)]'
                                    : 'text-[var(--color-text-light)] hover:text-[var(--color-text)]'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabUnderline"
                                        className="absolute bottom-[-2px] left-0 right-0 h-1 bg-[var(--color-primary)] rounded-full z-10"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content Card */}
                    <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 md:p-12 shadow-2xl shadow-emerald-900/5 border border-[var(--color-secondary)]/30" suppressHydrationWarning>
                        {activeTab === 'benefits' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 md:gap-20">
                                <div>
                                    <h3 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-[var(--color-text)]">Unmatched Benefits</h3>
                                    {benefits.length > 0 ? (
                                        <div className="grid gap-4 sm:gap-6">
                                            {benefits.map((benefit, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[var(--color-cream)]/50 hover:bg-[var(--color-cream)] transition-colors border border-transparent hover:border-[var(--color-primary)]/10 group"
                                                >
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0 mt-0.5 shadow-lg group-hover:scale-110 transition-transform">
                                                        ✓
                                                    </div>
                                                    <span className="text-sm sm:text-base md:text-lg font-medium text-[var(--color-text)] leading-relaxed">{benefit}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[var(--color-text-light)] text-sm sm:text-lg italic">Coming soon.</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-[var(--color-text)]">Certifications</h3>
                                    {certifications.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                            {certifications.map((cert) => (
                                                <div
                                                    key={cert}
                                                    className="p-3 sm:p-5 bg-white border-2 border-[var(--color-secondary)] rounded-xl sm:rounded-2xl text-[10px] sm:text-xs md:text-base font-bold text-[var(--color-primary)] flex items-center justify-center text-center shadow-sm hover:border-[var(--color-primary)] transition-all"
                                                >
                                                    {cert.toUpperCase()}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 sm:p-8 bg-gray-50 rounded-2xl sm:rounded-3xl border-2 border-dashed border-gray-200 text-center">
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] sm:text-xs">Quality Certifications in Progress</p>
                                        </div>
                                    )}
                                    <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-[var(--color-primary)]/5 rounded-2xl sm:rounded-3xl border border-[var(--color-primary)]/10">
                                        <p className="text-xs sm:text-sm font-medium text-[var(--color-primary)] leading-relaxed italic">
                                            "Our Moringa is sourced from organic family farms, ensuring maximum nutrient density."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ingredients' && (
                            <div className="max-w-3xl mx-auto">
                                <h3 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center text-[var(--color-text)]">Pure Ingredients</h3>
                                {ingredients.length > 0 ? (
                                    <div className="grid gap-3 sm:gap-4 mb-8 sm:mb-12">
                                        {ingredients.map((ingredient, index) => (
                                            <div key={index} className="flex items-center gap-4 sm:gap-6 p-3 sm:p-4 rounded-xl border border-[var(--color-secondary)] hover:bg-[var(--color-cream)] transition-colors">
                                                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[var(--color-accent)]" />
                                                <span className="text-sm sm:text-lg font-bold text-[var(--color-text)]">{ingredient}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-[var(--color-text-light)] text-sm sm:text-xl italic mb-8 sm:mb-12">100% Single-Ingredient Pure Organic Moringa Leaves.</p>
                                )}

                                {product.how_to_use && (
                                    <div className="p-5 sm:p-8 bg-[var(--color-cream)] rounded-2xl sm:rounded-3xl">
                                        <h4 className="font-heading text-base sm:text-xl font-bold mb-3 sm:mb-4 uppercase tracking-widest text-[var(--color-primary)]">Quick Guide</h4>
                                        <p className="text-sm sm:text-lg leading-relaxed text-[var(--color-text)]">{product.how_to_use}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'howtouse' && (
                            <div className="max-w-3xl mx-auto">
                                <h3 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center text-[var(--color-text)]">How to Consume</h3>
                                <div className="p-6 sm:p-8 md:p-12 bg-[var(--color-cream)] rounded-2xl sm:rounded-[2.5rem] relative overflow-hidden">
                                    <div className="absolute top-[-20%] right-[-10%] opacity-10 rotate-12 select-none pointer-events-none">
                                        <span className="text-[8rem] sm:text-[12rem]">🌿</span>
                                    </div>
                                    <p className="text-sm sm:text-xl md:text-2xl leading-relaxed text-[var(--color-text)] font-medium text-center relative z-10">
                                        {product.how_to_use || 'No instructions provided.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="py-6 sm:py-12">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
                                    <div>
                                        <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[var(--color-text)] mb-2">Customer Feedback</h3>
                                        <p className="text-[var(--color-text-light)]">Real experiences from our community members.</p>
                                    </div>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="rounded-2xl px-8"
                                        onClick={() => setIsReviewModalOpen(true)}
                                    >
                                        Write a Review
                                    </Button>
                                </div>

                                {isReviewsLoading ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                                    </div>
                                ) : reviews.length > 0 ? (
                                    <div className="space-y-6 sm:space-y-8">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="bg-white/50 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-white shadow-sm hover:shadow-md transition-all">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-bold text-lg text-[var(--color-text)]">{review.user_name}</h4>
                                                        <div className="flex gap-1 mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-[var(--color-text-light)] font-medium">
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-[var(--color-text)] leading-relaxed italic">"{review.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 sm:py-24 bg-[var(--color-cream)]/30 rounded-[3rem]">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">
                                            💬
                                        </div>
                                        <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-3 text-[var(--color-text)]">Be the First!</h3>
                                        <p className="text-lg text-[var(--color-text-light)] mb-8 max-w-md mx-auto">No reviews for this product yet. Share your experience and help others!</p>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="rounded-2xl px-10 border-2"
                                            onClick={() => setIsReviewModalOpen(true)}
                                        >
                                            Write the First Review
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Related Products - Premium Carousel alternative */}
            {relatedProducts.length > 0 && (
                <section className="py-12 sm:py-20 md:py-32 bg-white" suppressHydrationWarning>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 mb-8 sm:mb-12 text-center sm:text-left">
                            <div className="flex-1">
                                <span className="text-[var(--color-accent)] font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] mb-2 sm:mb-3 block">Complete Your Regimen</span>
                                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)]">
                                    You May Also Like
                                </h2>
                            </div>
                            <Link href="/products" className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-[var(--color-primary)] hover:underline">
                                View Full Collection →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12" suppressHydrationWarning>
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p as any} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
