import type { ReactNode } from "react";

interface GListProps<T> {
  items: T[];
  children: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  noPagination?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  className?: string;
}

export type { GListProps };
