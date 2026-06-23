"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ITTextFieldProps } from "./def/TTextField";

export default function TTextField({
  label,
  value,
  type = "text",
  placeholder,
  required = false,
  error,
  onChange,
}: ITTextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;
  const hasError = Boolean(error);

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          value={value}
          type={inputType}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={[
            "w-full rounded-xl border bg-surface px-4 py-2.5 outline-none text-text transition-colors",
            hasError
              ? "border-red-500"
              : focused
                ? "border-primary ring-2 ring-primary/20"
                : "border-border",
            type === "password" ? "pr-12" : "",
          ].join(" ")}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && <pre className="text-xs text-red-500">{error}</pre>}
    </div>
  );
}
