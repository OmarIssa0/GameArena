import type { LabelHTMLAttributes, ReactNode } from "react";

interface IGLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: ReactNode;
}

export type { IGLabelProps };
