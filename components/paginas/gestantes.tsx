"use client";

import { useEffect, useState } from "react";
import { COMPETENCIAS, Competencia, numero } from "@/lib/dadosSaude";
import { Paciente, RISCOS } from "@/lib/pacientes";
import { LinhaGestante, obterRelatorio } from "@/hooks/relatorios";
import { Tabela } from "@/components/tabela";
import { SeletorCompetencia } from "@/components/seletorCompetencia";

function paraPaciente(linha: LinhaGestante): Paciente {
  return {
    id: linha.codigo,
    nome: linha.nome,
    idade: linha.idade,
    unidade: linha.unidade_saude,
    exame: `${linha.semanas_gestacao} sem.`,
    consultas: linha.total_consultas,
    ultimaConsulta: linha.ultima_consulta,
    risco: RISCOS[linha.risco] ?? "Baixo",
  };
}

export function PaginaGestantes({
  competencia,
  onCompetenciaChange,
}: {
  competencia: Competencia;
  onCompetenciaChange: (c: Competencia) => void;
}) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const [ano, mes] = competencia.split("-").map(Number);
    let cancelado = false;

    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const resposta = await obterRelatorio("relatorio_gestantes", mes, ano);
        if (!cancelado) setPacientes(resposta.dados.map(paraPaciente));
      } catch (error) {
        if (!cancelado) {
          setErro(error instanceof Error ? error.message : "Erro ao carregar.");
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregar();

    return () => {
      cancelado = true;
    };
  }, [competencia]);

  const rotulo = COMPETENCIAS.find((c) => c.valor === competencia)!.rotulo;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Gestantes</h1>
          <p className="max-w-2xl text-sm text-muted">
            Relatório de acompanhamento pré-natal em {rotulo} —{" "}
            {numero(pacientes.length)} gestantes com consulta no período.
          </p>
        </div>
        <SeletorCompetencia
          valor={competencia}
          onChange={onCompetenciaChange}
        />
      </div>

      {carregando && <p className="text-sm text-muted">Carregando...</p>}

      {erro && (
        <p
          role="alert"
          className="text-sm"
          style={{ color: "var(--risco-alto)" }}
        >
          {erro}
        </p>
      )}

      {!carregando && !erro && (
        <Tabela pacientes={pacientes} tituloExame="Semanas" />
      )}
    </div>
  );
}
