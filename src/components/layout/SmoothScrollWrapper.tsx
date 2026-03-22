'use client';

import { SmoothScrollProvider } from '@/components/ui/animations/SmoothScrollProvider';

export function SmoothScrollWrapper({ children }: { children: React.ReactNode }) {
    return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
