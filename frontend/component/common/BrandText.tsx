import type { IBrandTextProps } from "./def/BrandText";

function BrandText({ name, className }: IBrandTextProps) {
  const index = name.indexOf(" ");
  const start = index === -1 ? name : name.slice(0, index);
  const end = index === -1 ? "" : name.slice(index + 1);

  return (
    <span className={className}>
      {start} {end && <span className="text-primary">{end}</span>}
    </span>
  );
}

export { BrandText };
