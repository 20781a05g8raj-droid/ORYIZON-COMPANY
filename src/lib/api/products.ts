import { supabase } from '@/lib/supabase';
import type { Product, ProductInsert, ProductUpdate, ProductWithVariants, ProductVariant, ProductVariantInsert, ProductVariantUpdate } from '@/types/database';

// Get all products
export async function getProducts(): Promise<ProductWithVariants[]> {
    const { data, error } = await supabase
        .from('products')
        .select(`
    *,
    product_variants(*)
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get featured products
export async function getFeaturedProducts(): Promise<ProductWithVariants[]> {
    const { data, error } = await supabase
        .from('products')
        .select(`
    *,
    product_variants(*)
        `)
        .eq('featured', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<ProductWithVariants | null> {
    const { data, error } = await supabase
        .from('products')
        .select(`
    *,
    product_variants(*)
        `)
        .eq('slug', slug)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
    }
    return data;
}

// Get product by ID
export async function getProductById(id: string): Promise<ProductWithVariants | null> {
    const { data, error } = await supabase
        .from('products')
        .select(`
    *,
    product_variants(*)
        `)
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

// Create product
export async function createProduct(product: ProductInsert): Promise<Product> {
    const { data, error } = await supabase
        .from('products')
        // @ts-ignore
        .insert(product as any)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Update product
export async function updateProduct(id: string, product: ProductUpdate): Promise<Product> {
    const { data, error } = await supabase
        .from('products')
        // @ts-ignore
        .update(product as any)
        .eq('id', id)
        .select()
        .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Product not found or update failed');
    return data;
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Add product variant
export async function addProductVariant(variant: ProductVariantInsert): Promise<ProductVariant> {
    const { data, error } = await supabase
        .from('product_variants')
        // @ts-ignore
        .insert(variant as any)
        .select()
        .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Variant creation failed');
    return data;
}

// Delete product variant
export async function deleteProductVariant(id: string): Promise<void> {
    const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<ProductWithVariants[]> {
    const { data, error } = await supabase
        .from('products')
        .select(`
    *,
    product_variants(*)
        `)
        .eq('category', category)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Update product variant
export async function updateProductVariant(id: string, variant: ProductVariantUpdate): Promise<ProductVariant> {
    const { data, error } = await supabase
        .from('product_variants')
        // @ts-ignore
        .update(variant as any)
        .eq('id', id)
        .select()
        .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Variant not found or update failed');
    return data;
}
