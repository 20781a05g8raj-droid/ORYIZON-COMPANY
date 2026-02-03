import { supabase } from '@/lib/supabase';
import type { Coupon, CouponInsert, CouponUpdate } from '@/types/database';

// Get all active coupons
export async function getActiveCoupons(): Promise<Coupon[]> {
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get all coupons (for admin)
export async function getAllCoupons(): Promise<Coupon[]> {
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get coupon by code
export async function getCouponByCode(code: string): Promise<Coupon | null> {
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

// Validate coupon
export async function validateCoupon(code: string, orderTotal: number): Promise<{
    valid: boolean;
    coupon?: Coupon;
    error?: string;
    discount?: number;
}> {
    const coupon = await getCouponByCode(code);

    if (!coupon) {
        return { valid: false, error: 'Invalid coupon code' };
    }

    // Check if expired
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return { valid: false, error: 'Coupon has expired' };
    }

    // Check if not yet started
    if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) {
        return { valid: false, error: 'Coupon is not yet active' };
    }

    // Check minimum order
    if (coupon.min_order && orderTotal < coupon.min_order) {
        return { valid: false, error: `Minimum order of ₹${coupon.min_order} required` };
    }

    // Check usage limit
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        return { valid: false, error: 'Coupon usage limit reached' };
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
        discount = (orderTotal * coupon.discount_value) / 100;
    } else {
        discount = coupon.discount_value;
    }

    return { valid: true, coupon, discount };
}

// Create coupon
export async function createCoupon(coupon: CouponInsert): Promise<Coupon> {
    const { data, error } = await supabase
        .from('coupons')
        .insert({ ...coupon, code: coupon.code.toUpperCase() } as any)
        .select()
        .single();

    if (error) throw error;
    return data as Coupon;
}

// Update coupon
export async function updateCoupon(id: string, coupon: CouponUpdate): Promise<Coupon> {
    const updateData = coupon.code ? { ...coupon, code: coupon.code.toUpperCase() } : coupon;

    const { data, error } = await (supabase as any)
        .from('coupons')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Coupon;
}

// Delete coupon
export async function deleteCoupon(id: string): Promise<void> {
    const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Increment coupon usage
export async function incrementCouponUsage(id: string): Promise<void> {
    const { error } = await (supabase as any)
        .rpc('increment_coupon_usage', { coupon_id: id });

    // If RPC doesn't exist, do it manually
    if (error) {
        const { data: coupon } = await supabase
            .from('coupons')
            .select('used_count')
            .eq('id', id)
            .single();

        const couponData = coupon as { used_count: number } | null;
        if (couponData) {
            await (supabase as any)
                .from('coupons')
                .update({ used_count: (couponData.used_count || 0) + 1 })
                .eq('id', id);
        }
    }
}
