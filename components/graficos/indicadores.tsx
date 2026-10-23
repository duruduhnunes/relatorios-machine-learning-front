"use client";

import { ArrowDownRight, ArrowRight, ArrowUpRight, Baby, Droplet, HeartPulse, PersonStanding, Venus } from "lucide-react";
import { GrupoId, Indicador, numero } from "@/lib/dadosSaude";

const ICONES: Record<GrupoId, typeof Venus> = {
  gestantes: Venus,
  diabeticos: Droplet,
  hipertensos: HeartPulse,
  criancas: Baby,
  idosos: PersonStanding,
};

export function Indicadores({ dados, onAbrirGrupo }: { dados: Indicador[]; onAbrirGrupo: (id: GrupoId) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {dados.map((d) => {
        const Icone = ICONES[d.id];
        const diferenca = d.total - d.anterior;
        const subiu = diferenca >= 0;
        const Seta = subiu ? ArrowUpRight : ArrowDownRight;
        return (
          <button
            key={d.id}
            type="button"
            onClick={() => onAbrirGrupo(d.id)}
            className="group flex cursor-pointer flex-col gap-1 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:border-primary hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex items-center gap-2 font-medium text-foreground">
              <span className="grid size-9 place-items-center rounded-full bg-primary-suave">
                <Icone className="size-5 text-primary" />
              </span>
              {d.nome}
            </div>
            <div className="mt-2 text-3xl font-semibold text-foreground tabular-nums">{numero(d.total)}</div>
            <div className="text-xs text-muted">pessoas acompanhadas</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted">
              <Seta className="size-3.5" style={{ color: subiu ? "var(--sobe-bom)" : "var(--desce-ruim)" }} />
              {diferenca === 0
                ? "igual ao mês passado"
                : `${numero(Math.abs(diferenca))} ${subiu ? "a mais" : "a menos"} que no mês passado`}
            </div>
            <span className="mt-2 flex items-center gap-1 text-sm font-medium text-primary">
              Ver lista <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </span>
          </button>
        );
      })}
    </div>
  );
}
