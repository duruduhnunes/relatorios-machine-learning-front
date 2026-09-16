"use client";

import { useState } from "react";
import { PontoAtendimento, numero } from "@/lib/dadosSaude";
import { CardGrafico, ItemLegenda, LinhaTooltip, Tooltip, useLargura } from "./base";

const ALTURA = 280;
const M = { topo: 16, direita: 64, base: 28, esquerda: 52 };

function ticksLimpos(min: number, max: number, quantos = 4) {
  const passoBruto = (max - min) / quantos;
  const mag = 10 ** Math.floor(Math.log10(passoBruto));
  const passo = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((p) => p >= passoBruto)!;
  const inicio = Math.floor(min / passo) * passo;
  const fim = Math.ceil(max / passo) * passo;
  const ticks = [];
  for (let v = inicio; v <= fim + 1e-9; v += passo) ticks.push(v);
  return ticks;
}

export function GraficoAtendimentos({ dados }: { dados: PontoAtendimento[] }) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const [ativo, setAtivo] = useState<number | null>(null);

  const valores = dados.flatMap((d) => [d.realizado, d.minimo, d.maximo]).filter((v): v is number => v !== null);
  const ticks = ticksLimpos(Math.min(...valores) * 0.97, Math.max(...valores));
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1];

  const larguraPlot = Math.max(0, largura - M.esquerda - M.direita);
  const alturaPlot = ALTURA - M.topo - M.base;
  const x = (i: number) => M.esquerda + (i / (dados.length - 1)) * larguraPlot;
  const y = (v: number) => M.topo + (1 - (v - yMin) / (yMax - yMin)) * alturaPlot;

  const linha = (campo: "realizado" | "previsto") =>
    dados
      .map((d, i) => [i, d[campo]] as const)
      .filter(([, v]) => v !== null)
      .map(([i, v], k) => `${k ? "L" : "M"}${x(i)},${y(v!)}`)
      .join(" ");

  const reais = dados.map((d, i) => [i, d.realizado] as const).filter(([, v]) => v !== null) as [number, number][];
  const areaReal = `${linha("realizado")} L${x(reais[reais.length - 1][0])},${y(yMin)} L${x(reais[0][0])},${y(yMin)} Z`;

  const faixa = dados.map((d, i) => [i, d] as const).filter(([, d]) => d.minimo !== null);
  const areaFaixa =
    faixa.map(([i, d], k) => `${k ? "L" : "M"}${x(i)},${y(d.maximo!)}`).join(" ") +
    " " +
    [...faixa].reverse().map(([i, d]) => `L${x(i)},${y(d.minimo!)}`).join(" ") +
    " Z";

  const ultimoReal = reais[reais.length - 1];
  const ultimoPrev = dados.length - 1;
  const inicioPrevisao = x(ultimoReal[0]);
  const passoRotulo = Math.max(1, Math.ceil(52 / (larguraPlot / (dados.length - 1) || 1)));

  const aoMover = (e: React.PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - r.left) / r.width;
    setAtivo(Math.round(rel * (dados.length - 1)));
  };

  const pontoAtivo = ativo !== null ? dados[ativo] : null;

  return (
    <CardGrafico
      titulo="Atendimentos realizados e previsão do modelo"
      subtitulo="Últimos 12 meses e projeção para os próximos 3"
      legenda={
        <>
          <ItemLegenda cor="var(--serie-1)" forma="linha">Realizado</ItemLegenda>
          <ItemLegenda cor="var(--serie-2)" forma="linha">Previsão (ML)</ItemLegenda>
          <ItemLegenda cor="var(--serie-2)" forma="faixa">Intervalo de confiança</ItemLegenda>
        </>
      }
      tabela={{
        colunas: ["Mês", "Realizado", "Previsto", "Mínimo", "Máximo"],
        linhas: dados.map((d) => [
          d.mes,
          d.realizado !== null ? numero(d.realizado) : "—",
          d.previsto !== null && d.realizado === null ? numero(d.previsto) : "—",
          d.minimo !== null && d.realizado === null ? numero(d.minimo) : "—",
          d.maximo !== null && d.realizado === null ? numero(d.maximo) : "—",
        ]),
      }}
    >
      <div ref={ref} className="relative" style={{ height: ALTURA }}>
        {largura > 0 && (
          <svg width={largura} height={ALTURA} role="img" aria-label="Gráfico de linha de atendimentos mensais com previsão">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={M.esquerda} x2={M.esquerda + larguraPlot} y1={y(t)} y2={y(t)} stroke={t === yMin ? "var(--eixo)" : "var(--grade)"} />
                <text x={M.esquerda - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted text-[11px] tabular-nums">
                  {numero(t)}
                </text>
              </g>
            ))}
            {dados.map((d, i) =>
              // ~52px por rótulo; o último mês sempre aparece
              (i % passoRotulo === 0 && ultimoPrev - i >= passoRotulo) || i === ultimoPrev ? (
                <text key={d.mes} x={x(i)} y={ALTURA - 8} textAnchor="middle" className="fill-muted text-[11px]">
                  {d.mes}
                </text>
              ) : null,
            )}

            {/* Início da previsão */}
            <rect x={inicioPrevisao} y={M.topo} width={M.esquerda + larguraPlot - inicioPrevisao} height={alturaPlot} fill="var(--foreground)" opacity={0.025} />
            <text x={inicioPrevisao + 6} y={M.topo + 10} className="fill-muted text-[11px]">Previsão</text>

            <path d={areaReal} fill="var(--serie-1)" opacity={0.1} />
            <path d={areaFaixa} fill="var(--serie-2)" opacity={0.18} />
            <path d={linha("realizado")} fill="none" stroke="var(--serie-1)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            <path d={linha("previsto")} fill="none" stroke="var(--serie-2)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

            {/* Rótulos só nas pontas */}
            <circle cx={x(ultimoReal[0])} cy={y(ultimoReal[1])} r={4} fill="var(--serie-1)" stroke="var(--card)" strokeWidth={2} />
            <circle cx={x(ultimoPrev)} cy={y(dados[ultimoPrev].previsto!)} r={4} fill="var(--serie-2)" stroke="var(--card)" strokeWidth={2} />
            <text x={x(ultimoPrev) + 8} y={y(dados[ultimoPrev].previsto!)} dy="0.32em" className="fill-foreground text-[11px] font-medium tabular-nums">
              {numero(dados[ultimoPrev].previsto!)}
            </text>

            {ativo !== null && (
              <g pointerEvents="none">
                <line x1={x(ativo)} x2={x(ativo)} y1={M.topo} y2={M.topo + alturaPlot} stroke="var(--muted)" strokeOpacity={0.5} />
                {pontoAtivo?.realizado != null && (
                  <circle cx={x(ativo)} cy={y(pontoAtivo.realizado)} r={4} fill="var(--serie-1)" stroke="var(--card)" strokeWidth={2} />
                )}
                {pontoAtivo?.previsto != null && pontoAtivo.realizado == null && (
                  <circle cx={x(ativo)} cy={y(pontoAtivo.previsto)} r={4} fill="var(--serie-2)" stroke="var(--card)" strokeWidth={2} />
                )}
              </g>
            )}

            <rect
              x={M.esquerda}
              y={M.topo}
              width={larguraPlot}
              height={alturaPlot}
              fill="transparent"
              onPointerMove={aoMover}
              onPointerLeave={() => setAtivo(null)}
            />
          </svg>
        )}
        {pontoAtivo && ativo !== null && (
          <Tooltip x={x(ativo)} y={M.topo + alturaPlot / 2} largura={largura}>
            <div className="mb-1 font-medium text-foreground">{pontoAtivo.mes}</div>
            {pontoAtivo.realizado !== null ? (
              <LinhaTooltip cor="var(--serie-1)" rotulo="Realizado" valor={numero(pontoAtivo.realizado)} />
            ) : (
              <>
                <LinhaTooltip cor="var(--serie-2)" rotulo="Previsto" valor={numero(pontoAtivo.previsto!)} />
                <LinhaTooltip rotulo="Intervalo" valor={`${numero(pontoAtivo.minimo!)} – ${numero(pontoAtivo.maximo!)}`} />
              </>
            )}
          </Tooltip>
        )}
      </div>
    </CardGrafico>
  );
}
