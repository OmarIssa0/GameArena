import type { ReactNode } from "react";

export interface IGListPaginationProps {
  /** Enables pagination when provided. Defaults to 10 items per page. */
  pageSize?: number;
  /** Initial page (0-based). */
  defaultPage?: number;
}

export interface IGListProps<T> {
  items: T[];
  children: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  className?: string;
  listClassName?: string;
}
