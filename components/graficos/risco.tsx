"use client";

import { Indicador, Risco, numero, pessoasEmRiscoAlto } from "@/lib/dadosSaude";
import { CardGrafico } from "./base";

export function GraficoRisco({ dados, indicadores }: { dados: Risco[]; indicadores: Indicador[] }) {
  const grupos = pessoasEmRiscoAlto(dados, indicadores);
  const maior = grupos[0]?.pessoas || 1;

  return (
    <CardGrafico
      titulo="Quem precisa de mais atenção"
      subtitulo="Pessoas em risco alto de piorar, segundo a análise do sistema."
      tabela={{
        colunas: ["Grupo", "Pessoas em risco alto", "% do grupo"],
        linhas: grupos.map((g) => [g.nome, numero(g.pessoas), `${g.percentual}%`]),
      }}
    >
      <ul className="flex flex-col gap-4">
        {grupos.map((g) => (
          <li key={g.id} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium text-foreground">{g.nome}</span>
              <span className="text-foreground tabular-nums">
                <strong>{numero(g.pessoas)}</strong> pessoas
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-border">
              <div
                className="h-full rounded-full"
                style={{ width: `${(g.pessoas / maior) * 100}%`, background: "var(--risco-alto)" }}
              />
            </div>
            <span className="text-xs text-muted">{g.percentual}% do grupo</span>
          </li>
        ))}
      </ul>
    </CardGrafico>
  );
}
