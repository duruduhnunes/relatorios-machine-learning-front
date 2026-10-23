"use client";

import { useMemo } from "react";
import { COMPETENCIAS, Competencia, GrupoId, gerarResumo } from "@/lib/dadosSaude";
import { SeletorCompetencia } from "@/components/seletorCompetencia";
import { ResumoDoMes } from "@/components/resumoDoMes";
import { Indicadores } from "@/components/graficos/indicadores";
import { GraficoAtendimentos } from "@/components/graficos/atendimentos";
import { GraficoCobertura } from "@/components/graficos/cobertura";
import { GraficoRisco } from "@/components/graficos/risco";

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export function HomePage({
  competencia,
  onCompetenciaChange,
  onAbrirGrupo,
}: {
  competencia: Competencia;
  onCompetenciaChange: (c: Competencia) => void;
  onAbrirGrupo: (id: GrupoId) => void;
}) {
  const resumo = useMemo(() => gerarResumo(competencia), [competencia]);
  const rotulo = COMPETENCIAS.find((c) => c.valor === competencia)!.rotulo;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-2">
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl bg-primary-suave px-6 py-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground" suppressHydrationWarning>{saudacao()}, Gestor!</h1>
          <p className="text-muted">
            Este é o resumo da saúde do seu município em <strong className="text-foreground">{rotulo}</strong>.
          </p>
        </div>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Escolha o mês
          <SeletorCompetencia valor={competencia} onChange={onCompetenciaChange} />
        </label>
      </div>

      <ResumoDoMes resumo={resumo} onAbrirGrupo={onAbrirGrupo} />

      <Secao titulo="Pessoas acompanhadas" ajuda="Clique em um grupo para ver a lista de pessoas.">
        <Indicadores dados={resumo.indicadores} onAbrirGrupo={onAbrirGrupo} />
      </Secao>

      <Secao titulo="Como estão os atendimentos" ajuda="Prefere ver os números? Clique em “Ver em tabela” em cada quadro.">
        <GraficoAtendimentos dados={resumo.atendimentos} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GraficoCobertura dados={resumo.cobertura} meta={resumo.meta} />
          <GraficoRisco dados={resumo.risco} indicadores={resumo.indicadores} />
        </div>
      </Secao>

      <p className="text-xs text-muted">
        Números de exemplo. Os dados reais entram quando o sistema estiver conectado.
      </p>
    </div>
  );
}

function Secao({ titulo, ajuda, children }: { titulo: string; ajuda: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{titulo}</h2>
        <p className="text-sm text-muted">{ajuda}</p>
      </div>
      {children}
    </section>
  );
}
