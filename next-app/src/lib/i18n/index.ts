import ko from './ko.json';
import en from './en.json';

export type Language = 'ko' | 'en';

const translations = { ko, en };

type NestedKeyOf<T> = T extends object
  ? { [K in keyof T]: K extends string
      ? T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K
      : never
    }[keyof T]
  : never;

export type TranslationKey = NestedKeyOf<typeof ko>;

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let result: unknown = translations[lang];

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  return typeof result === 'string' ? result : key;
}

export function createT(lang: Language) {
  return (key: string) => getTranslation(lang, key);
}
