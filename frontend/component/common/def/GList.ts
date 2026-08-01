import type { ReactNode } from "react";

export interface IGListPaginationProps {
  pageSize?: number;
  defaultPage?: number;
}

export interface IGListProps<T> {
  items: T[];
  children: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  noPagination?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  className?: string;
  listClassName?: string;
}
