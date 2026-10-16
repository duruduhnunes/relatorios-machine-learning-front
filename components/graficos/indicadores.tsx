"use client";

import { ArrowDownRight, ArrowUpRight, Baby, Droplet, HeartPulse, PersonStanding, Venus } from "lucide-react";
import { GrupoId, Indicador, numero } from "@/lib/dadosSaude";

const ICONES: Record<GrupoId, typeof Venus> = {
  gestantes: Venus,
  diabeticos: Droplet,
  hipertensos: HeartPulse,
  criancas: Baby,
  idosos: PersonStanding,
};

export function Indicadores({ dados }: { dados: Indicador[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {dados.map((d) => {
        const Icone = ICONES[d.id];
        const diferenca = d.total - d.anterior;
        const subiu = diferenca >= 0;
        const Seta = subiu ? ArrowUpRight : ArrowDownRight;
        return (
          <div key={d.id} className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Icone className="size-4 text-primary" />
              {d.nome}
            </div>
            <div className="text-3xl font-semibold text-foreground tabular-nums">{numero(d.total)}</div>
            <div className="text-xs text-muted">pessoas acompanhadas</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted">
              <Seta className="size-3.5" style={{ color: subiu ? "var(--sobe-bom)" : "var(--desce-ruim)" }} />
              {diferenca === 0
                ? "igual ao mês passado"
                : `${numero(Math.abs(diferenca))} ${subiu ? "a mais" : "a menos"} que no mês passado`}
            </div>
          </div>
        );
      })}
    </div>
  );
}
