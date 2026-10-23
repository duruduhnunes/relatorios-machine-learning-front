"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Cobertura } from "@/lib/dadosSaude";
import { CardGrafico } from "./base";

export function GraficoCobertura({ dados, meta }: { dados: Cobertura[]; meta: number }) {
  return (
    <CardGrafico
      titulo="Pacientes com acompanhamento em dia"
      subtitulo={`A meta é ter ${meta}% de cada grupo com as consultas e exames em dia.`}
      tabela={{
        colunas: ["Grupo", "Em dia", "Situação"],
        linhas: dados.map((d) => [d.nome, `${d.percentual}%`, d.percentual >= meta ? "Bateu a meta" : situacao(d.percentual, meta)]),
      }}
    >
      <ul className="flex flex-col gap-4">
        {dados.map((d) => {
          const bateu = d.percentual >= meta;
          const cor = bateu ? "var(--risco-baixo)" : "var(--risco-alto)";
          const Icone = bateu ? CheckCircle2 : AlertCircle;
          return (
            <li key={d.id} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-foreground">{d.nome}</span>
                <span className="text-foreground tabular-nums">
                  <strong>{d.percentual}%</strong> em dia
                </span>
              </div>
              <div className="relative h-2.5 rounded-full bg-border" title={`Meta: ${meta}%`}>
                <div className="h-full rounded-full" style={{ width: `${d.percentual}%`, background: cor }} />
                {/* Marca da meta */}
                <div className="absolute -top-1 -bottom-1 w-0.5 rounded-full bg-foreground/70" style={{ left: `${meta}%` }} />
              </div>
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Icone className="size-3.5" style={{ color: cor }} />
                {bateu ? "Bateu a meta" : situacao(d.percentual, meta)}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="flex items-center gap-1.5 text-xs text-muted">
        <span className="inline-block h-3 w-0.5 rounded-full bg-foreground/70" /> Traço = meta de {meta}%
      </p>
    </CardGrafico>
  );
}

function situacao(percentual: number, meta: number) {
  return `Faltam ${meta - percentual}% para a meta`;
}
