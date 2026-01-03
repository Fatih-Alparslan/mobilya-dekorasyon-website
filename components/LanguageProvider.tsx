'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { dictionary } from '@/lib/dictionary';

export type Language = 'tr' | 'en';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    dict: typeof dictionary['tr'];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLanguage }: { children: React.ReactNode, initialLanguage: Language }) {
    const [language, setLanguageState] = useState<Language>(initialLanguage);
    const router = useRouter();

    useEffect(() => {
        setLanguageState(initialLanguage);
    }, [initialLanguage]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        Cookies.set('NEXT_LOCALE', lang, { expires: 365 });
        router.refresh();
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, dict: dictionary[language] || dictionary.tr }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
