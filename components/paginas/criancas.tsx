import { gerarCriancas } from "@/lib/dadosCriancas";
import {
  Competencia,
  COMPETENCIAS,
  gerarResumo,
  numero,
} from "@/lib/dadosSaude";
import { useMemo } from "react";
import { SeletorCompetencia } from "../seletorCompetencia";
import { Tabela } from "../tabela";

export function PaginaCriancas({
  competencia,
  onCompetenciaChange,
}: {
  competencia: Competencia;
  onCompetenciaChange: (c: Competencia) => void;
}) {
  const resumo = useMemo(() => gerarResumo(competencia), [competencia]);
  const criancas = useMemo(() => gerarCriancas(competencia), [competencia]);
  const atendidas = useMemo(
    () => criancas.filter((d) => d.consultas > 0),
    [criancas],
  );
  const rotulo = COMPETENCIAS.find((c) => c.valor === competencia)!.rotulo;
  const cobertura = resumo.cobertura.find(
    (c) => c.id === "criancas",
  )!.percentual;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Crianças</h1>
          <p className="max-w-2xl text-sm text-muted">
            Relatorio de acompanhamento de vacina das crianças. A tabela lista
            os pacientes crianças que realizaram consultas e vacina em {rotulo}{" "}
            — são {numero(atendidas.length)} de {numero(criancas.length)}{" "}
            cadastrados, o que representa uma cobertura de {cobertura}%.
          </p>
        </div>
        <SeletorCompetencia
          valor={competencia}
          onChange={onCompetenciaChange}
        />
      </div>

      <Tabela pacientes={atendidas} tituloExame="Vacinação" />

      <p className="text-xs text-muted">
        Dados de exemplo — serão substituídos pelos registros reais quando a API
        estiver conectada.
      </p>
    </div>
  );
}
