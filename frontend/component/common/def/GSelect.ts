import type { SelectHTMLAttributes, ReactNode } from "react";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

interface GSelectOption<TValue extends string | number = string> {
  value: TValue;
  label: string;
}

export interface GSelectProps<TValue extends string | number = string>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "size"> {
  label?: string;
  error?: string;
  startIcon?: ReactNode;
  options: GSelectOption<TValue>[];
  placeholder?: string;
  size?: SizeEnum;
}