"use client";

import { ReactNode } from "react";
import AuthAnimation from "./AuthAnimation";

export default function AuthLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <AuthAnimation title={title} pathAnimation="/game.json" />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
