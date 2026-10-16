"use client";

import { Bot } from "lucide-react";

export function AssistenteFlutuante({
  onAbrir,
  oculto = false,
}: {
  onAbrir?: () => void;
  oculto?: boolean;
}) {
  if (oculto) return null;
  return (
    <button
      type="button"
      onClick={onAbrir}
      aria-label="Abrir assistente virtual"
      className="group fixed right-6 bottom-6 z-50 flex cursor-pointer items-center gap-3 rounded-full border border-primary/40 bg-sidebar/95 py-2 pr-6 pl-2 shadow-[0_0_28px_-6px_var(--primary)] backdrop-blur transition hover:border-primary hover:shadow-[0_0_36px_-4px_var(--primary)] focus:outline-none focus-visible:border-primary max-sm:pr-2"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/15 ring-2 ring-primary/50 shadow-[0_0_20px_-4px_var(--primary)] transition group-hover:bg-primary/25">
        <Bot className="size-7 text-primary" />
      </span>
      <span className="text-left leading-tight max-sm:hidden">
        <span className="block text-sm font-semibold text-foreground">
          Precisa de ajuda?
        </span>
        <span className="block text-xs text-muted">
          Pergunte ao assistente virtual
        </span>
      </span>
    </button>
  );
}
