import type { IApiResponse } from "../meta/IApiResponse";

type TLocale = "en" | "ar";
type TTheme = "light" | "dark";
type TSetLocale = (locale: TLocale) => void;
type TSetTheme = (theme: TTheme) => void;
type THashMap<T = unknown> = Record<string, T>;
type TTranslate = { en: THashMap; ar: THashMap };
type TNullable<T> = T | null;
type TOptional<T> = T | undefined;
type TClass<T> = new (...args: unknown[]) => T;
type TEndpointsMap = THashMap<TEndpoint>;
type TEndpoint = {
  verb: "get" | "post" | "put" | "delete";
  template: string;
};
type TFieldLogin = "email" | "password";
type Validator = (value: string) => string | null;

type TPromise<T> = Promise<IApiResponse<T>>;
type TProxy<T extends TEndpointsMap> = {
  [K in keyof T]: <TResult = unknown, TReq = unknown>(
    payload?: TReq,
  ) => TPromise<TResult>;
};
export type {
  TLocale,
  TTheme,
  TSetLocale,
  TSetTheme,
  THashMap,
  TTranslate,
  TNullable,
  TOptional,
  TClass,
  TEndpointsMap,
  TEndpoint,
  TFieldLogin,
  Validator,
  TPromise,
  TProxy,
};
