'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function ProductPage() {
    const params = useParams();
    const [product, setProduct] = useState<ProductWithVariants | null>(null);
    const [localImages, setLocalImages] = useState<string[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<ProductWithVariants[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('benefits');
    const [activeImage, setActiveImage] = useState(0);

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

        fetchProductData();
    }, [params.slug]);


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
        images = product.images?.map(img => img.replace(/ /g, '-')) || [];
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

    const tabs = [
        { id: 'benefits', label: 'Benefits' },
        { id: 'ingredients', label: 'Ingredients' },
        { id: 'howtouse', label: 'How to Use' },
        { id: 'reviews', label: `Reviews (${product.review_count || 0})` },
    ];

    return (
        <div className="min-h-screen pt-24 bg-white" suppressHydrationWarning>
            {/* Breadcrumb */}
            <div className="bg-[var(--color-cream)] py-4" suppressHydrationWarning>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-light)]">
                        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-[var(--color-primary)]">Products</Link>
                        <span>/</span>
                        <span className="text-[var(--color-text)]">{product.name}</span>
                    </div>
                </div>
            </div>

            {/* Product Section */}
            <section className="py-8 md:py-12" suppressHydrationWarning>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12" suppressHydrationWarning>
                        {/* Image Gallery */}
                        <div suppressHydrationWarning className="space-y-4">
                            {/* Main Image */}
                            <motion.div
                                key={activeImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="aspect-square bg-[var(--color-cream)] rounded-2xl overflow-hidden relative"
                                suppressHydrationWarning
                            >
                                {images[activeImage] ? (
                                    <Image
                                        src={images[activeImage]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-7xl md:text-9xl">🌿</span>
                                    </div>
                                )}

                                {/* Badges */}
                                <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-2">
                                    {discount > 0 && (
                                        <Badge variant="accent" size="sm" className="md:size-md">{discount}% OFF</Badge>
                                    )}
                                    {product.featured && (
                                        <Badge variant="success" size="sm" className="md:size-md">⭐ Best Seller</Badge>
                                    )}
                                </div>
                            </motion.div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(index)}
                                            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === index
                                                ? 'border-[var(--color-primary)]'
                                                : 'border-transparent'
                                                }`}
                                        >
                                            <div className="w-full h-full bg-[var(--color-cream)] flex items-center justify-center">
                                                <Image
                                                    src={image}
                                                    alt={`${product.name} ${index + 1}`}
                                                    width={80}
                                                    height={80}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div suppressHydrationWarning className="flex flex-col">
                            {/* Title & Rating */}
                            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 leading-tight text-[var(--color-text)]">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-3 sm:gap-4 mb-4 md:mb-6">
                                <div className="flex items-center gap-0.5 md:gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className="text-[var(--color-accent)]"
                                            fill={i < Math.round(Number(product.rating || 0)) ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm md:text-base text-[var(--color-text-light)]">
                                    {product.rating} ({product.review_count} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline flex-wrap gap-3 md:gap-4 mb-5 md:mb-6">
                                <span className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-primary)]">
                                    {formatPrice(currentPrice)}
                                </span>
                                {originalPrice > 0 && (
                                    <>
                                        <span className="text-lg md:text-xl text-[var(--color-text-muted)] line-through">
                                            {formatPrice(originalPrice)}
                                        </span>
                                        <Badge variant="success" size="sm">
                                            Save {formatPrice(originalPrice - currentPrice)}
                                        </Badge>
                                    </>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-sm md:text-base text-[var(--color-text-light)] mb-6 md:mb-8 leading-relaxed">
                                {product.short_description}
                            </p>

                            {/* Variants */}
                            {variants.length > 0 && (
                                <div className="mb-6">
                                    <p className="font-medium text-sm md:text-base mb-3">Select Variant:</p>
                                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:flex sm:flex-wrap gap-2 md:gap-3">
                                        {variants.map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`flex-1 sm:flex-none px-3 py-2 md:px-5 md:py-3 rounded-lg border-2 font-medium transition-all text-sm md:text-base ${selectedVariant?.id === variant.id
                                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                                                    : 'border-[var(--color-secondary)] bg-white hover:border-[var(--color-primary)] shadow-sm'
                                                    } ${!variant.in_stock ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                                            >
                                                <span className="block truncate">{variant.name}</span>
                                                <span className="block text-xs md:text-sm opacity-80">
                                                    {formatPrice(Number(variant.price))}
                                                </span>
                                                {!variant.in_stock && (
                                                    <span className="block text-[10px] md:text-xs text-red-500 font-bold mt-1">Out of Stock</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-6 md:mb-8">
                                <p className="font-medium text-sm md:text-base mb-3">Quantity:</p>
                                <div className="inline-flex items-center border border-[var(--color-secondary)] rounded-lg bg-white overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 hover:bg-[var(--color-secondary)] transition-colors active:scale-95"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-10 md:w-12 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-3 hover:bg-[var(--color-secondary)] transition-colors active:scale-95"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    icon={isOutOfStock ? undefined : <ShoppingCart size={20} />}
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                    className={`py-4 md:py-4 ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400 border-gray-400' : ''}`}
                                >
                                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                                </Button>
                                {!isOutOfStock && (
                                    <Button
                                        variant="accent"
                                        size="lg"
                                        fullWidth
                                        className="py-4 md:py-4"
                                    >
                                        Buy Now
                                    </Button>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-6 mb-6 md:mb-8 px-1">
                                <button className="flex items-center gap-2 text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors">
                                    <Heart size={18} />
                                    <span>Add to Wishlist</span>
                                </button>
                                <button className="flex items-center gap-2 text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors">
                                    <Share2 size={18} />
                                    <span>Share</span>
                                </button>
                            </div>

                            {/* Trust Elements */}
                            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 md:gap-4 p-4 md:p-5 bg-[var(--color-cream)] rounded-xl border border-[var(--color-secondary)] shadow-sm">
                                {[
                                    { icon: <Truck size={20} />, title: 'Free Shipping', desc: 'On orders over ₹499' },
                                    { icon: <RotateCcw size={20} />, title: 'Easy Returns', desc: '30-day money back' },
                                    { icon: <Shield size={20} />, title: 'Secure Payment', desc: '100% protected' },
                                    { icon: <Check size={20} />, title: 'Certified Organic', desc: 'Lab tested' },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center xs:items-start gap-3">
                                        <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-lg flex-shrink-0 flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-xs md:text-sm">{item.title}</p>
                                            <p className="text-[10px] md:text-xs text-[var(--color-text-light)] line-clamp-1">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Details Tabs */}
            <section className="py-8 md:py-16 bg-[var(--color-cream)]" suppressHydrationWarning>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                    {/* Tabs Navigation */}
                    <div className="flex gap-1 md:gap-2 mb-6 md:mb-8 border-b border-[var(--color-secondary)] overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap px-4 md:px-6 py-3 font-medium text-xs md:text-base transition-colors relative ${activeTab === tab.id
                                    ? 'text-[var(--color-primary)]'
                                    : 'text-[var(--color-text-light)] hover:text-[var(--color-text)]'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-[var(--color-secondary)]" suppressHydrationWarning>
                        {activeTab === 'benefits' && (
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-heading text-2xl font-semibold mb-6">Key Benefits</h3>
                                    {benefits.length > 0 ? (
                                        <ul className="space-y-4">
                                            {benefits.map((benefit, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <span className="w-6 h-6 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                                                        ✓
                                                    </span>
                                                    <span>{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">No specific benefits listed.</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-heading text-2xl font-semibold mb-6">Certifications</h3>
                                    {certifications.length > 0 ? (
                                        <div className="flex flex-wrap gap-4">
                                            {certifications.map((cert) => (
                                                <div
                                                    key={cert}
                                                    className="px-4 py-2 bg-[var(--color-cream)] rounded-lg text-sm font-medium"
                                                >
                                                    ✓ {cert.charAt(0).toUpperCase() + cert.slice(1)}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No certifications listed.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'ingredients' && (
                            <div>
                                <h3 className="font-heading text-2xl font-semibold mb-6">Ingredients</h3>
                                {ingredients.length > 0 ? (
                                    <ul className="space-y-3 mb-8">
                                        {ingredients.map((ingredient, index) => (
                                            <li key={index} className="flex items-center gap-3">
                                                <span className="text-[var(--color-primary)]">•</span>
                                                {ingredient}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 mb-8">No specific ingredients listed.</p>
                                )}

                                {product.how_to_use && (
                                    <div>
                                        <h3 className="font-heading text-2xl font-semibold mb-6">Instructions</h3>
                                        <p>{product.how_to_use}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'howtouse' && (
                            <div>
                                <h3 className="font-heading text-2xl font-semibold mb-6">How to Use</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {product.how_to_use || 'No instructions provided.'}
                                </p>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="font-heading text-2xl font-semibold mb-2">Customer Reviews</h3>
                                        <p className="text-gray-500">Coming soon!</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="py-16 bg-white" suppressHydrationWarning>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                        <h2 className="font-heading text-3xl font-bold mb-8 text-center">
                            You May Also Like
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8" suppressHydrationWarning>
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
