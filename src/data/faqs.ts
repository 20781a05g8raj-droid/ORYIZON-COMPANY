import { FAQ } from '@/types';

export const faqs: FAQ[] = [
    {
        id: '1',
        question: 'What is Moringa and why is it called a superfood?',
        answer: 'Moringa oleifera, also known as the "Miracle Tree" or "Drumstick Tree," is a plant native to India. It\'s called a superfood because it contains over 90 nutrients, including vitamins A, C, E, K, B vitamins, calcium, iron, protein, and essential amino acids. Gram for gram, Moringa has 7x more Vitamin C than oranges, 4x more calcium than milk, 4x more Vitamin A than carrots, and 3x more potassium than bananas.',
        category: 'General',
    },
    {
        id: '2',
        question: 'Is it safe to take Moringa every day?',
        answer: 'Yes, Moringa is generally safe for daily consumption for most adults. Our recommended daily dose is 5-10 grams (1-2 teaspoons) of powder or 2-4 capsules. However, we recommend starting with a smaller dose and gradually increasing to allow your body to adjust. If you have any medical conditions or are taking medications, please consult with your healthcare provider before starting.',
        category: 'Usage',
    },
    {
        id: '3',
        question: 'What is the best time to take Moringa?',
        answer: 'Moringa can be taken at any time of day, but many users find it most beneficial in the morning with breakfast. This helps provide sustained energy throughout the day. Some people prefer splitting the dose - half in the morning and half in the afternoon. Avoid taking it too late in the evening if you find it gives you extra energy.',
        category: 'Usage',
    },
    {
        id: '4',
        question: 'Are there any side effects of Moringa?',
        answer: 'Moringa is well-tolerated by most people. Some may experience mild digestive changes when first starting, which typically subsides as your body adjusts. Pregnant women should avoid Moringa as some compounds may cause uterine contractions. If you experience any adverse effects, discontinue use and consult your doctor.',
        category: 'Safety',
    },
    {
        id: '5',
        question: 'Is your Moringa really organic?',
        answer: 'Yes! Our Moringa is certified organic by both USDA and India Organic certification bodies. We source directly from organic farms in South India where no pesticides, herbicides, or chemical fertilizers are used. Every batch is tested by third-party laboratories for purity and to ensure it\'s free from contaminants.',
        category: 'Quality',
    },
    {
        id: '6',
        question: 'How should I store Moringa powder?',
        answer: 'Store your Moringa powder in a cool, dry place away from direct sunlight. Keep the container tightly sealed to prevent moisture absorption. When stored properly, our Moringa powder maintains its potency for up to 2 years. Refrigeration is not necessary but can help extend freshness in hot climates.',
        category: 'Storage',
    },
    {
        id: '7',
        question: 'Can children take Moringa?',
        answer: 'We recommend our Moringa powder and capsules for adults and children over 12 years of age. For younger children, please consult with a pediatrician. Our Moringa tea is suitable for children over 6 years old in moderate amounts.',
        category: 'Safety',
    },
    {
        id: '8',
        question: 'Is Moringa safe during pregnancy?',
        answer: 'We do not recommend Moringa during pregnancy. Some compounds in Moringa may stimulate uterine contractions. If you are pregnant, planning to become pregnant, or breastfeeding, please consult your healthcare provider before using any Moringa products.',
        category: 'Safety',
    },
    {
        id: '9',
        question: 'How long does it take to see results?',
        answer: 'Results vary from person to person. Many users report feeling more energetic within the first week. For other benefits like improved skin, hair, and overall wellness, consistent use for 4-8 weeks typically shows noticeable improvements. Remember, Moringa is a food supplement, not a medicine, and results depend on your overall lifestyle.',
        category: 'Results',
    },
    {
        id: '10',
        question: 'What\'s the difference between powder and capsules?',
        answer: 'Both contain the same pure, organic Moringa. The powder is more versatile - you can add it to smoothies, juices, food, or take it with water. Capsules are more convenient for people on the go or those who prefer not to taste the powder. Powder allows for flexible dosing, while capsules provide pre-measured amounts.',
        category: 'Products',
    },
    {
        id: '11',
        question: 'Do you ship internationally?',
        answer: 'Currently, we ship within India only. We offer free shipping on orders above ₹499. Standard delivery takes 5-7 business days, and express delivery takes 2-3 business days. We are working on expanding our shipping to other countries soon!',
        category: 'Shipping',
    },
    {
        id: '12',
        question: 'What is your return policy?',
        answer: 'We offer a 7-day satisfaction guarantee. If you\'re not happy with your purchase, you can return unopened products within 7 days for a full refund. For quality issues, we\'ll replace or refund your order immediately. Please contact our support team to initiate a return.',
        category: 'Returns',
    },
];

export const getFAQsByCategory = (category: string): FAQ[] => {
    return faqs.filter(faq => faq.category === category);
};

export const getFAQCategories = (): string[] => {
    return [...new Set(faqs.map(faq => faq.category))];
};

export const getTopFAQs = (count: number = 3): FAQ[] => {
    return faqs.slice(0, count);
};
