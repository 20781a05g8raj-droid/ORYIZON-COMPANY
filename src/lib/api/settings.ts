import { supabase } from '@/lib/supabase';

export interface ShippingSettings {
    freeShippingThreshold: number;
    standardShipping: number;
    expressShipping: number;
    deliveryTime: {
        standard: string;
        express: string;
    };
}

export interface ContactSettings {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
}

export interface SiteSetting {
    id: string;
    key: string;
    value: any;
    description: string | null;
    created_at: string;
    updated_at: string;
}

// Default shipping settings (fallback if database is empty)
const DEFAULT_SHIPPING: ShippingSettings = {
    freeShippingThreshold: 499,
    standardShipping: 50,
    expressShipping: 100,
    deliveryTime: {
        standard: '5-7 business days',
        express: '2-3 business days',
    },
};

// Get a setting by key
export async function getSetting(key: string): Promise<any | null> {
    const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single();

    if (error) {
        console.error('Error fetching setting:', key, error);
        return null;
    }

    return data?.value || null;
}

// Get all settings
export async function getAllSettings(): Promise<SiteSetting[]> {
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');

    if (error) {
        console.error('Error fetching all settings:', error);
        return [];
    }

    return (data || []) as SiteSetting[];
}

// Update a setting by key
export async function updateSetting(key: string, value: any): Promise<boolean> {
    const { error } = await (supabase as any)
        .from('site_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);

    if (error) {
        console.error('Error updating setting:', key, error);
        return false;
    }

    return true;
}

// Create or update a setting (upsert)
export async function upsertSetting(key: string, value: any, description?: string): Promise<boolean> {
    const { error } = await supabase
        .from('site_settings')
        .upsert({
            key,
            value,
            description: description || null,
            updated_at: new Date().toISOString()
        } as any, { onConflict: 'key' });

    if (error) {
        console.error('Error upserting setting:', key, error);
        return false;
    }

    return true;
}

// Get shipping settings with fallback to defaults
export async function getShippingSettings(): Promise<ShippingSettings> {
    const settings = await getSetting('shipping');

    if (!settings) {
        return DEFAULT_SHIPPING;
    }

    return {
        freeShippingThreshold: settings.freeShippingThreshold ?? DEFAULT_SHIPPING.freeShippingThreshold,
        standardShipping: settings.standardShipping ?? DEFAULT_SHIPPING.standardShipping,
        expressShipping: settings.expressShipping ?? DEFAULT_SHIPPING.expressShipping,
        deliveryTime: {
            standard: settings.deliveryTime?.standard ?? DEFAULT_SHIPPING.deliveryTime.standard,
            express: settings.deliveryTime?.express ?? DEFAULT_SHIPPING.deliveryTime.express,
        },
    };
}

// Update shipping settings
export async function updateShippingSettings(settings: ShippingSettings): Promise<boolean> {
    return updateSetting('shipping', settings);
}

// Get contact settings
export async function getContactSettings(): Promise<ContactSettings | null> {
    return getSetting('contact');
}

// Update contact settings
export async function updateContactSettings(settings: ContactSettings): Promise<boolean> {
    return updateSetting('contact', settings);
}
