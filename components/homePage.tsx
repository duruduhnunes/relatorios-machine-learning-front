"use client";

import { Calendar, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { COMPETENCIAS, Competencia, gerarResumo } from "@/lib/dadosSaude";
import { Indicadores } from "@/components/graficos/indicadores";
import { GraficoAtendimentos } from "@/components/graficos/atendimentos";
import { GraficoCobertura } from "@/components/graficos/cobertura";
import { GraficoRisco } from "@/components/graficos/risco";

export function HomePage() {
  const [competencia, setCompetencia] = useState<Competencia>("2026-09");
  const resumo = useMemo(() => gerarResumo(competencia), [competencia]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col justify-start">
          <h1 className="text-2xl font-semibold">Olá, Gestor!</h1>
          <p className="text-sm text-muted">
            Acompanhe os principais indicadores de saude da sua população.
          </p>
        </div>
        <div className="relative">
          <Calendar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-primary" />
          <select
            aria-label="Competência"
            value={competencia}
            onChange={(e) => setCompetencia(e.target.value as Competencia)}
            className="cursor-pointer appearance-none rounded-lg border border-border bg-card py-2.5 pr-10 pl-10 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            {COMPETENCIAS.map((c) => (
              <option key={c.valor} value={c.valor} className="bg-card">
                {c.rotulo}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
        </div>
      </div>

      <Indicadores dados={resumo.indicadores} />

      <GraficoAtendimentos dados={resumo.atendimentos} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <GraficoCobertura dados={resumo.cobertura} meta={resumo.meta} />
        <GraficoRisco dados={resumo.risco} />
      </div>

      <p className="text-xs text-muted">
        Dados de exemplo — serão substituídos pelos resultados do modelo quando a API estiver conectada.
      </p>
    </div>
  );
}
