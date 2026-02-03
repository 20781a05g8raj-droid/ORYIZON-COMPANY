import { Testimonial } from '@/types';

export const testimonials: Testimonial[] = [
    {
        id: '1',
        name: 'Priya Sharma',
        location: 'Delhi',
        rating: 5,
        content: 'I\'ve been using Moringa Pure for 3 months now and the difference in my energy levels is incredible. No more afternoon crashes! The quality is outstanding and I love that it\'s certified organic.',
        productUsed: 'Organic Moringa Powder',
        avatar: '/images/testimonials/avatar-1.jpg',
    },
    {
        id: '2',
        name: 'Rajesh Kumar',
        location: 'Mumbai',
        rating: 5,
        content: 'As a fitness enthusiast, I was looking for a natural supplement. Moringa Pure exceeded my expectations. Great for post-workout recovery and overall health. Highly recommend!',
        productUsed: 'Organic Moringa Powder',
        avatar: '/images/testimonials/avatar-2.jpg',
    },
    {
        id: '3',
        name: 'Anita Desai',
        location: 'Bangalore',
        rating: 5,
        content: 'My whole family uses this now. The capsules are so convenient for my husband\'s busy schedule, and I add the powder to our morning smoothies. We\'ve noticed fewer sick days!',
        productUsed: 'Moringa Capsules',
        avatar: '/images/testimonials/avatar-3.jpg',
    },
    {
        id: '4',
        name: 'Dr. Suresh Patel',
        location: 'Ahmedabad',
        rating: 5,
        content: 'As a physician, I appreciate the transparency in ingredients and the quality certifications. I now recommend Moringa Pure to my patients looking for natural nutrition support.',
        productUsed: 'Organic Moringa Powder',
        avatar: '/images/testimonials/avatar-4.jpg',
    },
    {
        id: '5',
        name: 'Meera Iyer',
        location: 'Chennai',
        rating: 4,
        content: 'The Moringa tea has become my evening ritual. It\'s soothing, tastes great, and I sleep better. Would love to see more tea flavors in the future!',
        productUsed: 'Moringa Herbal Tea',
        avatar: '/images/testimonials/avatar-5.jpg',
    },
    {
        id: '6',
        name: 'Vikram Singh',
        location: 'Jaipur',
        rating: 5,
        content: 'I\'ve tried many Moringa brands before, but Moringa Pure is definitely the best. The color, smell, and taste all indicate high quality. Fast delivery too!',
        productUsed: 'Organic Moringa Powder',
        avatar: '/images/testimonials/avatar-6.jpg',
    },
];

export const getRandomTestimonials = (count: number = 3): Testimonial[] => {
    const shuffled = [...testimonials].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
