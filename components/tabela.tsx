"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { NivelRisco, Paciente, formatarData } from "@/lib/pacientes";

const POR_PAGINA = 12;

const CORES_RISCO: Record<NivelRisco, string> = {
  Baixo: "var(--risco-baixo)",
  Moderado: "var(--risco-moderado)",
  Alto: "var(--risco-alto)",
};

export function Tabela({
  pacientes,
  tituloExame,
}: {
  pacientes: Paciente[];
  tituloExame: string;
}) {
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.max(1, Math.ceil(pacientes.length / POR_PAGINA));

  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * POR_PAGINA;
  const visiveis = pacientes.slice(inicio, inicio + POR_PAGINA);

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm whitespace-nowrap tabular-nums">
          <thead>
            <tr className="border-b border-border bg-card text-left text-xs font-medium text-muted">
              <th className="px-3 py-2.5">Código</th>
              <th className="px-3 py-2.5">Paciente</th>
              <th className="px-3 py-2.5 text-right">Idade</th>
              <th className="px-3 py-2.5">Unidade de saúde</th>
              <th className="px-3 py-2.5 text-right">{tituloExame}</th>
              <th className="px-3 py-2.5 text-right">Consultas</th>
              <th className="px-3 py-2.5 text-right">Última consulta</th>
              <th className="px-3 py-2.5">Risco</th>
            </tr>
          </thead>
          <tbody>
            {visiveis.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border/60 last:border-0 hover:bg-card/60"
              >
                <td className="px-3 py-2.5">{p.id}</td>
                <td className="px-3 py-2.5">{p.nome}</td>
                <td className="px-3 py-2.5 text-right">{p.idade}</td>
                <td className="px-3 py-2.5">{p.unidade}</td>
                <td className="px-3 py-2.5 text-right">{p.exame}</td>
                <td className="px-3 py-2.5 text-right">{p.consultas}</td>
                <td className="px-3 py-2.5 text-right">{formatarData(p.ultimaConsulta)}</td>
                <td className="flex items-center gap-1.5 px-3 py-2.5">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: CORES_RISCO[p.risco] }}
                  />
                  {p.risco}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          Mostrando {inicio + 1}–{Math.min(inicio + POR_PAGINA, pacientes.length)} de{" "}
          {pacientes.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            aria-label="Página anterior"
            className="cursor-pointer rounded-md border border-border p-1.5 hover:bg-card hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-foreground">
            {paginaAtual} / {totalPaginas}
          </span>
          <button
            type="button"
            onClick={() => setPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            aria-label="Próxima página"
            className="cursor-pointer rounded-md border border-border p-1.5 hover:bg-card hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
