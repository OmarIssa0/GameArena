"use client";

import { useCallback, useState } from "react";
import type { TNullable } from "@/domain/type/TCommon";

export function useBusyAction() {
  const [busyId, setBusyId] = useState<TNullable<string>>(null);

  const run = useCallback(async (id: string, action: () => Promise<void>) => {
    setBusyId(id);
    try {
      await action();
    } finally {
      setBusyId(null);
    }
  }, []);

  const isBusy = (id: string) => busyId === id;
  const busyClass = (id: string) => (isBusy(id) ? "animate-spin opacity-50 pointer-events-none" : "");

  return { run, isBusy, busyClass };
}