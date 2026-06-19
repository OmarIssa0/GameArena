import { TLocale } from "@/types";
import type { THashMap, TTranslate, Callable } from "@/types";
import { useEffect, useState } from "react";

let currentLocale: TLocale = "en";
const listeners = new Set<() => void>();

function setLocale(locale: TLocale): void {
  currentLocale = locale;
  listeners.forEach((l) => l());
}

function getLocale(): TLocale {
  return currentLocale;
}

function subscribeLocale(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function resolve(obj: THashMap, path: string[]) {
  return path.reduce((acc, key) => acc?.[key], obj);
}
function createT<T extends THashMap>(
  langs: TTranslate,
  path: string[] = [],
): any {
  return new Proxy(
    {},
    {
      get(_, key: string | symbol) {
        if (typeof key !== "string") return undefined;
        const newPath = [...path, key];
        const locale = langs[getLocale()] ?? langs.en;
        const value = resolve(locale, newPath);
        // leaf string
        if (typeof value === "string") return value;
        // leaf function
        if (typeof value === "function") return value;
        // nested object
        if (value && typeof value === "object") return createT(langs, newPath);
        console.warn(`[i18n] missing key: "${newPath.join(".")}"`);
        return newPath.join(".");
      },
    },
  );
}
function useTranslation<T extends THashMap>(langs: TTranslate): Callable<T> {
  const [_, setLocaleState] = useState(getLocale());

  useEffect(() => {
    const unsubscribe = subscribeLocale(() => {
      setLocaleState(getLocale());
    });

    return () => unsubscribe();
  }, []);

  return createT<T>(langs);
}

export { setLocale, getLocale, subscribeLocale, createT, useTranslation };
export type { TLocale, THashMap, TTranslate, Callable };
