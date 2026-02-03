import { supabase } from '@/lib/supabase';

export async function subscribeToNewsletter(email: string): Promise<boolean> {
    try {
        // Use type assertion to bypass strict typing issue with Supabase generated types
        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert({ email, subscribed: true } as any);

        if (error) {
            // Ignore unique constraint violation (already subscribed)
            if (error.code === '23505') {
                return true;
            }
            throw error;
        }

        return true;
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        throw error;
    }
}
