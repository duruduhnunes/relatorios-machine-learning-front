"use client";

import { useMemo } from "react";
import { Competencia, gerarResumo } from "@/lib/dadosSaude";
import { SeletorCompetencia } from "@/components/seletorCompetencia";
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col justify-start">
          <h1 className="text-2xl font-semibold">Olá, Gestor!</h1>
          <p className="text-sm text-muted">
            Acompanhe os principais indicadores de saude da sua população.
          </p>
        </div>
        <SeletorCompetencia valor={competencia} onChange={onCompetenciaChange} />
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
