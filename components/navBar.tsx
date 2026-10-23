import Image from "next/image";
import Link from "next/link";
import { Bell, LogOut, Menu, Search, User } from "lucide-react";

export function NavBar({ onToggleMenu }: { onToggleMenu: () => void }) {
  return (
    <div className="flex items-center gap-4 border-b border-border bg-card px-4 py-2">
      <button
        type="button"
        aria-label="Abrir menu"
        onClick={onToggleMenu}
        className="rounded-lg p-2 text-primary hover:bg-primary-suave cursor-pointer"
      >
        <Menu className="size-6" />
      </button>

      <div className="flex items-center gap-3">
        <Image src="/coracao.png" alt="Logo" width={40} height={40} />
        <div className="leading-tight">
          <h1 className="text-xl font-semibold text-foreground">
            Saúde em Dados
          </h1>
          <p className="text-xs text-muted">Gestão e Monitoramento</p>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-xl">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Buscar por município, unidade ou categoria..."
          className="w-full rounded-lg border border-border bg-background py-2 pr-4 pl-10 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
        />
      </div>

      <button
        type="button"
        aria-label="Notificações"
        className="rounded-lg p-2 text-muted hover:bg-primary-suave hover:text-foreground"
      >
        <Bell className="size-5" />
      </button>

      <div className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-full bg-primary-suave text-primary">
          <User className="size-5" />
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-sm text-foreground">
            Gestor Municipal
          </span>
          <span className="block text-xs text-muted">Secretaria de Saúde</span>
        </span>
      </div>

      <Link
        href="/login"
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-primary-suave hover:text-foreground"
      >
        <LogOut className="size-4" />
        <span className="hidden sm:inline">Sair</span>
      </Link>
    </div>
  );
}
