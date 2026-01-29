import type enCommon from '../i18n/en/common';

declare module 'react-i18next' {
    interface CustomTypeOptions {
        resources: {
            translation: typeof enCommon;  // Use 'translation' or match your NS
        };
        defaultNS: 'common';
    }
}
