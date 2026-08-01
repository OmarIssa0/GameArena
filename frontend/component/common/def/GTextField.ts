import type { InputHTMLAttributes, ReactNode } from "react";
import { SizeEnum } from "@/domain/enum/SizeEnum";

export interface GTextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  size?: SizeEnum;
}
