import { BlogPost } from '@/types';

export const blogPosts: BlogPost[] = [
    {
        id: 'blog-1',
        title: '10 Amazing Health Benefits of Moringa Powder',
        slug: 'health-benefits-moringa-powder',
        excerpt: 'Discover the incredible health benefits of Moringa, from boosting immunity to improving energy levels. Learn why this superfood is taking the world by storm.',
        content: `
<h2 class="font-heading text-2xl font-semibold mb-4">What is Moringa Powder?</h2>
<p class="mb-6">Moringa oleifera, widely known as the "Miracle Tree," is native to the Indian subcontinent and has been a cornerstone of Ayurvedic medicine for thousands of years. But what makes it so special?</p>
<p class="mb-6">It's a nutritional powerhouse. When comparing <strong>Moringa powder vs. other superfoods</strong>, the numbers are staggering: it contains <strong>7x more Vitamin C than oranges</strong> and <strong>15x more Potassium than bananas</strong>.</p>

<div class="bg-[var(--color-cream)] p-6 rounded-xl my-8 border border-[var(--color-secondary)]/30">
    <h3 class="font-heading text-xl font-semibold mb-4 text-[var(--color-primary-dark)]">AEO Quick Answer: What happens if I take Moringa everyday?</h3>
    <p class="mb-0">Taking organic Moringa powder daily can significantly boost your energy levels, improve digestion, and strengthen immunity. Its high antioxidant content fights inflammation, while its rich nutrient profile supports healthy skin, hair, and blood sugar levels.</p>
</div>

<h2 class="font-heading text-2xl font-semibold mb-6">Top 10 Health Benefits</h2>

<div class="space-y-8">
    <div>
        <h3 class="font-heading text-xl font-semibold mb-2 text-[var(--color-primary)]">1. Nutrients Powerhouse</h3>
        <p>Moringa is packed with essential vitamins and minerals. It is an excellent source of protein, Vitamin A, Vitamin B6, Vitamin C, Iron, and Magnesium. It’s essentially a natural multivitamin.</p>
    </div>

    <div>
        <h3 class="font-heading text-xl font-semibold mb-2 text-[var(--color-primary)]">2. Fights Inflammation</h3>
        <p>Inflammation is the root cause of many chronic diseases. Moringa contains isothiocyanates, which are key anti-inflammatory compounds that help reduce inflammation in the body.</p>
    </div>

    <div>
        <h3 class="font-heading text-xl font-semibold mb-2 text-[var(--color-primary)]">3. Rich in Antioxidants</h3>
        <p>Antioxidants fight free radicals in your body. Moringa is rich in quercetin (which helps lower blood pressure) and chlorogenic acid (which may control blood sugar levels).</p>
    </div>

    <div>
        <h3 class="font-heading text-xl font-semibold mb-2 text-[var(--color-primary)]">4. Lowers Blood Sugar Levels</h3>
        <p>For those managing diabetes or blood sugar spikes, Moringa can be a game-changer. Several studies indicate that Moringa leaf powder can help lower blood sugar levels naturally.</p>
    </div>

    <div>
        <h3 class="font-heading text-xl font-semibold mb-2 text-[var(--color-primary)]">5. Reduces Cholesterol</h3>
        <p>High cholesterol is linked to heart disease. Similar to flaxseeds/oats and almonds, Moringa effectively lowers cholesterol levels, protecting your heart health.</p>
    </div>
    
    <div>
        <h3 class="font-heading text-xl font-semibold mb-2 text-[var(--color-primary)]">6. Protects against Arsenic Toxicity</h3>
        <p>Long-term exposure to arsenic via contaminated food and water is a global concern. Moringa leaves have shown promise in protecting against some effects of arsenic toxicity.</p>
    </div>

    <div>
        <h3 class="font-heading text-xl font-semibold mb-2 text-[var(--color-primary)]">7. Improves Stomach Health</h3>
        <p>Suffering from digestive issues? The high fiber content in Moringa aids digestion, while its antibacterial properties help inhibit the growth of various pathogens.</p>
    </div>

    <div>
        <h3 class="font-heading text-xl font-semibold mb-2 text-[var(--color-primary)]">8. Promotes Bone Health</h3>
        <p>Rich in Calcium and Phosphorus, Moringa powder helps keep bones healthy and strong. Its anti-inflammatory properties also help treat conditions like arthritis.</p>
    </div>

    <div>
        <h3 class="font-heading text-xl font-semibold mb-2 text-[var(--color-primary)]">9. Enhances Mood & Nervous System</h3>
        <p>Moringa is rich with the amino acid tryptophan, which boosts serotonin production. This neurotransmitter is vital for mood stabilization, memory, and combating depression.</p>
    </div>

    <div>
        <h3 class="font-heading text-xl font-semibold mb-2 text-[var(--color-primary)]">10. Radiant Skin & Hair</h3>
        <p>Thanks to its detoxifying effects and high Vitamin A/E content, Moringa promotes collagen production, leading to healthier skin and stronger hair.</p>
    </div>
</div>

<h2 class="font-heading text-2xl font-semibold mb-4 mt-10">Nutrient Comparison Chart</h2>
<div class="overflow-x-auto my-6">
    <table class="w-full text-left border-collapse">
        <thead>
            <tr class="bg-[var(--color-primary)] text-white">
                <th class="p-3 rounded-tl-lg">Nutrient Source</th>
                <th class="p-3 rounded-tr-lg">Moringa Advantage</th>
            </tr>
        </thead>
        <tbody class="bg-white border md:border-none">
            <tr class="border-b">
                <td class="p-3 font-medium">Potassium</td>
                <td class="p-3">15x more than Bananas</td>
            </tr>
            <tr class="border-b bg-gray-50">
                <td class="p-3 font-medium">Iron</td>
                <td class="p-3">25x more than Spinach</td>
            </tr>
            <tr class="border-b">
                <td class="p-3 font-medium">Calcium</td>
                <td class="p-3">17x more than Milk</td>
            </tr>
            <tr class="border-b bg-gray-50">
                <td class="p-3 font-medium">Vitamin C</td>
                <td class="p-3">7x more than Oranges</td>
            </tr>
        </tbody>
    </table>
</div>

<h2 class="font-heading text-2xl font-semibold mb-4 mt-10">How to Use it?</h2>
<p class="mb-6">Start small. Add 1 teaspoon (approx 3-5g) to your morning routine. It has a spinach-like earthy taste.</p>
<ul class="list-disc pl-5 space-y-2 mb-6">
    <li><strong>Smoothies:</strong> Blend with banana, spinach, and apple.</li>
    <li><strong>Tea:</strong> Steeping in hot water with honey and lemon.</li>
    <li><strong>Sprinkle:</strong> Over salads, soups, or avocado toast.</li>
</ul>

<div class="bg-[var(--color-primary)] text-white p-6 sm:p-10 rounded-2xl my-10 relative overflow-hidden group">
    <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all"></div>
    <div class="relative z-10">
        <h3 class="font-heading text-2xl font-semibold mb-3">Ready to Transform Your Health?</h3>
        <p class="mb-6 text-white/90 text-lg">Experience the purest, 100% organic Moringa powder sourced directly from the Himalayas.</p>
        <a href="/products/organic-moringa-powder" class="inline-block bg-white text-[var(--color-primary)] font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            Shop Organic Moringa Powder
        </a>
    </div>
</div>

<h2 class="font-heading text-2xl font-semibold mb-4">Precautions</h2>
<p class="mb-6">While safe for most, consult your doctor if you are pregnant, nursing, or taking medication (especially for blood sugar or blood pressure), as Moringa can interact with certain drugs.</p>

<h2 class="font-heading text-2xl font-semibold mb-4">Conclusion</h2>
<p class="mb-6">Nature often holds the best cures. Moringa isn't just a trend; it's a time-tested superfood. By incorporating this simple green powder into your daily diet, you invest in your long-term vitality. Start your wellness journey with <strong>ORYIZON</strong> today.</p>
        `,
        image: '/images/products/product-4.png',
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
        content: '<p>Moringa is versatile. You can add it to smoothies, use it as a tea, or sprinkle it on salads. <strong>More recipes coming soon!</strong></p>',
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
        content: '<p>Both superfoods have their benefits. Moringa is better for... <strong>Full analysis loading...</strong></p>',
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
        content: '<p>Scientific studies show... <strong>Detailed review arriving shortly.</strong></p>',
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
        content: '<p>For glowing skin... <strong>Beauty secrets revealed soon.</strong></p>',
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
        content: '<p>Immunity is key... <strong>Stay tuned for immunity tips.</strong></p>',
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
