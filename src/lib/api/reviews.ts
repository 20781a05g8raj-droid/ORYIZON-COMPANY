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

export async function submitReview(review: ProductReviewInsert): Promise<{ data: any; error: any }> {
    const { data, error } = await (supabase
        .from('product_reviews' as any)
        .insert(review as any) as any)
        .select()
        .single();

    return { data, error };
}
