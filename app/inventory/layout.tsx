'use client';

import { useEffect } from 'react';
import ThemeProvider from '@/components/ThemeProvider';

function ThemeReset({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        return () => {
            // Reset to dark when navigating away from inventory
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.removeItem('ras-theme');
        };
    }, []);
    return <>{children}</>;
}

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <ThemeReset>
                {children}
            </ThemeReset>
        </ThemeProvider>
    );
}
