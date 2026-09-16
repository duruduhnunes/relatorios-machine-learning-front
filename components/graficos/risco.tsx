"use client";

import { useState } from "react";
import { Risco } from "@/lib/dadosSaude";
import { CardGrafico, ItemLegenda, LinhaTooltip, Tooltip, useLargura } from "./base";

const NIVEIS = [
  { chave: "baixo", nome: "Baixo", cor: "var(--risco-baixo)", texto: "#0b1120" },
  { chave: "moderado", nome: "Moderado", cor: "var(--risco-moderado)", texto: "#0b1120" },
  { chave: "alto", nome: "Alto", cor: "var(--risco-alto)", texto: "#ffffff" },
] as const;

const LINHA = 44;
const BARRA = 22;
const VAO = 2;
const M = { topo: 4, direita: 4, esquerda: 92, base: 4 };

export function GraficoRisco({ dados }: { dados: Risco[] }) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const [ativo, setAtivo] = useState<number | null>(null);
  const altura = M.topo + dados.length * LINHA + M.base;
  const larguraPlot = Math.max(0, largura - M.esquerda - M.direita);
  const maisAlto = [...dados].sort((a, b) => b.alto - a.alto)[0];

  return (
    <CardGrafico
      titulo="Classificação de risco pelo modelo"
      subtitulo={`Distribuição dos pacientes por nível de risco · maior risco alto: ${maisAlto.nome} (${maisAlto.alto}%)`}
      legenda={NIVEIS.map((n) => (
        <ItemLegenda key={n.chave} cor={n.cor}>
          Risco {n.nome.toLowerCase()}
        </ItemLegenda>
      ))}
      tabela={{
        colunas: ["Grupo", "Baixo", "Moderado", "Alto"],
        linhas: dados.map((d) => [d.nome, `${d.baixo}%`, `${d.moderado}%`, `${d.alto}%`]),
      }}
    >
      <div ref={ref} className="relative" style={{ height: altura }}>
        {largura > 0 && (
          <svg width={largura} height={altura} role="img" aria-label="Barras empilhadas de risco por grupo">
            {dados.map((d, i) => {
              const yc = M.topo + i * LINHA + LINHA / 2;
              const util = larguraPlot - VAO * (NIVEIS.length - 1);
              let cursor = M.esquerda;
              return (
                <g key={d.id} opacity={ativo === null || ativo === i ? 1 : 0.45}>
                  <text x={M.esquerda - 10} y={yc} dy="0.32em" textAnchor="end" className="fill-foreground text-xs">
                    {d.nome}
                  </text>
                  {NIVEIS.map((n, k) => {
                    const valor = d[n.chave];
                    const w = (valor / 100) * util;
                    const x0 = cursor;
                    cursor += w + VAO;
                    const rotulo = `${valor}%`;
                    const cabe = w >= rotulo.length * 7 + 12;
                    const primeiro = k === 0;
                    const ultimo = k === NIVEIS.length - 1;
                    return (
                      <g key={n.chave}>
                        <rect
                          x={x0}
                          y={yc - BARRA / 2}
                          width={Math.max(0, w)}
                          height={BARRA}
                          rx={primeiro || ultimo ? 4 : 0}
                          fill={n.cor}
                        />
                        {/* Quadra os cantos internos das pontas */}
                        {primeiro && w > 8 && <rect x={x0 + w - 4} y={yc - BARRA / 2} width={4} height={BARRA} fill={n.cor} />}
                        {ultimo && w > 8 && <rect x={x0} y={yc - BARRA / 2} width={4} height={BARRA} fill={n.cor} />}
                        {cabe && (
                          <text x={x0 + w / 2} y={yc} dy="0.32em" textAnchor="middle" fill={n.texto} className="text-[11px] font-medium tabular-nums">
                            {rotulo}
                          </text>
                        )}
                      </g>
                    );
                  })}
                  <rect
                    x={0}
                    y={yc - LINHA / 2}
                    width={largura}
                    height={LINHA}
                    fill="transparent"
                    onPointerEnter={() => setAtivo(i)}
                    onPointerLeave={() => setAtivo(null)}
                  />
                </g>
              );
            })}
          </svg>
        )}
        {ativo !== null && (
          <Tooltip x={M.esquerda + larguraPlot / 2} y={M.topo + ativo * LINHA + LINHA / 2} largura={largura}>
            <div className="mb-1 font-medium text-foreground">{dados[ativo].nome}</div>
            {NIVEIS.map((n) => (
              <LinhaTooltip key={n.chave} cor={n.cor} rotulo={`Risco ${n.nome.toLowerCase()}`} valor={`${dados[ativo][n.chave]}%`} />
            ))}
          </Tooltip>
        )}
      </div>
    </CardGrafico>
  );
}
