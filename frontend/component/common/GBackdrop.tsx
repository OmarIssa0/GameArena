import type { GBackdropProps } from "./def/GBackdrop";

function GBackdrop({ onClick }: GBackdropProps) {
  return (
    <div
      className="fixed inset-0 z-40 bg-overlay backdrop-blur-[2px]"
      onClick={onClick}
      aria-hidden
    />
  );
}

export { GBackdrop };
