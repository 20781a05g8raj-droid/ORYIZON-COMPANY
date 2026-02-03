import { BlogPost } from '@/types';

export const blogPosts: BlogPost[] = [
    {
        id: 'blog-1',
        title: '10 Amazing Health Benefits of Moringa Powder',
        slug: 'health-benefits-moringa-powder',
        excerpt: 'Discover the incredible health benefits of Moringa, from boosting immunity to improving energy levels. Learn why this superfood is taking the world by storm.',
        content: '',
        image: '/images/blog/blog-1.jpg',
        author: 'Dr. Priya Sharma',
        date: 'January 28, 2026',
        readTime: '5 min read',
        category: 'Health Benefits',
        tags: ['moringa', 'health', 'nutrition', 'superfood'],
        icon: '🌿',
        featured: true,
    },
    {
        id: 'blog-2',
        title: 'How to Include Moringa in Your Daily Diet',
        slug: 'moringa-daily-diet-guide',
        excerpt: 'Simple and delicious ways to add Moringa powder to your everyday meals. From smoothies to soups, discover creative recipes.',
        content: '',
        image: '/images/blog/blog-2.jpg',
        author: 'Chef Rahul Mehta',
        date: 'January 25, 2026',
        readTime: '4 min read',
        category: 'Recipes',
        tags: ['recipes', 'cooking', 'healthy eating'],
        icon: '🥗',
        featured: false,
    },
    {
        id: 'blog-3',
        title: 'Moringa vs. Spirulina: Which Superfood is Better?',
        slug: 'moringa-vs-spirulina-comparison',
        excerpt: 'A comprehensive comparison between two of the most popular superfoods. Find out which one suits your health goals better.',
        content: '',
        image: '/images/blog/blog-3.jpg',
        author: 'Dr. Priya Sharma',
        date: 'January 20, 2026',
        readTime: '6 min read',
        category: 'Comparisons',
        tags: ['comparison', 'spirulina', 'superfoods'],
        icon: '⚖️',
        featured: false,
    },
    {
        id: 'blog-4',
        title: 'The Science Behind Moringa: What Research Says',
        slug: 'moringa-scientific-research',
        excerpt: 'Explore the latest scientific studies on Moringa and its proven health benefits backed by research.',
        content: '',
        image: '/images/blog/blog-4.jpg',
        author: 'Research Team',
        date: 'January 15, 2026',
        readTime: '8 min read',
        category: 'Science',
        tags: ['research', 'science', 'studies'],
        icon: '🔬',
        featured: false,
    },
    {
        id: 'blog-5',
        title: 'Moringa for Skin and Hair: Natural Beauty Secret',
        slug: 'moringa-skin-hair-benefits',
        excerpt: 'Learn how Moringa can transform your skin and hair health naturally. Tips for using Moringa in your beauty routine.',
        content: '',
        image: '/images/blog/blog-5.jpg',
        author: 'Anjali Gupta',
        date: 'January 10, 2026',
        readTime: '5 min read',
        category: 'Beauty',
        tags: ['beauty', 'skin care', 'hair care'],
        icon: '✨',
        featured: false,
    },
    {
        id: 'blog-6',
        title: 'Boost Your Immunity with Moringa This Season',
        slug: 'moringa-immunity-boost',
        excerpt: 'Strengthen your immune system naturally with the power of Moringa. Perfect tips for staying healthy year-round.',
        content: '',
        image: '/images/blog/blog-6.jpg',
        author: 'Dr. Priya Sharma',
        date: 'January 5, 2026',
        readTime: '4 min read',
        category: 'Health Benefits',
        tags: ['immunity', 'health', 'wellness'],
        icon: '🛡️',
        featured: false,
    },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find((post) => post.slug === slug);
}

export function getBlogCategories(): string[] {
    const categories = blogPosts.map((post) => post.category);
    return [...new Set(categories)];
}

export function getBlogsByCategory(category: string): BlogPost[] {
    return blogPosts.filter((post) => post.category === category);
}
