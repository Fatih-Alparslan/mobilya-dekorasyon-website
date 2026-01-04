import type { Metadata } from "next";
import { getLogoSettings } from '@/lib/db';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from 'next/headers';
import { LanguageProvider, Language } from "@/components/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getLogoSettings();

  const baseMetadata = {
    title: "212 Huzur Mobilya",
    description: "Modern ve şık mobilya çözümleri",
  };

  const faviconId = settings?.selected_favicon || 'default';
  let faviconPath = '/favicon.ico';

  if (faviconId !== 'default') {
    faviconPath = `/favicons/${faviconId}.svg`;
  }

  return {
    ...baseMetadata,
    icons: {
      icon: faviconPath,
      shortcut: faviconPath,
      apple: faviconPath,
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('NEXT_LOCALE');
  const initialLanguage: Language = (langCookie?.value === 'en') ? 'en' : 'tr';

  return (
    <html lang={initialLanguage}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <LanguageProvider initialLanguage={initialLanguage}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
