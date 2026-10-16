"use client";

import { useMemo } from "react";
import { COMPETENCIAS, Competencia, gerarResumo, numero } from "@/lib/dadosSaude";
import { gerarGestantes } from "@/lib/dadosGestantes";
import { Tabela } from "@/components/tabela";
import { SeletorCompetencia } from "@/components/seletorCompetencia";

export function PaginaGestantes({
  competencia,
  onCompetenciaChange,
}: {
  competencia: Competencia;
  onCompetenciaChange: (c: Competencia) => void;
}) {
  const resumo = useMemo(() => gerarResumo(competencia), [competencia]);
  const gestantes = useMemo(() => gerarGestantes(competencia), [competencia]);

  const atendidas = useMemo(() => gestantes.filter((g) => g.consultas > 0), [gestantes]);

  const cobertura = resumo.cobertura.find((c) => c.id === "gestantes")!.percentual;
  const rotulo = COMPETENCIAS.find((c) => c.valor === competencia)!.rotulo;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Gestantes</h1>
          <p className="max-w-2xl text-sm text-muted">
            Relatório de acompanhamento pré-natal. A tabela lista as gestantes que
            realizaram consultas em {rotulo} — são {numero(atendidas.length)} de{" "}
            {numero(gestantes.length)} cadastradas, o que representa uma cobertura de{" "}
            {cobertura}%.
          </p>
        </div>
        <SeletorCompetencia valor={competencia} onChange={onCompetenciaChange} />
      </div>

      <Tabela pacientes={atendidas} tituloExame="Semanas" />

      <p className="text-xs text-muted">
        Dados de exemplo — serão substituídos pelos registros reais quando a API
        estiver conectada.
      </p>
    </div>
  );
}
