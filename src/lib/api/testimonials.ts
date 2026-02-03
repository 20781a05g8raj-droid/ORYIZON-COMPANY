import { supabase } from '@/lib/supabase';
import type { Testimonial } from '@/types/database';

// Get all testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get featured testimonials
export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get verified testimonials
export async function getVerifiedTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('verified', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}
