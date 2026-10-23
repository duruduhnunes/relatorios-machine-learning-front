"use client";

import { useMemo } from "react";
import { Competencia, gerarResumo } from "@/lib/dadosSaude";
import { SeletorCompetencia } from "@/components/seletorCompetencia";
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
        <SeletorCompetencia valor={competencia} onChange={onCompetenciaChange} />
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
