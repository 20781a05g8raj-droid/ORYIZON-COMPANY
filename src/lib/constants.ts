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
        image: '/Natural Energy.png',
        color: '#FFD700',
        theme: {
            bg: 'bg-gradient-to-br from-amber-50/80 to-amber-100/50 border border-amber-200 shadow-lg shadow-amber-500/5',
            icon: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white',
            text: 'text-amber-950',
        }
    },
    {
        id: 'immunity',
        title: 'Immune Support',
        description: 'Rich in antioxidants and vitamins to strengthen immunity',
        icon: '🛡️',
        image: '/Immune Support.png',
        color: '#4A7C23',
        theme: {
            bg: 'bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 border border-emerald-200 shadow-lg shadow-emerald-500/5',
            icon: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white',
            text: 'text-emerald-950',
        }
    },
    {
        id: 'detox',
        title: 'Natural Detox',
        description: 'Helps cleanse and detoxify your body naturally',
        icon: '🧹',
        image: '/Natural Detox.png',
        color: '#00CED1',
        theme: {
            bg: 'bg-gradient-to-br from-cyan-50/80 to-cyan-100/50 border border-cyan-200 shadow-lg shadow-cyan-500/5',
            icon: 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white',
            text: 'text-cyan-950',
        }
    },
    {
        id: 'nutrition',
        title: 'Complete Nutrition',
        description: '90+ nutrients, vitamins, and essential amino acids',
        icon: '🌿',
        image: '/Complete Nutrition.png',
        color: '#32CD32',
        theme: {
            bg: 'bg-gradient-to-br from-green-50/80 to-green-100/50 border border-green-200 shadow-lg shadow-green-500/5',
            icon: 'bg-gradient-to-br from-green-400 to-emerald-600 text-white',
            text: 'text-green-950',
        }
    },
    {
        id: 'skin',
        title: 'Skin & Hair',
        description: 'Promotes healthy skin and strong hair growth',
        icon: '✨',
        image: '/Skin & Hair.png',
        color: '#FF69B4',
        theme: {
            bg: 'bg-gradient-to-br from-rose-50/80 to-rose-100/50 border border-rose-200 shadow-lg shadow-rose-500/5',
            icon: 'bg-gradient-to-br from-rose-400 to-pink-500 text-white',
            text: 'text-rose-950',
        }
    },
    {
        id: 'digestion',
        title: 'Digestive Health',
        description: 'Supports healthy digestion and gut health',
        icon: '💪',
        image: '/Digestive Health.png',
        color: '#FFA500',
        theme: {
            bg: 'bg-gradient-to-br from-orange-50/80 to-orange-100/50 border border-orange-200 shadow-lg shadow-orange-500/5',
            icon: 'bg-gradient-to-br from-orange-400 to-red-500 text-white',
            text: 'text-orange-950',
        }
    },
];

// How to Use Steps
export const HOW_TO_USE = [
    {
        id: 'mix',
        title: 'Mix in Water',
        description: 'Add 1 teaspoon to warm water or juice',
        icon: '🥤',
        image: '/Mix in Water.png',
        theme: {
            bg: 'bg-gradient-to-br from-blue-50/80 to-blue-100/50 border border-blue-200 shadow-lg shadow-blue-500/5',
            icon: 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white',
            text: 'text-blue-950',
        }
    },
    {
        id: 'smoothie',
        title: 'Blend in Smoothie',
        description: 'Perfect addition to your morning smoothie',
        icon: '🍹',
        image: '/Blend in Smoothie.png',
        theme: {
            bg: 'bg-gradient-to-br from-fuchsia-50/80 to-fuchsia-100/50 border border-fuchsia-200 shadow-lg shadow-fuchsia-500/5',
            icon: 'bg-gradient-to-br from-fuchsia-400 to-purple-500 text-white',
            text: 'text-fuchsia-950',
        }
    },
    {
        id: 'food',
        title: 'Add to Food',
        description: 'Sprinkle over salads, soups, or curries',
        icon: '🥗',
        image: '/Add to Food.png',
        theme: {
            bg: 'bg-gradient-to-br from-lime-50/80 to-lime-100/50 border border-lime-200 shadow-lg shadow-lime-500/5',
            icon: 'bg-gradient-to-br from-lime-400 to-green-500 text-white',
            text: 'text-lime-950',
        }
    },
    {
        id: 'capsule',
        title: 'Or Take Capsules',
        description: 'Easy-to-swallow capsules available',
        icon: '💊',
        theme: {
            bg: 'bg-gradient-to-br from-teal-50/80 to-teal-100/50 border border-teal-200 shadow-lg shadow-teal-500/5',
            icon: 'bg-gradient-to-br from-teal-400 to-emerald-500 text-white',
            text: 'text-teal-950',
        }
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
    'Razorpay (Cards, UPI, Netbanking)',
    'Cash on Delivery',
];
