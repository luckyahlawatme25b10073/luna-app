import type { Metadata, Viewport } from 'next';
import './globals.css';
import QueryProvider from '@/components/providers/query-provider';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Luna 🌙 — Understanding her body with love',
  description: 'A beautiful period tracking app made with love.',
};

export const viewport: Viewport = {
  themeColor: '#F8BBD0',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="relative min-h-screen overflow-x-hidden font-body">
        {/* Animated Aurora Mesh Background */}
        <div className="mesh-bg" />
        <div className="absolute top-[10%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-pink-200/20 blur-[120px] animate-blob pointer-events-none -z-10" />
        <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-purple-200/20 blur-[120px] animate-blob [animation-delay:5s] pointer-events-none -z-10" />
        <div className="absolute top-[50%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-teal-100/15 blur-[100px] animate-blob [animation-delay:10s] pointer-events-none -z-10" />
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}