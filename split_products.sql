-- Split the single generic "Organic Moringa Powder" into 3 specific size products

-- 1. Disable the old generic product (if it exists) from being featured
UPDATE products 
SET featured = false, in_stock = false 
WHERE slug = 'organic-moringa-powder';

-- 2. Insert 3 new specific products
INSERT INTO products (name, slug, description, short_description, price, original_price, category, in_stock, featured, images, benefits, ingredients, how_to_use, certifications, rating, review_count)
VALUES 
(
    'Organic Moringa Powder - 100g',
    'organic-moringa-powder-100g',
    'Our premium organic moringa powder (100g pack) is made from 100% pure moringa leaves. Perfect for first-time users to experience the benefits of this superfood.',
    '100g Pack - Premium Organic Moringa Leaf Powder',
    299,
    499,
    'Powder',
    true,
    true,
    ARRAY['/images/products/product-1.png', '/images/products/product-2.png'],
    ARRAY['Boosts energy naturally', 'Rich in antioxidants', 'Supports immune system', 'Promotes healthy skin'],
    ARRAY['100% Organic Moringa Oleifera Leaves'],
    'Mix 1 teaspoon (3g) in water, smoothie, or juice.',
    ARRAY['USDA Organic', 'Non-GMO', 'Vegan'],
    4.8,
    150
),
(
    'Organic Moringa Powder - 250g',
    'organic-moringa-powder-250g',
    'Our most popular 250g pack of premium organic moringa powder. Ideal for daily users who want to maintain a healthy lifestyle with a steady supply of superfood nutrition.',
    '250g Pack - Best Value Organic Moringa Leaf Powder',
    999,
    1199,
    'Powder',
    true,
    true,
    ARRAY['/images/products/product-1.png', '/images/products/product-2.png'],
    ARRAY['Boosts energy naturally', 'Rich in antioxidants', 'Supports immune system', 'Promotes healthy skin', 'Great value'],
    ARRAY['100% Organic Moringa Oleifera Leaves'],
    'Mix 1 teaspoon (3g) in water, smoothie, or juice.',
    ARRAY['USDA Organic', 'Non-GMO', 'Vegan'],
    4.9,
    420
),
(
    'Organic Moringa Powder - 500g',
    'organic-moringa-powder-500g',
    'Family pack (500g) of our premium organic moringa powder. The most economical choice for families or power users who love their daily moringa boost.',
    '500g Family Pack - Premium Organic Moringa Leaf Powder',
    1799,
    2199,
    'Powder',
    true,
    true,
    ARRAY['/images/products/product-1.png', '/images/products/product-2.png'],
    ARRAY['Maximum savings', 'Boosts energy naturally', 'Rich in antioxidants', 'Supports immune system', 'Promotes healthy skin'],
    ARRAY['100% Organic Moringa Oleifera Leaves'],
    'Mix 1 teaspoon (3g) in water, smoothie, or juice.',
    ARRAY['USDA Organic', 'Non-GMO', 'Vegan'],
    4.9,
    215
)
ON CONFLICT (slug) DO UPDATE SET 
    featured = EXCLUDED.featured,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    name = EXCLUDED.name, -- Update name in case we change it
    images = EXCLUDED.images;

-- 3. Ensure other products are still active/featured if needed (optional)
