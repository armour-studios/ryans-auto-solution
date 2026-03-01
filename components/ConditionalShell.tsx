'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import FacebookMessenger from './FacebookMessenger';

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        // Admin has its own full-page layout — render children directly
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
            <FacebookMessenger />
        </>
    );
}
