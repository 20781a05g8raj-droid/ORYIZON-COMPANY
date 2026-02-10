import { Product } from '@/types';

export const products: Product[] = [
    {
        id: 'moringa-powder-100g',
        name: 'Organic Moringa Powder',
        slug: 'organic-moringa-powder',
        price: 299,
        originalPrice: 499,
        description: `Experience the incredible power of nature with our premium Organic Moringa Powder. Sourced directly from certified organic farms in South India, our Moringa leaves are carefully harvested at peak nutrition and gently dried to preserve maximum potency.

Known as the "Miracle Tree," Moringa oleifera has been used for centuries in traditional Ayurvedic medicine. Our powder contains over 90 nutrients, including essential vitamins, minerals, and amino acids that your body needs for optimal health.

Each batch is third-party tested for purity and potency, ensuring you receive only the highest quality superfood. Add it to your smoothies, juices, or meals for a natural boost of energy and nutrition.`,
        shortDescription: 'Premium organic Moringa leaf powder for natural energy, immunity, and complete nutrition.',
        images: [
            '/images/products/product-1.png',
            '/images/products/product-2.png',
            '/images/products/product-3.jpeg',
            '/images/products/product-4.png',
            '/images/products/product-5.png',
            '/images/products/product-6.png',
            '/images/products/product-7.png',
        ],
        category: 'Powder',
        variants: [
            { id: 'v-100g', name: '100g Pack', weight: '100g', price: 299, originalPrice: 499, inStock: true },
            { id: 'v-250g', name: '250g Pack', weight: '250g', price: 999, originalPrice: 1199, inStock: true },
            { id: 'v-500g', name: '500g Pack', weight: '500g', price: 1799, originalPrice: 2199, inStock: true },
        ],
        benefits: [
            'Boosts natural energy levels without caffeine',
            'Strengthens immune system with powerful antioxidants',
            'Rich in protein for muscle recovery',
            'Supports healthy blood sugar levels',
            'Promotes healthy skin and hair',
            'Aids in natural detoxification',
            'Supports digestive health',
            'Provides anti-inflammatory benefits',
        ],
        ingredients: [
            '100% Organic Moringa Oleifera Leaf Powder',
            'No additives, fillers, or preservatives',
            'Non-GMO, Vegan, Gluten-Free',
        ],
        nutritionFacts: [
            { name: 'Protein', value: '27g', dailyValue: '54%' },
            { name: 'Fiber', value: '19g', dailyValue: '76%' },
            { name: 'Calcium', value: '2000mg', dailyValue: '200%' },
            { name: 'Iron', value: '28mg', dailyValue: '156%' },
            { name: 'Vitamin A', value: '18000 IU', dailyValue: '360%' },
            { name: 'Vitamin C', value: '120mg', dailyValue: '200%' },
            { name: 'Potassium', value: '1300mg', dailyValue: '37%' },
            { name: 'Magnesium', value: '368mg', dailyValue: '92%' },
        ],
        dosage: {
            adults: '5-10g (1-2 teaspoons) daily',
            elders: '3-5g (½-1 teaspoon) daily',
            children: 'Not recommended for children under 12',
            notes: 'Start with a smaller dose and gradually increase. Best taken in the morning with breakfast.',
        },
        certifications: ['organic', 'fssai', 'iso', 'lab-tested', 'non-gmo', 'vegan'],
        rating: 4.8,
        reviewCount: 1247,
        inStock: true,
        featured: true,
    },
    {
        id: 'moringa-capsules',
        name: 'Moringa Capsules',
        slug: 'moringa-capsules',
        price: 699,
        originalPrice: 849,
        description: `For those who prefer the convenience of capsules, our Organic Moringa Capsules deliver the same powerful benefits in an easy-to-swallow form. Each capsule contains 500mg of pure, organic Moringa leaf powder.

Perfect for busy lifestyles, travel, or those who prefer not to taste the powder. Simply take with water for a quick and effective nutritional boost.`,
        shortDescription: 'Convenient capsule form of pure organic Moringa for on-the-go nutrition.',
        images: [
            '/images/products/product-4.png',
            '/images/products/product-5.png',
        ],
        category: 'Capsules',
        variants: [
            { id: 'c-60', name: '60 Capsules', weight: '60 caps', price: 699, originalPrice: 849, inStock: true },
            { id: 'c-120', name: '120 Capsules', weight: '120 caps', price: 1299, originalPrice: 1599, inStock: true },
        ],
        benefits: [
            'Convenient and travel-friendly',
            'Pre-measured dosage',
            'No taste or preparation required',
            'Same benefits as powder form',
        ],
        ingredients: [
            'Organic Moringa Oleifera Leaf Powder (500mg per capsule)',
            'Vegetable cellulose capsule',
            'No fillers or additives',
        ],
        nutritionFacts: [
            { name: 'Moringa Powder', value: '500mg', dailyValue: '-' },
            { name: 'Protein', value: '135mg', dailyValue: '-' },
            { name: 'Iron', value: '1.4mg', dailyValue: '8%' },
        ],
        dosage: {
            adults: '2-4 capsules daily with water',
            elders: '1-2 capsules daily',
            children: 'Not recommended',
            notes: 'Take with meals for best absorption.',
        },
        certifications: ['organic', 'fssai', 'vegan'],
        rating: 4.7,
        reviewCount: 532,
        inStock: true,
        featured: false,
    },
    {
        id: 'moringa-tea',
        name: 'Moringa Herbal Tea',
        slug: 'moringa-herbal-tea',
        price: 399,
        originalPrice: 499,
        description: `Relax and rejuvenate with our premium Moringa Herbal Tea. Made from carefully selected organic Moringa leaves, this caffeine-free tea offers a smooth, earthy flavor with subtle notes of green tea and herbs.

Enjoy hot or iced, any time of day. Each tea bag is individually wrapped to preserve freshness and flavor.`,
        shortDescription: 'Caffeine-free herbal tea made from organic Moringa leaves.',
        images: [
            '/images/products/product-6.png',
            '/images/products/product-7.png',
        ],
        category: 'Tea',
        variants: [
            { id: 't-25', name: '25 Tea Bags', weight: '25 bags', price: 399, originalPrice: 499, inStock: true },
            { id: 't-50', name: '50 Tea Bags', weight: '50 bags', price: 749, originalPrice: 899, inStock: true },
        ],
        benefits: [
            'Caffeine-free for any time of day',
            'Relaxing and soothing',
            'Supports digestion',
            'Convenient tea bag format',
        ],
        ingredients: [
            '100% Organic Moringa Leaves',
            'No artificial flavors or colors',
        ],
        nutritionFacts: [
            { name: 'Calories', value: '0', dailyValue: '-' },
            { name: 'Antioxidants', value: 'High', dailyValue: '-' },
        ],
        dosage: {
            adults: '2-3 cups daily',
            elders: '1-2 cups daily',
            children: 'Suitable for children over 6',
            notes: 'Steep for 3-5 minutes in hot water.',
        },
        certifications: ['organic', 'fssai', 'vegan'],
        rating: 4.6,
        reviewCount: 328,
        inStock: true,
        featured: false,
    },
];

export const getFeaturedProduct = (): Product | undefined => {
    return products.find(p => p.featured);
};

export const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(p => p.slug === slug);
};

export const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
};

export const getAllProducts = (): Product[] => {
    return products;
};
