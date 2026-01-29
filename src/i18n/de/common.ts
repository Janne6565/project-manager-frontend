import type enCommon from '../en/common';

type TranslationShape<T> = {
  [K in keyof T]: T[K] extends string ? string : TranslationShape<T[K]>;
};

export default {
  languages: {
    de: 'Deutsch',
    en: 'English',
    title: 'Sprachen',
  },
  tooltips: {
    logo: 'Willkommen zu meinen Projekten :)',
    colorScheme: {
      toggle: 'Farbschema wechseln',
    },
    languageSelector: 'Sprache wechseln',
  },
} satisfies TranslationShape<typeof enCommon>;
