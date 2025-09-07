import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PersonaProvider } from '@/contexts/PersonaContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pathways to Parenthood - AI-Powered Family Planning',
  description: 'Your trusted AI concierge for personalized guidance on your journey to parenthood. HIPAA-compliant, privacy-first platform supporting IVF, adoption, and all family-building paths.',
  keywords: 'fertility, IVF, adoption, family planning, AI concierge, HIPAA compliant, parenthood journey',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PersonaProvider>
          {children}
        </PersonaProvider>
      </body>
    </html>
  );
}