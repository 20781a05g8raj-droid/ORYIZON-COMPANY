import { NavItem, Certification } from '@/types';

// Site Configuration
export const SITE_CONFIG = {
    name: 'ORYIZON',
    tagline: 'Pure. Organic. Powerful.',
    description: 'Premium organic Moringa powder - Nature\'s most powerful superfood for energy, immunity, and overall wellness.',
    url: 'https://oryizon.com',
    email: 'oryizoncompany@gmail.com',
    phone: '+91 8969124404',
    whatsapp: '+918969124404',
    address: 'Raxaul, Singhpur Haraiya, Bihar- 845350 INDIA',
    social: {
        facebook: 'https://facebook.com/oryizon',
        instagram: 'https://instagram.com/oryizon',
        twitter: 'https://twitter.com/oryizon',
        youtube: 'https://youtube.com/oryizon',
    },
};

// Navigation Items
export const NAV_ITEMS: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
];

// Footer Links
export const FOOTER_LINKS = {
    quickLinks: [
        { label: 'Shop All', href: '/products' },
        { label: 'About Us', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
    ],
    support: [
        { label: 'FAQ', href: '/faq' },
        { label: 'Shipping & Returns', href: '/shipping-returns' },
        { label: 'Track Order', href: '/track-order' },
        { label: 'Contact Support', href: '/contact' },
    ],
    legal: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms & Conditions', href: '/terms' },
        { label: 'Disclaimer', href: '/disclaimer' },
        { label: 'Refund Policy', href: '/shipping-returns' },
    ],
};

// Certifications
export const CERTIFICATIONS: Certification[] = [
    {
        id: 'organic',
        name: 'Certified Organic',
        icon: '🌿',
        description: 'USDA & India Organic Certified',
    },
    {
        id: 'fssai',
        name: 'FSSAI Approved',
        icon: '✓',
        description: 'Food Safety Standards Authority of India',
    },
    {
        id: 'iso',
        name: 'ISO 22000',
        icon: '🏆',
        description: 'International Food Safety Management',
    },
    {
        id: 'lab-tested',
        name: 'Lab Tested',
        icon: '🔬',
        description: 'Third-party quality testing',
    },
    {
        id: 'non-gmo',
        name: 'Non-GMO',
        icon: '🌱',
        description: 'No genetically modified organisms',
    },
    {
        id: 'vegan',
        name: '100% Vegan',
        icon: '🥬',
        description: 'Plant-based, cruelty-free',
    },
];

// Benefits
export const KEY_BENEFITS = [
    {
        id: 'energy',
        title: 'Natural Energy',
        description: 'Boost your energy levels naturally without caffeine crashes',
        icon: '⚡',
        color: '#FFD700',
    },
    {
        id: 'immunity',
        title: 'Immune Support',
        description: 'Rich in antioxidants and vitamins to strengthen immunity',
        icon: '🛡️',
        color: '#4A7C23',
    },
    {
        id: 'detox',
        title: 'Natural Detox',
        description: 'Helps cleanse and detoxify your body naturally',
        icon: '🧹',
        color: '#00CED1',
    },
    {
        id: 'nutrition',
        title: 'Complete Nutrition',
        description: '90+ nutrients, vitamins, and essential amino acids',
        icon: '🌿',
        color: '#32CD32',
    },
    {
        id: 'skin',
        title: 'Skin & Hair',
        description: 'Promotes healthy skin and strong hair growth',
        icon: '✨',
        color: '#FF69B4',
    },
    {
        id: 'digestion',
        title: 'Digestive Health',
        description: 'Supports healthy digestion and gut health',
        icon: '💪',
        color: '#FFA500',
    },
];

// How to Use Steps
export const HOW_TO_USE = [
    {
        id: 'mix',
        title: 'Mix in Water',
        description: 'Add 1 teaspoon to warm water or juice',
        icon: '🥤',
    },
    {
        id: 'smoothie',
        title: 'Blend in Smoothie',
        description: 'Perfect addition to your morning smoothie',
        icon: '🍹',
    },
    {
        id: 'food',
        title: 'Add to Food',
        description: 'Sprinkle over salads, soups, or curries',
        icon: '🥗',
    },
    {
        id: 'capsule',
        title: 'Or Take Capsules',
        description: 'Easy-to-swallow capsules available',
        icon: '💊',
    },
];

// Shipping Info
export const SHIPPING_INFO = {
    freeShippingThreshold: 499,
    standardShipping: 50,
    expressShipping: 100,
    deliveryTime: {
        standard: '5-7 business days',
        express: '2-3 business days',
    },
};

// Payment Methods
export const PAYMENT_METHODS = [
    'Credit Card',
    'Debit Card',
    'UPI',
    'Net Banking',
    'Cash on Delivery',
];
