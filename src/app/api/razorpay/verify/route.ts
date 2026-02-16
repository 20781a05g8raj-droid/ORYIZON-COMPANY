
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", 'i81B9xSVzb4F79OjohnoYygj') // TEMPORARY: Hardcoded for Vercel testing
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            return NextResponse.json({ success: true, message: "Payment verified" });
        } else {
            return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Razorpay Signature Verification Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
