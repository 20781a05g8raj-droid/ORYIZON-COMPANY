
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
    try {
        const { amount, currency = 'INR', receipt, notes } = await request.json();

        if (!amount) {
            return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
        }

        const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;

        if (!key_id || !key_secret) {
            const missing = [
                !key_id ? 'RAZORPAY_KEY_ID' : null,
                !key_secret ? 'RAZORPAY_KEY_SECRET' : null
            ].filter(Boolean).join(', ');
            console.error(`Razorpay credentials missing: ${missing}`);
            return NextResponse.json({ 
                error: `Razorpay keys not configured: ${missing} missing` 
            }, { status: 500 });
        }

        const razorpay = new Razorpay({
            key_id,
            key_secret,
        });

        const options = {
            amount: Math.round(amount * 100), // Razorpay accepts amount in paise
            currency,
            receipt,
            notes,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            ...order,
            key_id,
        });
    } catch (error: any) {
        console.error('Razorpay Order Creation Error:', error);
        const errorMessage = 
            error?.error?.description || 
            error?.description || 
            error?.message || 
            'Payment order creation failed';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
