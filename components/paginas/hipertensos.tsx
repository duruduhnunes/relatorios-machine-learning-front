import { gerarHipertensos } from "@/lib/dadosHipertensos";
import { COMPETENCIAS, Competencia, gerarResumo, numero } from "@/lib/dadosSaude";
import { useMemo } from "react";
import { Tabela } from "../tabela";
import { SeletorCompetencia } from "@/components/seletorCompetencia";

export function PaginaHipertensos({
  competencia,
  onCompetenciaChange,
}: {
  competencia: Competencia;
  onCompetenciaChange: (c: Competencia) => void;
}) {
  const resumo = useMemo(() => gerarResumo(competencia), [competencia]);
  const hipertensos = useMemo(
    () => gerarHipertensos(competencia),
    [competencia],
  );
  const atendidos = useMemo(
    () => hipertensos.filter((d) => d.consultas > 0),
    [hipertensos],
  );
  const cobertura = resumo.cobertura.find(
    (c) => c.id === "hipertensos",
  )!.percentual;
  const rotulo = COMPETENCIAS.find((c) => c.valor === competencia)!.rotulo;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Hipertensos</h1>
          <p className="max-w-2xl text-sm text-muted">
            Relatorio de acompanhamento de pressão arterial. A tabela lista os
            pacientes hipertensos que realizaram consultas em {rotulo} — são{" "}
            {numero(atendidos.length)} de {numero(hipertensos.length)}{" "}
            cadastrados, o que representa uma cobertura de {cobertura}%.
          </p>
        </div>
        <SeletorCompetencia
          valor={competencia}
          onChange={onCompetenciaChange}
        />
      </div>

      <Tabela pacientes={atendidos} tituloExame="Pressão" />

      <p className="text-xs text-muted">
        Dados de exemplo — serão substituídos pelos registros reais quando a API
        estiver conectada.
      </p>
    </div>
  );
}
