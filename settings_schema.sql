-- =====================================================
-- SITE SETTINGS TABLE FOR ADMIN CONFIGURATION
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. CREATE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ENABLE RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 3. CREATE RLS POLICIES (Public read, Public write for admin)
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public insert settings" ON site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update settings" ON site_settings FOR UPDATE USING (true);
CREATE POLICY "Public delete settings" ON site_settings FOR DELETE USING (true);

-- 4. CREATE TRIGGER FOR UPDATED_AT
CREATE TRIGGER update_site_settings_updated_at 
    BEFORE UPDATE ON site_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. INSERT DEFAULT SHIPPING SETTINGS
INSERT INTO site_settings (key, value, description) VALUES
(
    'shipping',
    '{
        "freeShippingThreshold": 499,
        "standardShipping": 50,
        "expressShipping": 100,
        "deliveryTime": {
            "standard": "5-7 business days",
            "express": "2-3 business days"
        }
    }'::jsonb,
    'Shipping configuration including free shipping threshold and delivery costs'
)
ON CONFLICT (key) DO NOTHING;

-- 6. INSERT DEFAULT CONTACT SETTINGS
INSERT INTO site_settings (key, value, description) VALUES
(
    'contact',
    '{
        "email": "oryizoncompany@gmail.com",
        "phone": "+91 8969124404",
        "whatsapp": "+918969124404",
        "address": "Raxaul, Singhpur Haraiya, Bihar- 845350 INDIA"
    }'::jsonb,
    'Company contact information'
)
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- DONE! Settings table created with default values.
-- =====================================================
