import { supabase } from '@/lib/supabase';
import type { FAQ, FAQInsert, FAQUpdate } from '@/types/database';

// Get all active FAQs
export async function getFAQs(): Promise<FAQ[]> {
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
}

// Get all FAQs (for admin)
export async function getAllFAQs(): Promise<FAQ[]> {
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
}

// Get FAQs by category
export async function getFAQsByCategory(category: string): Promise<FAQ[]> {
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('active', true)
        .eq('category', category)
        .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
}

// Get FAQ by ID
export async function getFAQById(id: string): Promise<FAQ | null> {
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

// Create FAQ
export async function createFAQ(faq: FAQInsert): Promise<FAQ> {
    const { data, error } = await supabase
        .from('faqs')
        .insert(faq as any)
        .select()
        .single();

    if (error) throw error;
    return data as FAQ;
}

// Update FAQ
export async function updateFAQ(id: string, faq: FAQUpdate): Promise<FAQ> {
    const { data, error } = await (supabase as any)
        .from('faqs')
        .update(faq)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as FAQ;
}

// Delete FAQ
export async function deleteFAQ(id: string): Promise<void> {
    const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Get FAQ categories
export async function getFAQCategories(): Promise<string[]> {
    const { data, error } = await supabase
        .from('faqs')
        .select('category')
        .eq('active', true);

    if (error) throw error;

    const categories = [...new Set((data as Array<{ category: string }>)?.map(f => f.category) || [])];
    return categories;
}

// Get top FAQs (for homepage)
export async function getTopFAQs(limit: number = 4): Promise<FAQ[]> {
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true })
        .limit(limit);

    if (error) throw error;
    return data || [];
}
