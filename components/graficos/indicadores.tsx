"use client";

import { ArrowDownRight, ArrowUpRight, Baby, Droplet, HeartPulse, PersonStanding, Venus } from "lucide-react";
import { GrupoId, Indicador, numero } from "@/lib/dadosSaude";

const ICONES: Record<GrupoId, typeof Venus> = {
  gestantes: Venus,
  diabeticos: Droplet,
  hipertensos: HeartPulse,
  criancas: Baby,
  idosos: PersonStanding,
};

export function Indicadores({ dados }: { dados: Indicador[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {dados.map((d) => {
        const Icone = ICONES[d.id];
        const variacao = ((d.total - d.anterior) / d.anterior) * 100;
        const subiu = variacao >= 0;
        const Seta = subiu ? ArrowUpRight : ArrowDownRight;
        return (
          <div
            key={d.id}
            className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-2 text-sm text-muted">
              <Icone className="size-4 text-primary" />
              {d.nome}
            </div>
            <div className="flex items-end justify-between gap-2">
              <div>
                <div className="text-2xl font-semibold text-foreground">
                  {numero(d.total)}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Seta
                    className="size-3.5"
                    style={{ color: subiu ? "var(--sobe-bom)" : "var(--desce-ruim)" }}
                  />
                  {subiu ? "+" : ""}
                  {variacao.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% vs mês anterior
                </div>
              </div>
              <MiniTendencia serie={d.serie} nome={d.nome} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MiniTendencia({ serie, nome }: { serie: number[]; nome: string }) {
  const w = 72;
  const h = 28;
  const min = Math.min(...serie);
  const max = Math.max(...serie);
  const px = (i: number) => 4 + (i / (serie.length - 1)) * (w - 8);
  const py = (v: number) => 4 + (1 - (v - min) / (max - min || 1)) * (h - 8);
  const caminho = serie.map((v, i) => `${i ? "L" : "M"}${px(i)},${py(v)}`).join(" ");
  const ultimo = serie.length - 1;
  return (
    <svg width={w} height={h} role="img" aria-label={`Tendência de 12 meses de ${nome}`}>
      <path d={caminho} fill="none" stroke="var(--muted)" strokeOpacity={0.6} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={px(ultimo)} cy={py(serie[ultimo])} r={3} fill="var(--serie-1)" stroke="var(--card)" strokeWidth={2} />
    </svg>
  );
}
