import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type ProductReview = Database['public']['Tables']['product_reviews']['Row'];
export type ProductReviewInsert = Database['public']['Tables']['product_reviews']['Insert'];

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
    const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
    return data || [];
}

export async function getAllProductReviewStats(): Promise<Record<string, { rating: number; count: number }>> {
    const { data, error } = await supabase
        .from('product_reviews')
        .select('product_id, rating') as { data: { product_id: string; rating: number }[] | null; error: any };

    if (error || !data) {
        return {};
    }

    const stats: Record<string, { total: number; count: number }> = {};
    for (const item of data) {
        if (!stats[item.product_id]) {
            stats[item.product_id] = { total: 0, count: 0 };
        }
        stats[item.product_id].total += item.rating;
        stats[item.product_id].count += 1;
    }

    const result: Record<string, { rating: number; count: number }> = {};
    for (const [productId, stat] of Object.entries(stats)) {
        result[productId] = {
            rating: Number((stat.total / stat.count).toFixed(1)),
            count: stat.count,
        };
    }
    return result;
}

export async function submitReview(review: ProductReviewInsert): Promise<{ data: any; error: any }> {
    const { data, error } = await (supabase
        .from('product_reviews' as any)
        .insert(review as any) as any)
        .select()
        .single();

    return { data, error };
}
