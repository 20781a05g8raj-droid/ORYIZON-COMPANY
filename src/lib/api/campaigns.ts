import { supabase } from '@/lib/supabase';
import type { Campaign, CampaignInsert, CampaignUpdate } from '@/types/database';

// Get all campaigns
export async function getCampaigns(): Promise<Campaign[]> {
    const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('start_date', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get active campaigns
export async function getActiveCampaigns(): Promise<Campaign[]> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('active', true)
        .lte('start_date', now)
        .gte('end_date', now)
        .order('end_date', { ascending: true });

    if (error) throw error;
    return data || [];
}

// Create campaign
export async function createCampaign(campaign: CampaignInsert): Promise<Campaign> {
    const { data, error } = await supabase
        .from('campaigns')
        .insert(campaign as any)
        .select()
        .single();

    if (error) throw error;
    return data as Campaign;
}

// Update campaign
export async function updateCampaign(id: string, campaign: CampaignUpdate): Promise<Campaign> {
    const { data, error } = await (supabase as any)
        .from('campaigns')
        .update(campaign)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Campaign;
}

// Delete campaign
export async function deleteCampaign(id: string): Promise<void> {
    const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
