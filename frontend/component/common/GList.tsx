"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, List } from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";

import { GEmpty } from "./GEmpty";
import { GIcon } from "./GIcon";
import { GButton } from "./GButton";

interface GListProps<T> {
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

function GList<T>({
  items,
  children,
  keyExtractor,
  noPagination = false,
  emptyMessage = "",
  emptyDescription = "",
  emptyIcon,
  className,
  listClassName,
}: GListProps<T>) {
  // getgetPreferences api
  const { user } = useAuth();
  const [page, setPage] = useState(0);

  const pageSize = JSON.parse(user?.preferences ?? "{}").pageSize;

  const totalPages = Math.ceil(items.length / pageSize);

  const currentPage = Math.min(page, Math.max(0, totalPages - 1));

  const startIndex = currentPage * pageSize;

  const visibleItems = noPagination ? items : items.slice(startIndex, startIndex + pageSize);

  if (items.length === 0) {
    return (
      <GEmpty
        icon={emptyIcon ?? <GIcon icon={List} size="xl" color="muted" />}
        title={emptyMessage ?? "No items"}
        description={emptyDescription ?? ""}
      />
    );
  }

  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      <div className={clsx("grid gap-4", listClassName)}>
        {visibleItems.map((item, index) => {
          const itemIndex = noPagination ? index : startIndex + index;

          return <div key={keyExtractor(item, itemIndex)}>{children(item, itemIndex)}</div>;
        })}
      </div>
      {!noPagination && (
        <div className="flex items-center justify-center gap-1 border-t border-border pt-3">
          <GButton
            variant="ghost"
            size="icon"
            onClick={() => setPage((page) => Math.max(0, page - 1))}
            disabled={currentPage === 0}
            aria-label="Previous page">
            <GIcon icon={ChevronLeft} size="sm" color="secondary" />
          </GButton>

          {Array.from({ length: totalPages }, (_, index) => (
            <GButton
              key={index}
              variant={currentPage === index ? "primary" : "ghost"}
              disabled={currentPage === index}
              size="icon"
              onClick={() => setPage(index)}
              aria-current={currentPage === index ? "page" : undefined}>
              {index + 1}
            </GButton>
          ))}

          <GButton
            variant="ghost"
            size="icon"
            onClick={() => setPage((page) => Math.min(totalPages - 1, page + 1))}
            disabled={currentPage === totalPages - 1}
            aria-label="Next page">
            <GIcon icon={ChevronRight} size="sm" color="secondary" />
          </GButton>
        </div>
      )}
    </div>
  );
}

export { GList };
