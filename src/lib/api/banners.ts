import { supabase } from '@/lib/supabase';
import type { Banner, BannerInsert, BannerUpdate } from '@/types/database';

// Get all banners
export async function getBanners(): Promise<Banner[]> {
    const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get active banners
export async function getActiveBanners(): Promise<Banner[]> {
    const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
}

// Create banner
export async function createBanner(banner: BannerInsert): Promise<Banner> {
    const { data, error } = await supabase
        .from('banners')
        .insert(banner as any)
        .select()
        .single();

    if (error) throw error;
    return data as Banner;
}

// Update banner
export async function updateBanner(id: string, banner: BannerUpdate): Promise<Banner> {
    const { data, error } = await (supabase as any)
        .from('banners')
        .update(banner)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Banner;
}

// Delete banner
export async function deleteBanner(id: string): Promise<void> {
    const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
