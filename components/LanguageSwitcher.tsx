'use client';

import { useLanguage } from '@/components/LanguageProvider';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'tr' ? 'en' : 'tr');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-yellow-500 group"
            aria-label="Change language"
        >
            <span className="text-sm font-medium text-gray-300 group-hover:text-yellow-500 transition-colors">
                {language === 'tr' ? 'TR' : 'EN'}
            </span>
            <svg
                className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
            </svg>
        </button>
    );
}
