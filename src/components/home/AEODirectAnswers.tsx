'use client';

import React from 'react';
import { MessageCircleQuestion, ShieldCheck } from 'lucide-react';
import { useScrollReveal, useCardFlyInStagger, useTextTranslateReveal } from '@/hooks/useScrollReveal';

const aeoQuestions = [
    {
        question: 'What is Moringa Powder?',
        answer: 'Moringa powder is made from dried moringa leaves and is rich in essential vitamins, minerals, antioxidants, and plant protein that support immunity and daily wellness.',
        icon: <MessageCircleQuestion size={24} />,
        color: 'from-emerald-500 to-emerald-700',
        bgLight: 'bg-emerald-50',
    },
    {
        question: 'Is Moringa Powder Safe for Daily Use?',
        answer: 'Yes, moringa powder is safe for daily use when consumed in recommended amounts. It is a natural superfood widely used for its health benefits.',
        icon: <ShieldCheck size={24} />,
        color: 'from-amber-500 to-amber-700',
        bgLight: 'bg-amber-50',
    },
];

export function AEODirectAnswers() {
    // GSAP scroll reveal for header
    const headerRef = useTextTranslateReveal<HTMLDivElement>({
        direction: 'left',
        distance: 40,
        duration: 0.8,
    });

    // GSAP stagger reveal for answer cards
    const cardsRef = useCardFlyInStagger<HTMLDivElement>({
        distance: 200,
        stagger: 0.15,
        duration: 0.9,
    });

    return (
        <section className="py-20 md:py-32 bg-gradient-to-br from-[var(--color-cream)] to-white" id="moringa-facts">
            <div className="max-w-[80rem] mx-auto px-6 sm:px-8 lg:px-12">
                {/* Section Header — GSAP scroll reveal */}
                <div ref={headerRef} className="text-center mb-10 md:mb-16">
                    <span className="text-[var(--color-accent)] font-semibold uppercase tracking-widest text-xs md:text-sm">
                        Know Your Superfood
                    </span>
                    <p className="text-[var(--color-text-light)] max-w-2xl mx-auto text-[15px] md:text-lg mt-3 leading-relaxed">
                        Get quick answers to the most searched questions about moringa powder.
                    </p>
                </div>

                {/* AEO Answer Cards — GSAP staggered scroll reveal */}
                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {aeoQuestions.map((item, index) => (
                        <article
                            key={index}
                            className="chamkila-glass bg-white/70 rounded-[2rem] p-8 md:p-12 hover:-translate-y-2 transition-all duration-500"
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-5 md:mb-6 shadow-lg`}>
                                {item.icon}
                            </div>

                            {/* Question as H2 for AEO */}
                            <h2 className="font-heading text-xl md:text-2xl font-bold text-[var(--color-text)] mb-3 md:mb-4 leading-tight">
                                {item.question}
                            </h2>

                            {/* Direct answer paragraph */}
                            <p className="text-[var(--color-text-light)] text-[15px] md:text-lg leading-relaxed">
                                {item.answer}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
