import { supabase } from '@/lib/supabase';
import type { ContactMessage, ContactMessageInsert, NewsletterSubscriber } from '@/types/database';

// Submit contact form
export async function submitContactForm(message: ContactMessageInsert): Promise<ContactMessage> {
    const { data, error } = await supabase
        .from('contact_messages')
        .insert(message as any)
        .select()
        .single();

    if (error) throw error;
    return data as ContactMessage;
}

// Get all contact messages (for admin)
export async function getContactMessages(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get contact message by ID
export async function getContactMessageById(id: string): Promise<ContactMessage | null> {
    const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

// Mark message as read
export async function markMessageAsRead(id: string): Promise<void> {
    const { error } = await (supabase as any)
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('id', id);

    if (error) throw error;
}

// Mark message as replied
export async function markMessageAsReplied(id: string): Promise<void> {
    const { error } = await (supabase as any)
        .from('contact_messages')
        .update({ status: 'replied', replied: true })
        .eq('id', id);

    if (error) throw error;
}

// Delete contact message
export async function deleteContactMessage(id: string): Promise<void> {
    const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Subscribe to newsletter
export async function subscribeToNewsletter(email: string): Promise<NewsletterSubscriber> {
    // Check if already subscribed
    const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email)
        .single();

    if (existing) {
        // Resubscribe if unsubscribed
        const existingData = existing as NewsletterSubscriber;
        if (!existingData.subscribed) {
            const { data, error } = await (supabase as any)
                .from('newsletter_subscribers')
                .update({ subscribed: true })
                .eq('id', existingData.id)
                .select()
                .single();

            if (error) throw error;
            return data as NewsletterSubscriber;
        }
        return existingData;
    }

    // New subscription
    const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email } as any)
        .select()
        .single();

    if (error) throw error;
    return data as NewsletterSubscriber;
}

// Unsubscribe from newsletter
export async function unsubscribeFromNewsletter(email: string): Promise<void> {
    const { error } = await (supabase as any)
        .from('newsletter_subscribers')
        .update({ subscribed: false })
        .eq('email', email);

    if (error) throw error;
}

// Get all newsletter subscribers (for admin)
export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('subscribed', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get contact stats
export async function getContactStats(): Promise<{
    total: number;
    new: number;
    read: number;
    replied: number;
}> {
    const { data, error } = await supabase
        .from('contact_messages')
        .select('status');

    if (error) throw error;

    const messages = (data || []) as Array<{ status: string }>;
    return {
        total: messages.length,
        new: messages.filter(m => m.status === 'new').length,
        read: messages.filter(m => m.status === 'read').length,
        replied: messages.filter(m => m.status === 'replied').length,
    };
}
