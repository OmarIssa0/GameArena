"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TNullable } from "@/domain/type/TCommon";

interface UseFetchResult<T> {
  data: TNullable<T>;
  loading: boolean;
  error: TNullable<string>;
  reload: () => void;
}

type Fetcher<T> = ((signal: AbortSignal) => Promise<T>) | (() => Promise<T>);

export function useFetch<T>(fetcher: Fetcher<T>, deps: ReadonlyArray<unknown> = [], fallbackErrorMessage = ""): UseFetchResult<T> {
  const [data, setData] = useState<T>(null as unknown as T);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TNullable<string>>(null);
  const genRef = useRef(0);
  const controllerRef = useRef<TNullable<AbortController>>(null);
  const fetcherRef = useRef(fetcher);
  const mountedRef = useRef(false);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const fallbackErrorRef = useRef(fallbackErrorMessage);
  useEffect(() => {
    fallbackErrorRef.current = fallbackErrorMessage;
  }, [fallbackErrorMessage]);

  const depsKey = deps.join(",");

  const execute = useCallback(() => {
    controllerRef.current?.abort();
    const gen = ++genRef.current;
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);

    fetcherRef
      .current(controller.signal)
      .then((result) => {
        if (gen === genRef.current && mountedRef.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (gen === genRef.current && mountedRef.current && !(err instanceof DOMException && err.name === "AbortError")) {
          setError(fallbackErrorRef.current);
          setLoading(false);
        }
      });
  }, []);
  useEffect(() => {
    const gen = genRef.current;
    mountedRef.current = true;

    const timer = setTimeout(() => {
      if (mountedRef.current) execute();
    }, 0);
    return () => {
      mountedRef.current = false;
      genRef.current = gen + 1;
      controllerRef.current?.abort();
      clearTimeout(timer);
    };
  }, [execute, depsKey]);

  return { data, loading, error, reload: execute };
}
