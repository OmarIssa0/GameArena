import type { InputHTMLAttributes, ReactNode } from "react";
import type { GSize } from "../tokens";

export interface GTextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  size?: GSize;
}
