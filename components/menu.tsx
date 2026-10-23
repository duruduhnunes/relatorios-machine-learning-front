"use client";

import {
  Baby,
  Download,
  Droplet,
  HeartPulse,
  Home,
  LucideIcon,
  PersonStanding,
  SheetIcon,
  Venus,
} from "lucide-react";
import { GrupoId } from "@/lib/dadosSaude";

export type SecaoId = "resumo" | GrupoId | "relatorios" | "exportar";

type Item = { id: SecaoId; nome: string; icone: LucideIcon };

const GRUPOS_MENU: Item[] = [
  { id: "resumo", nome: "Resumo Geral", icone: Home },
  { id: "gestantes", nome: "Gestantes", icone: Venus },
  { id: "diabeticos", nome: "Diabéticos", icone: Droplet },
  { id: "hipertensos", nome: "Hipertensos", icone: HeartPulse },
  { id: "criancas", nome: "Crianças", icone: Baby },
  { id: "idosos", nome: "Idosos", icone: PersonStanding },
];

const FERRAMENTAS: Item[] = [
  { id: "relatorios", nome: "Relatórios", icone: SheetIcon },
  { id: "exportar", nome: "Exportar Dados", icone: Download },
];

export function Menu({
  secao,
  onSelecionar,
}: {
  secao: SecaoId;
  onSelecionar: (secao: SecaoId) => void;
}) {
  return (
    <nav aria-label="Menu principal" className="flex w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-sidebar p-4">
      <TituloMenu>Grupos</TituloMenu>
      {GRUPOS_MENU.map((item) => (
        <ItemMenu
          key={item.id}
          item={item}
          ativo={secao === item.id}
          onSelecionar={onSelecionar}
        />
      ))}

      <div className="my-2 border-b border-border" />

      <TituloMenu>Ferramentas</TituloMenu>

      {FERRAMENTAS.map((item) => (
        <ItemMenu
          key={item.id}
          item={item}
          ativo={secao === item.id}
          onSelecionar={onSelecionar}
        />
      ))}
    </nav>
  );
}

function TituloMenu({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 mb-2 px-3 text-xs font-semibold tracking-wide text-muted uppercase">{children}</p>;
}

function ItemMenu({
  item,
  ativo,
  onSelecionar,
}: {
  item: Item;
  ativo: boolean;
  onSelecionar: (secao: SecaoId) => void;
}) {
  const Icone = item.icone;
  return (
    <button
      type="button"
      onClick={() => onSelecionar(item.id)}
      aria-current={ativo ? "page" : undefined}
      className={`mb-1 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
        ativo ? "bg-primary text-white shadow-sm" : "text-foreground hover:bg-card"
      }`}
    >
      <Icone className={`size-5 shrink-0 ${ativo ? "text-white" : "text-primary"}`} />
      <span className="font-medium">
        {item.nome}
      </span>
    </button>
  );
}
