import { Product } from '@/types';

export const products: Product[] = [
    {
        id: 'moringa-powder-100g',
        name: 'Organic Moringa Powder - 100g',
        slug: 'organic-moringa-powder-100g',
        price: 299,
        originalPrice: 499,
        description: `Experience the incredible power of nature with our premium Organic Moringa Powder (100g). Sourced directly from certified organic farms in South India, our Moringa leaves are carefully harvested at peak nutrition and gently dried to preserve maximum potency.

Perfect for trial or individual use, this 100g pack gives you a month's supply of essential nutrients.`,
        shortDescription: '100g Pack - Premium organic Moringa leaf powder for natural energy & immunity.',
        images: [
            '/images/products/product-1.png',
            '/images/products/product-2.png',
        ],
        category: 'Powder',
        variants: [],
        benefits: [
            'Boosts natural energy levels',
            'Strengthens immune system',
            'Rich in protein',
            'Supports digestive health',
        ],
        ingredients: [
            '100% Organic Moringa Oleifera Leaf Powder',
            'No additives, fillers, or preservatives',
            'Non-GMO, Vegan, Gluten-Free',
        ],
        nutritionFacts: [
            { name: 'Protein', value: '27g', dailyValue: '54%' },
            { name: 'Fiber', value: '19g', dailyValue: '76%' },
            { name: 'Vitamin A', value: '18000 IU', dailyValue: '360%' },
            { name: 'Vitamin C', value: '120mg', dailyValue: '200%' },
        ],
        dosage: {
            adults: '5-10g (1-2 teaspoons) daily',
            elders: '3-5g (½-1 teaspoon) daily',
            children: 'Not recommended for children under 12',
            notes: 'Start with a smaller dose and gradually increase.',
        },
        certifications: ['organic', 'fssai', 'iso', 'vegan'],
        rating: 4.8,
        reviewCount: 156,
        inStock: true,
        featured: true,
    },
    {
        id: 'moringa-powder-250g',
        name: 'Organic Moringa Powder - 250g',
        slug: 'organic-moringa-powder-250g',
        price: 999,
        originalPrice: 1199,
        description: `Our best-selling 250g pack of Organic Moringa Powder. Ideal for regular users who want to maintain a consistent healthy lifestyle.

Contains over 90 nutrients, including essential vitamins, minerals, and amino acids.`,
        shortDescription: '250g Pack - Best Value Organic Moringa Leaf Powder.',
        images: [
            '/images/products/product-1.png',
            '/images/products/product-2.png',
        ],
        category: 'Powder',
        variants: [],
        benefits: [
            'Boosts natural energy levels',
            'Great value for daily users',
            'Strengthens immune system',
            'Promotes healthy skin and hair',
        ],
        ingredients: [
            '100% Organic Moringa Oleifera Leaf Powder',
            'No additives, fillers, or preservatives',
            'Non-GMO, Vegan, Gluten-Free',
        ],
        nutritionFacts: [
            { name: 'Protein', value: '27g', dailyValue: '54%' },
            { name: 'Fiber', value: '19g', dailyValue: '76%' },
            { name: 'Vitamin A', value: '18000 IU', dailyValue: '360%' },
            { name: 'Vitamin C', value: '120mg', dailyValue: '200%' },
        ],
        dosage: {
            adults: '5-10g (1-2 teaspoons) daily',
            elders: '3-5g (½-1 teaspoon) daily',
            children: 'Not recommended for children under 12',
            notes: 'Start with a smaller dose and gradually increase.',
        },
        certifications: ['organic', 'fssai', 'iso', 'vegan'],
        rating: 4.9,
        reviewCount: 420,
        inStock: true,
        featured: true,
    },
    {
        id: 'moringa-powder-500g',
        name: 'Organic Moringa Powder - 500g',
        slug: 'organic-moringa-powder-500g',
        price: 1799,
        originalPrice: 2199,
        description: `The 500g Family Pack of our premium Organic Moringa Powder. The most economical choice for families or power users who love their daily moringa boost.

Ensure your entire family gets their daily dose of greens and nutrition with this value pack.`,
        shortDescription: '500g Family Pack - Maximum savings for daily nutrition.',
        images: [
            '/images/products/product-1.png',
            '/images/products/product-2.png',
        ],
        category: 'Powder',
        variants: [],
        benefits: [
            'Maximum savings',
            'Ideal for families',
            'Boosts natural energy levels',
            'Strengthens immune system',
        ],
        ingredients: [
            '100% Organic Moringa Oleifera Leaf Powder',
            'No additives, fillers, or preservatives',
            'Non-GMO, Vegan, Gluten-Free',
        ],
        nutritionFacts: [
            { name: 'Protein', value: '27g', dailyValue: '54%' },
            { name: 'Fiber', value: '19g', dailyValue: '76%' },
            { name: 'Vitamin A', value: '18000 IU', dailyValue: '360%' },
            { name: 'Vitamin C', value: '120mg', dailyValue: '200%' },
        ],
        dosage: {
            adults: '5-10g (1-2 teaspoons) daily',
            elders: '3-5g (½-1 teaspoon) daily',
            children: 'Not recommended for children under 12',
            notes: 'Start with a smaller dose and gradually increase.',
        },
        certifications: ['organic', 'fssai', 'iso', 'vegan'],
        rating: 4.9,
        reviewCount: 215,
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
