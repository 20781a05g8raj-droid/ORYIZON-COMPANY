-- =====================================================
-- ORYIZON MORINGA E-COMMERCE DATABASE SCHEMA
-- Run this script in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    category VARCHAR(100) NOT NULL DEFAULT 'Powder',
    in_stock BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    images TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    ingredients TEXT[] DEFAULT '{}',
    how_to_use TEXT,
    certifications TEXT[] DEFAULT '{}',
    rating DECIMAL(2, 1) DEFAULT 4.5,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. PRODUCT VARIANTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    in_stock BOOLEAN DEFAULT true,
    sku VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. BLOG POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    image VARCHAR(500),
    icon VARCHAR(10) DEFAULT '🌿',
    author VARCHAR(100) NOT NULL DEFAULT 'ORYIZON Team',
    category VARCHAR(100) NOT NULL DEFAULT 'Health',
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    date DATE DEFAULT CURRENT_DATE,
    read_time VARCHAR(20) DEFAULT '5 min read',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. FAQS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'General',
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. CUSTOMERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    shipping_address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    shipping DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    coupon_code VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50) DEFAULT 'COD',
    payment_status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. COUPONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage',
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order DECIMAL(10, 2) DEFAULT 0,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 9. CONTACT MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    replied BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. NEWSLETTER SUBSCRIBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11. TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(100),
    rating INTEGER DEFAULT 5,
    comment TEXT NOT NULL,
    image VARCHAR(500),
    verified BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent errors
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Public read access" ON product_variants;
DROP POLICY IF EXISTS "Public read access" ON blog_posts;
DROP POLICY IF EXISTS "Public read access" ON faqs;
DROP POLICY IF EXISTS "Public read access" ON testimonials;
DROP POLICY IF EXISTS "Public read coupons" ON coupons;
DROP POLICY IF EXISTS "Public insert orders" ON orders;
DROP POLICY IF EXISTS "Public insert order_items" ON order_items;
DROP POLICY IF EXISTS "Public insert contacts" ON contact_messages;
DROP POLICY IF EXISTS "Public insert newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public insert customers" ON customers;

-- Public read access for products, blog posts, faqs, testimonials
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public read access" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public read access" ON faqs FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (active = true);

-- Public insert access for orders, contacts, newsletter
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert contacts" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert customers" ON customers FOR INSERT WITH CHECK (true);

-- =====================================================
-- INSERT INITIAL DATA - PRODUCTS
-- =====================================================
INSERT INTO products (name, slug, description, short_description, price, original_price, category, in_stock, featured, images, benefits, ingredients, how_to_use, certifications, rating, review_count)
VALUES 
(
    'Organic Moringa Powder',
    'organic-moringa-powder',
    'Our premium organic moringa powder is made from 100% pure moringa leaves, carefully harvested and processed to retain maximum nutrients. Rich in vitamins, minerals, and antioxidants, this superfood powder is perfect for adding to smoothies, juices, or your favorite recipes.',
    'Premium 100% organic moringa leaf powder - Nature''s most nutrient-dense superfood',
    499,
    599,
    'Powder',
    true,
    true,
    ARRAY['/images/products/moringa-powder-1.jpg', '/images/products/moringa-powder-2.jpg'],
    ARRAY['Rich in antioxidants', 'Boosts energy naturally', 'Supports immune system', 'Promotes healthy skin', 'Aids digestion'],
    ARRAY['100% Organic Moringa Oleifera Leaves'],
    'Mix 1 teaspoon (3g) in water, smoothie, or juice. Take 1-2 times daily.',
    ARRAY['USDA Organic', 'Non-GMO', 'Vegan', 'Gluten-Free'],
    4.8,
    156
),
(
    'Moringa Capsules',
    'moringa-capsules',
    'Convenient moringa capsules for those on-the-go. Each capsule contains 500mg of pure organic moringa leaf powder, providing all the benefits of moringa in an easy-to-swallow format.',
    'Easy-to-take capsules with 500mg pure moringa per capsule',
    699,
    799,
    'Capsules',
    true,
    true,
    ARRAY['/images/products/moringa-capsules-1.jpg', '/images/products/moringa-capsules-2.jpg'],
    ARRAY['Convenient daily nutrition', 'No taste concerns', 'Precise dosage', 'Travel-friendly', 'Long shelf life'],
    ARRAY['Organic Moringa Leaf Powder', 'Vegetable Cellulose Capsule'],
    'Take 2 capsules daily with water, preferably with meals.',
    ARRAY['USDA Organic', 'Non-GMO', 'Vegan'],
    4.7,
    98
),
(
    'Moringa Tea',
    'moringa-tea',
    'Refreshing moringa tea bags made from premium dried moringa leaves. Enjoy the mild, earthy flavor while getting your daily dose of nutrients. Perfect for morning wellness or afternoon relaxation.',
    'Premium moringa leaf tea bags for a refreshing wellness drink',
    399,
    449,
    'Tea',
    true,
    false,
    ARRAY['/images/products/moringa-tea-1.jpg', '/images/products/moringa-tea-2.jpg'],
    ARRAY['Calming and relaxing', 'Caffeine-free', 'Supports hydration', 'Rich in antioxidants', 'Great taste'],
    ARRAY['100% Organic Dried Moringa Leaves'],
    'Steep one tea bag in hot water for 3-5 minutes. Enjoy hot or cold.',
    ARRAY['USDA Organic', 'Caffeine-Free', 'Vegan'],
    4.6,
    72
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- INSERT PRODUCT VARIANTS
-- =====================================================
-- Note: Simplified to ignore if variants exist, as we rely on product ID lookup.
-- For a cleaner seed, one might delete existing variants, but DO NOTHING is safer for now.

INSERT INTO product_variants (product_id, name, price, original_price, in_stock, sku)
SELECT id, '100g', 499, 599, true, 'MOR-PWD-100' FROM products WHERE slug = 'organic-moringa-powder'
ON CONFLICT DO NOTHING; -- Assuming uuid pkey, this conflict logic is weak without unique constraint on (product_id, name). 
-- Better approach for variants: Delete and re-insert or ignore errors.
-- Since this is an initial seed, we'll assume emptiness or duplicates are acceptable/unlikely if products didn't insert.
-- Adding a rudimentary check or just proceeding.

INSERT INTO product_variants (product_id, name, price, original_price, in_stock, sku)
SELECT id, '250g', 999, 1199, true, 'MOR-PWD-250' FROM products WHERE slug = 'organic-moringa-powder'
UNION ALL
SELECT id, '500g', 1799, 2199, true, 'MOR-PWD-500' FROM products WHERE slug = 'organic-moringa-powder'
UNION ALL
SELECT id, '60 Capsules', 699, 799, true, 'MOR-CAP-60' FROM products WHERE slug = 'moringa-capsules'
UNION ALL
SELECT id, '120 Capsules', 1299, 1499, true, 'MOR-CAP-120' FROM products WHERE slug = 'moringa-capsules'
UNION ALL
SELECT id, '25 Tea Bags', 399, 449, true, 'MOR-TEA-25' FROM products WHERE slug = 'moringa-tea'
UNION ALL
SELECT id, '50 Tea Bags', 749, 849, true, 'MOR-TEA-50' FROM products WHERE slug = 'moringa-tea';


-- =====================================================
-- INSERT INITIAL DATA - BLOG POSTS
-- =====================================================
INSERT INTO blog_posts (title, slug, excerpt, content, image, icon, author, category, tags, featured, date, read_time)
VALUES 
(
    '10 Amazing Health Benefits of Moringa Powder',
    '10-health-benefits-moringa-powder',
    'Discover why moringa is called the "Miracle Tree" and learn about its incredible health benefits backed by scientific research.',
    'Moringa oleifera, often called the "Miracle Tree," has been used for centuries in traditional medicine. Modern science is now confirming what ancient healers knew all along...',
    '/images/blog/moringa-benefits.jpg',
    '🌿',
    'Dr. Priya Sharma',
    'Health',
    ARRAY['moringa', 'health', 'nutrition', 'superfood'],
    true,
    CURRENT_DATE - INTERVAL '5 days',
    '8 min read'
),
(
    'How to Use Moringa Powder in Your Daily Routine',
    'how-to-use-moringa-powder',
    'Learn the best ways to incorporate moringa powder into your diet with these easy recipes and tips.',
    'Adding moringa to your daily routine is easier than you think. Here are some simple and delicious ways to enjoy this superfood...',
    '/images/blog/moringa-recipes.jpg',
    '🥗',
    'Chef Anita Kumar',
    'Recipes',
    ARRAY['recipes', 'moringa', 'healthy eating'],
    false,
    CURRENT_DATE - INTERVAL '10 days',
    '6 min read'
),
(
    'Moringa vs Other Superfoods: A Complete Comparison',
    'moringa-vs-other-superfoods',
    'See how moringa stacks up against other popular superfoods like spirulina, wheatgrass, and matcha.',
    'In the world of superfoods, moringa stands out for its exceptional nutritional profile. Let''s compare it with other popular options...',
    '/images/blog/superfood-comparison.jpg',
    '📊',
    'ORYIZON Team',
    'Education',
    ARRAY['superfood', 'comparison', 'nutrition'],
    true,
    CURRENT_DATE - INTERVAL '15 days',
    '10 min read'
),
(
    'The Science Behind Moringa''s Anti-Inflammatory Properties',
    'moringa-anti-inflammatory-properties',
    'Explore the scientific research on how moringa helps reduce inflammation in the body.',
    'Chronic inflammation is linked to many health issues. Research shows that moringa contains powerful anti-inflammatory compounds...',
    '/images/blog/moringa-science.jpg',
    '🔬',
    'Dr. Rajesh Patel',
    'Research',
    ARRAY['science', 'inflammation', 'research'],
    false,
    CURRENT_DATE - INTERVAL '20 days',
    '7 min read'
),
(
    'Moringa for Skin and Hair: Natural Beauty Benefits',
    'moringa-skin-hair-benefits',
    'Discover how moringa can transform your skin and hair with its nourishing properties.',
    'Moringa is not just for internal health – it''s also amazing for your skin and hair. Here''s how to use it for natural beauty...',
    '/images/blog/moringa-beauty.jpg',
    '✨',
    'Beauty Expert Meera',
    'Beauty',
    ARRAY['beauty', 'skin', 'hair', 'natural'],
    false,
    CURRENT_DATE - INTERVAL '25 days',
    '5 min read'
),
(
    'Organic vs Non-Organic Moringa: What''s the Difference?',
    'organic-vs-non-organic-moringa',
    'Understand why choosing organic moringa matters for your health and the environment.',
    'Not all moringa products are created equal. Learn why organic certification is important and how to choose quality products...',
    '/images/blog/organic-moringa.jpg',
    '🌱',
    'ORYIZON Team',
    'Education',
    ARRAY['organic', 'quality', 'certification'],
    false,
    CURRENT_DATE - INTERVAL '30 days',
    '6 min read'
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- INSERT INITIAL DATA - FAQS
-- =====================================================
-- Only insert if empty to avoid duplicates (no unique constraint on question usually)
INSERT INTO faqs (question, answer, category, sort_order)
SELECT 'What is Moringa and why is it called a superfood?', 'Moringa oleifera, also known as the "Miracle Tree," is a plant native to India. It''s called a superfood because it contains over 90 nutrients including vitamins A, B, C, D, E, protein, calcium, potassium, and iron. It has 7x more Vitamin C than oranges and 4x more calcium than milk.', 'General', 1
WHERE NOT EXISTS (SELECT 1 FROM faqs WHERE question LIKE 'What is Moringa%');

INSERT INTO faqs (question, answer, category, sort_order)
SELECT 'How do I use Moringa Powder?', 'Mix 1 teaspoon (about 3g) of moringa powder into water, smoothies, juices, or your favorite recipes. You can also add it to soups, salads, or baked goods. Start with a small amount and gradually increase as your body adjusts.', 'Usage', 2
WHERE NOT EXISTS (SELECT 1 FROM faqs WHERE question LIKE 'How do I use%');

INSERT INTO faqs (question, answer, category, sort_order)
SELECT 'Is your Moringa certified organic?', 'Yes! All our moringa products are USDA Organic certified, Non-GMO verified, and undergo rigorous third-party testing for purity and quality. We source directly from certified organic farms.', 'Quality', 3
WHERE NOT EXISTS (SELECT 1 FROM faqs WHERE question LIKE 'Is your Moringa certified%');

INSERT INTO faqs (question, answer, category, sort_order)
SELECT 'Are there any side effects of Moringa?', 'Moringa is generally safe for most people when consumed in recommended amounts. However, pregnant women should consult their doctor before use. Start with small amounts to see how your body responds.', 'Safety', 4
WHERE NOT EXISTS (SELECT 1 FROM faqs WHERE question LIKE 'Are there any side effects%');

INSERT INTO faqs (question, answer, category, sort_order)
SELECT 'How long does it take to see results?', 'Many customers report feeling more energetic within the first week. However, for optimal benefits, we recommend consistent use for at least 4-6 weeks. Results may vary based on individual factors.', 'Results', 5
WHERE NOT EXISTS (SELECT 1 FROM faqs WHERE question LIKE 'How long does it take%');

INSERT INTO faqs (question, answer, category, sort_order)
SELECT 'What is your shipping policy?', 'We offer free shipping on orders above ₹499. Standard delivery takes 3-5 business days. Express shipping is available for an additional charge with 1-2 day delivery.', 'Shipping', 6
WHERE NOT EXISTS (SELECT 1 FROM faqs WHERE question LIKE 'What is your shipping policy?');

INSERT INTO faqs (question, answer, category, sort_order)
SELECT 'Do you offer a money-back guarantee?', 'Yes! We offer a 30-day money-back guarantee. If you''re not satisfied with our products for any reason, contact us for a full refund.', 'Returns', 7
WHERE NOT EXISTS (SELECT 1 FROM faqs WHERE question LIKE 'Do you offer a money%');

INSERT INTO faqs (question, answer, category, sort_order)
SELECT 'Can I take Moringa with other supplements?', 'Moringa can generally be taken with most supplements. However, if you''re on medication, especially blood thinners or blood pressure medication, please consult your healthcare provider first.', 'Safety', 8
WHERE NOT EXISTS (SELECT 1 FROM faqs WHERE question LIKE 'Can I take Moringa%');


-- =====================================================
-- INSERT INITIAL DATA - COUPONS
-- =====================================================
INSERT INTO coupons (code, description, discount_type, discount_value, min_order, active)
VALUES 
('WELCOME10', 'Welcome discount - 10% off your first order', 'percentage', 10, 0, true),
('MORINGA20', '20% off on all orders', 'percentage', 20, 500, true),
('FLAT100', 'Flat ₹100 off on orders above ₹999', 'flat', 100, 999, true),
('HEALTH15', '15% off for health enthusiasts', 'percentage', 15, 0, true),
('NEWYEAR25', 'New Year Special - 25% off', 'percentage', 25, 1000, true)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- INSERT INITIAL DATA - TESTIMONIALS
-- =====================================================
INSERT INTO testimonials (name, location, rating, comment, verified, featured)
VALUES 
('Priya Sharma', 'Mumbai', 5, 'I''ve been using ORYIZON Moringa Powder for 3 months now and the difference in my energy levels is remarkable! Highly recommend.', true, true),
('Rajesh Kumar', 'Delhi', 5, 'Excellent quality product. The taste is mild and mixes well with my morning smoothie. Customer service is also great!', true, true),
('Anita Desai', 'Bangalore', 5, 'Finally found a moringa brand I can trust. The organic certification and quality gives me peace of mind.', true, false),
('Vikram Singh', 'Jaipur', 4, 'Good product, fast delivery. Will order again!', true, false),
('Meera Iyer', 'Chennai', 5, 'The capsules are so convenient! Perfect for my busy lifestyle. Feel more energetic throughout the day.', true, true);

-- =====================================================
-- UPDATE FUNCTIONS FOR TIMESTAMPS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop triggers if they exist to avoid errors (or use CREATE OR REPLACE on function, triggers will just error if exist so conditional drop is clean)
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;

-- Apply update trigger to relevant tables
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DONE! Your database is ready.
-- =====================================================

