import { gerarIdosos } from "@/lib/dadosIdoso";
import {
  Competencia,
  COMPETENCIAS,
  gerarResumo,
  numero,
} from "@/lib/dadosSaude";
import { useMemo } from "react";
import { SeletorCompetencia } from "../seletorCompetencia";
import { Tabela } from "../tabela";

export function PaginaIdoso({
  competencia,
  onCompetenciaChange,
}: {
  competencia: Competencia;
  onCompetenciaChange: (c: Competencia) => void;
}) {
  const resumo = useMemo(() => gerarResumo(competencia), [competencia]);
  const idosos = useMemo(() => gerarIdosos(competencia), [competencia]);
  const atendidos = useMemo(
    () => idosos.filter((d) => d.consultas > 0),
    [idosos],
  );
  const rotulo = COMPETENCIAS.find((c) => c.valor === competencia)!.rotulo;
  const cobertura = resumo.cobertura.find((c) => c.id === "idosos")!.percentual;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Idosos</h1>
          <p className="max-w-2xl text-sm text-muted">
            Relatorio de acompanhamento de consulta do idoso. A tabela lista os
            pacientes idosos que realizaram consultas em {rotulo} — são{" "}
            {numero(atendidos.length)} de {numero(idosos.length)} cadastrados, o
            que representa uma cobertura de {cobertura}%.
          </p>
        </div>
        <SeletorCompetencia
          valor={competencia}
          onChange={onCompetenciaChange}
        />
      </div>

      <Tabela pacientes={atendidos} tituloExame="Comorbidades" />

      <p className="text-xs text-muted">
        Dados de exemplo — serão substituídos pelos registros reais quando a API
        estiver conectada.
      </p>
    </div>
  );
}
