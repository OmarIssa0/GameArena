import type { IGBackdropProps } from "./def/GBackdrop";

function GBackdrop({ onClick }: IGBackdropProps) {
  return <div className="drawer-backdrop" onClick={onClick} />;
}
export { GBackdrop };
