"use client";

import { Calendar, ChevronDown } from "lucide-react";
import { useMemo } from "react";
import { COMPETENCIAS, Competencia, gerarResumo } from "@/lib/dadosSaude";
import { ResumoDoMes } from "@/components/resumoDoMes";
import { Indicadores } from "@/components/graficos/indicadores";
import { GraficoAtendimentos } from "@/components/graficos/atendimentos";
import { GraficoCobertura } from "@/components/graficos/cobertura";
import { GraficoRisco } from "@/components/graficos/risco";

export function HomePage({
  competencia,
  onCompetenciaChange,
}: {
  competencia: Competencia;
  onCompetenciaChange: (c: Competencia) => void;
}) {
  const resumo = useMemo(() => gerarResumo(competencia), [competencia]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-2">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col justify-start">
          <h1 className="text-2xl font-semibold">Olá, Gestor!</h1>
          <p className="text-sm text-muted">
            Veja como está a saúde da população do seu município.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          Mês
          <span className="relative">
            <Calendar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-primary" />
            <select
              value={competencia}
              onChange={(e) => onCompetenciaChange(e.target.value as Competencia)}
              className="cursor-pointer appearance-none rounded-lg border border-border bg-card py-2.5 pr-10 pl-10 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              {COMPETENCIAS.map((c) => (
                <option key={c.valor} value={c.valor} className="bg-card">
                  {c.rotulo}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
          </span>
        </label>
      </div>

      <ResumoDoMes resumo={resumo} />

      <Indicadores dados={resumo.indicadores} />

      <GraficoAtendimentos dados={resumo.atendimentos} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GraficoCobertura dados={resumo.cobertura} meta={resumo.meta} />
        <GraficoRisco dados={resumo.risco} indicadores={resumo.indicadores} />
      </div>

      <p className="text-xs text-muted">
        Números de exemplo. Os dados reais entram quando o sistema estiver conectado.
      </p>
    </div>
  );
}
