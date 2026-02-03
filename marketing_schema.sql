-- =====================================================
-- MARKETING MODULE EXTENSION
-- Include Banners and Campaigns
-- =====================================================

-- 1. BANNERS TABLE
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    link VARCHAR(500),
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    active BOOLEAN DEFAULT true,
    discount_percentage INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Policies (Public Read, Admin Write - simplified for now to public write for demo speed if needed, but sticking to public read/write for dev)
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Public insert banners" ON banners FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update banners" ON banners FOR UPDATE USING (true);
CREATE POLICY "Public delete banners" ON banners FOR DELETE USING (true);

CREATE POLICY "Public read campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Public insert campaigns" ON campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update campaigns" ON campaigns FOR UPDATE USING (true);
CREATE POLICY "Public delete campaigns" ON campaigns FOR DELETE USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
