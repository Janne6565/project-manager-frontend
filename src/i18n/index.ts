import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';  // Optional

import enCommon from './en/common.ts';
import deCommon from './de/common.ts';

i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources: {
            en: { common: enCommon },
            de: { common: deCommon }
        },
        lng: 'en',  // Default language
        fallbackLng: 'en',
        ns: ['common'],  // Default namespace
        defaultNS: 'common',
        interpolation: {
            escapeValue: false  // React already escapes
        },
    });

export default i18next;
