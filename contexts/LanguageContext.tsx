'use client';

import { useLanguage as useNewLanguage } from '@/components/LanguageProvider';

// This is a compatibility shim to prevent build errors in files 
// that still import from the old context path.
// It redirects to the new provider but returns a dummy 't' function 
// to prevent runtime crashes until those files are updated.
export function useLanguage() {
    const { language, setLanguage, dict } = useNewLanguage();

    // Temporary shim for backward compatibility
    // Returns an empty string for any accessed property to prevent crash
    const t: any = new Proxy({}, {
        get: () => new Proxy({}, {
            get: (target, prop) => {
                if (prop === 'toString' || prop === 'valueOf') return () => '';
                return ''; // Return empty string for any key like t.nav.home
            }
        })
    });

    return { language, setLanguage, t };
}

// Re-export LanguageProvider from the new location if used
export { LanguageProvider } from '@/components/LanguageProvider';
