const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Load environment variables manually since dotenv might not be available or configured
// We'll parse .env.local manually to be safe
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && !key.startsWith('#')) {
            env[key] = value;
        }
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    try {
        console.log('Starting product migration...');

        // 1. Disable the old generic product
        console.log('Disabling old generic product...');
        try {
            const { error: updateError } = await supabase
                .from('products')
                .update({ featured: false, in_stock: false })
                .eq('slug', 'organic-moringa-powder');

            if (updateError) {
                console.error('Error disabling old product (non-fatal):', updateError);
            } else {
                console.log('Old product disabled (if it existed).');
            }
        } catch (err) {
            console.error('Exception during update:', err);
        }

        // 2. Insert new products
        const newProducts = [
            {
                name: 'Organic Moringa Powder - 100g',
                slug: 'organic-moringa-powder-100g',
                description: 'Our premium organic moringa powder (100g pack) is made from 100% pure moringa leaves. Perfect for first-time users to experience the benefits of this superfood.',
                short_description: '100g Pack - Premium Organic Moringa Leaf Powder',
                price: 299,
                original_price: 499,
                category: 'Powder',
                in_stock: true,
                featured: true,
                images: ['/images/products/product-1.png', '/images/products/product-2.png'],
                benefits: ['Boosts energy naturally', 'Rich in antioxidants', 'Supports immune system', 'Promotes healthy skin'],
                ingredients: ['100% Organic Moringa Oleifera Leaves'],
                how_to_use: 'Mix 1 teaspoon (3g) in water, smoothie, or juice.',
                certifications: ['USDA Organic', 'Non-GMO', 'Vegan'],
                rating: 4.8,
                review_count: 150
            },
            {
                name: 'Organic Moringa Powder - 250g',
                slug: 'organic-moringa-powder-250g',
                description: 'Our most popular 250g pack of premium organic moringa powder. Ideal for daily users who want to maintain a healthy lifestyle with a steady supply of superfood nutrition.',
                short_description: '250g Pack - Best Value Organic Moringa Leaf Powder',
                price: 999,
                original_price: 1199,
                category: 'Powder',
                in_stock: true,
                featured: true,
                images: ['/images/products/product-1.png', '/images/products/product-2.png'],
                benefits: ['Boosts energy naturally', 'Rich in antioxidants', 'Supports immune system', 'Promotes healthy skin', 'Great value'],
                ingredients: ['100% Organic Moringa Oleifera Leaves'],
                how_to_use: 'Mix 1 teaspoon (3g) in water, smoothie, or juice.',
                certifications: ['USDA Organic', 'Non-GMO', 'Vegan'],
                rating: 4.9,
                review_count: 420
            },
            {
                name: 'Organic Moringa Powder - 500g',
                slug: 'organic-moringa-powder-500g',
                description: 'Family pack (500g) of our premium organic moringa powder. The most economical choice for families or power users who love their daily moringa boost.',
                short_description: '500g Family Pack - Premium Organic Moringa Leaf Powder',
                price: 1799,
                original_price: 2199,
                category: 'Powder',
                in_stock: true,
                featured: true,
                images: ['/images/products/product-1.png', '/images/products/product-2.png'],
                benefits: ['Maximum savings', 'Boosts energy naturally', 'Rich in antioxidants', 'Supports immune system', 'Promotes healthy skin'],
                ingredients: ['100% Organic Moringa Oleifera Leaves'],
                how_to_use: 'Mix 1 teaspoon (3g) in water, smoothie, or juice.',
                certifications: ['USDA Organic', 'Non-GMO', 'Vegan'],
                rating: 4.9,
                review_count: 215
            }
        ];

        console.log('Upserting new products...');
        const { data: upsertData, error: upsertError } = await supabase
            .from('products')
            .upsert(newProducts, { onConflict: 'slug' })
            .select();

        if (upsertError) {
            console.error('Error upserting products:', upsertError);
            throw upsertError;
        }

        console.log('Migration successful!', upsertData ? upsertData.length : 0, 'products processed.');

    } catch (error) {
        console.error('Migration FAILED:', error);
        process.exit(1);
    }
}

migrate();
