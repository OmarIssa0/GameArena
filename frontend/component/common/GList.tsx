"use client";

import { useState } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, List } from "lucide-react";

import { GEmpty } from "./GEmpty";
import { GIcon } from "./GIcon";
import { GButton } from "./GButton";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import type { IGListProps, IGListPaginationProps } from "./def/GList";

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
  pageSize = 10,
  defaultPage = 0,
}: IGListProps<T> & IGListPaginationProps) {
  const [page, setPage] = useState(defaultPage);

  const totalPages = Math.ceil(items.length / pageSize);

  const currentPage = Math.min(page, Math.max(0, totalPages - 1));

  const startIndex = currentPage * pageSize;

  const visibleItems = noPagination ? items : items.slice(startIndex, startIndex + pageSize);

  if (items.length === 0) {
    return (
      <GEmpty
        icon={emptyIcon ?? <GIcon icon={List} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
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
            variant={AccentColorEnum.Muted}
            size={SizeEnum.icon}
            onClick={() => setPage((page) => Math.max(0, page - 1))}
            disabled={currentPage === 0}
            aria-label="Previous page">
            <GIcon icon={ChevronLeft} size={SizeEnum.sm} color={AccentColorEnum.Secondary} />
          </GButton>

          {Array.from({ length: totalPages }, (_, index) => (
            <GButton
              key={index}
              variant={currentPage === index ? AccentColorEnum.Primary : AccentColorEnum.Muted}
              disabled={currentPage === index}
              size={SizeEnum.icon}
              onClick={() => setPage(index)}
              aria-current={currentPage === index ? "page" : undefined}>
              {index + 1}
            </GButton>
          ))}

          <GButton
            variant={AccentColorEnum.Muted}
            size={SizeEnum.icon}
            onClick={() => setPage((page) => Math.min(totalPages - 1, page + 1))}
            disabled={currentPage === totalPages - 1}
            aria-label="Next page">
            <GIcon icon={ChevronRight} size={SizeEnum.sm} color={AccentColorEnum.Secondary} />
          </GButton>
        </div>
      )}
    </div>
  );
}

export { GList };
