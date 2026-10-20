import { gerarDiabeticos } from "@/lib/dadosDiabeticos";
import {
  Competencia,
  COMPETENCIAS,
  gerarResumo,
  numero,
} from "@/lib/dadosSaude";
import { useMemo } from "react";
import { Tabela } from "../tabela";
import { SeletorCompetencia } from "../seletorCompetencia";

export function PaginaDiabeticos({
  competencia,
  onCompetenciaChange,
}: {
  competencia: Competencia;
  onCompetenciaChange: (c: Competencia) => void;
}) {
  const resumo = useMemo(() => gerarResumo(competencia), [competencia]);
  const diabeticos = useMemo(() => gerarDiabeticos(competencia), [competencia]);
  const atendidos = useMemo(
    () => diabeticos.filter((d) => d.consultas > 0),
    [diabeticos],
  );
  const rotulo = COMPETENCIAS.find((c) => c.valor === competencia)!.rotulo;
  const cobertura = resumo.cobertura.find(
    (c) => c.id === "diabeticos",
  )!.percentual;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Diabéticos</h1>
          <p className="max-w-2xl text-sm text-muted">
            Relatorio de acompanhamento glicosêmico. A tabela lista os pacientes
            diabéticos que realizaram consultas em {rotulo} — são{" "}
            {numero(atendidos.length)} de {numero(diabeticos.length)}{" "}
            cadastrados, o que representa uma cobertura de {cobertura}%.
          </p>
        </div>
        <SeletorCompetencia
          valor={competencia}
          onChange={onCompetenciaChange}
        />
      </div>

      <Tabela pacientes={atendidos} tituloExame="Glicada" />

      <p className="text-xs text-muted">
        Dados de exemplo — serão substituídos pelos registros reais quando a API
        estiver conectada.
      </p>
    </div>
  );
}
