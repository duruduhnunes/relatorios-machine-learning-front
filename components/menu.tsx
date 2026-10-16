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
  { id: "diabeticos", nome: "Diabeticos", icone: Droplet },
  { id: "hipertensos", nome: "Hipertensos", icone: HeartPulse },
  { id: "criancas", nome: "Crianças", icone: Baby },
  { id: "idosos", nome: "Idosos", icone: PersonStanding },
];

const FERRAMENTAS: Item[] = [
  { id: "relatorios", nome: "Relatorios", icone: SheetIcon },
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
    <nav aria-label="Menu principal" className="flex w-64 shrink-0 flex-col overflow-y-auto bg-sidebar p-4">
      {GRUPOS_MENU.map((item) => (
        <ItemMenu
          key={item.id}
          item={item}
          ativo={secao === item.id}
          onSelecionar={onSelecionar}
        />
      ))}

      <div className="my-2 border-b border-border" />

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
      className={`mb-2 flex cursor-pointer items-center gap-3 rounded-md p-2 text-left ${
        ativo ? "bg-card" : "hover:bg-card"
      }`}
    >
      <Icone className="size-6 shrink-0 text-primary" />
      <span
        className={`text-lg font-semibold ${ativo ? "text-primary" : "text-foreground"}`}
      >
        {item.nome}
      </span>
    </button>
  );
}
