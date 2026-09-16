"use client";

import { useState } from "react";
import { Cobertura } from "@/lib/dadosSaude";
import { CardGrafico, LinhaTooltip, Tooltip, useLargura } from "./base";

const LINHA = 44;
const BARRA = 20;
const M = { topo: 22, direita: 44, esquerda: 92, base: 4 };

export function GraficoCobertura({ dados, meta }: { dados: Cobertura[]; meta: number }) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const [ativo, setAtivo] = useState<number | null>(null);
  const altura = M.topo + dados.length * LINHA + M.base;
  const larguraPlot = Math.max(0, largura - M.esquerda - M.direita);
  const x = (p: number) => M.esquerda + (p / 100) * larguraPlot;
  const abaixo = dados.filter((d) => d.percentual < meta).length;

  return (
    <CardGrafico
      titulo="Cobertura de acompanhamento"
      subtitulo={`% de pacientes com acompanhamento em dia · ${abaixo} de ${dados.length} grupos abaixo da meta de ${meta}%`}
      tabela={{
        colunas: ["Grupo", "Cobertura", "Situação"],
        linhas: dados.map((d) => [d.nome, `${d.percentual}%`, d.percentual >= meta ? "Na meta" : "Abaixo da meta"]),
      }}
    >
      <div ref={ref} className="relative" style={{ height: altura }}>
        {largura > 0 && (
          <svg width={largura} height={altura} role="img" aria-label="Barras de cobertura por grupo">
            <line x1={M.esquerda} x2={M.esquerda} y1={M.topo - 6} y2={altura - M.base} stroke="var(--eixo)" />
            {dados.map((d, i) => {
              const yc = M.topo + i * LINHA + LINHA / 2;
              const w = x(d.percentual) - M.esquerda;
              const r = 4;
              // Se o número encostaria na linha da meta, ele pula para depois dela
              const xRotulo = M.esquerda + w + 6;
              const cruzaMeta = xRotulo - 4 < x(meta) && xRotulo + 32 > x(meta);
              // Ponta arredondada, lado da base reto
              const caminho = `M${M.esquerda},${yc - BARRA / 2} H${M.esquerda + w - r} Q${M.esquerda + w},${yc - BARRA / 2} ${M.esquerda + w},${yc - BARRA / 2 + r} V${yc + BARRA / 2 - r} Q${M.esquerda + w},${yc + BARRA / 2} ${M.esquerda + w - r},${yc + BARRA / 2} H${M.esquerda} Z`;
              return (
                <g key={d.id}>
                  <text x={M.esquerda - 10} y={yc} dy="0.32em" textAnchor="end" className="fill-foreground text-xs">
                    {d.nome}
                  </text>
                  <path d={caminho} fill="var(--serie-1)" opacity={ativo === null || ativo === i ? 1 : 0.45} />
                  <text x={cruzaMeta ? Math.max(xRotulo, x(meta) + 6) : xRotulo} y={yc} dy="0.32em" className="fill-foreground text-xs font-medium tabular-nums">
                    {d.percentual}%
                  </text>
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
            <g pointerEvents="none">
              <line x1={x(meta)} x2={x(meta)} y1={M.topo - 6} y2={altura - M.base} stroke="var(--foreground)" strokeOpacity={0.7} />
              <text x={x(meta)} y={M.topo - 10} textAnchor="middle" className="fill-muted text-[11px]">
                Meta {meta}%
              </text>
            </g>
          </svg>
        )}
        {ativo !== null && (
          <Tooltip x={x(dados[ativo].percentual)} y={M.topo + ativo * LINHA + LINHA / 2} largura={largura}>
            <div className="mb-1 font-medium text-foreground">{dados[ativo].nome}</div>
            <LinhaTooltip cor="var(--serie-1)" rotulo="Cobertura" valor={`${dados[ativo].percentual}%`} />
            <LinhaTooltip
              rotulo="Diferença p/ meta"
              valor={`${dados[ativo].percentual - meta > 0 ? "+" : ""}${dados[ativo].percentual - meta} p.p.`}
            />
          </Tooltip>
        )}
      </div>
    </CardGrafico>
  );
}
