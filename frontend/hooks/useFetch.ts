"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TNullable } from "@/domain/type/TCommon";

interface UseFetchResult<T> {
  data: TNullable<T>;
  loading: boolean;
  error: TNullable<string>;
  /** Re-fetches data. Note: if the component is unmounted, the result will be discarded. */
  reload: () => void;
}

type Fetcher<T> = ((signal: AbortSignal) => Promise<T>) | (() => Promise<T>);

export function useFetch<T>(
  fetcher: Fetcher<T>,
  deps: ReadonlyArray<unknown> = [],
  fallbackErrorMessage = "",
): UseFetchResult<T> {
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
    // Initial fetch - use timeout to avoid sync setState in effect
    const timer = setTimeout(() => {
      if (mountedRef.current) execute();
    }, 0);
    return () => {
      mountedRef.current = false;
      genRef.current = gen + 1;
      controllerRef.current?.abort();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are intentionally dynamic: refetch on any dependency change
  }, [execute, ...deps]);

  return { data, loading, error, reload: execute };
}
