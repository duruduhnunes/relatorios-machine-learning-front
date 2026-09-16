"use client";

import { Table2, BarChart3 } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

// Mede a largura do container para o SVG acompanhar o tamanho da tela
export function useLargura<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [largura, setLargura] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver(([e]) => setLargura(e.contentRect.width));
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, largura] as const;
}

export type TabelaDados = { colunas: string[]; linhas: (string | number)[][] };

export function CardGrafico({
  titulo,
  subtitulo,
  legenda,
  tabela,
  children,
  className = "",
}: {
  titulo: string;
  subtitulo?: string;
  legenda?: ReactNode;
  tabela: TabelaDados;
  children: ReactNode;
  className?: string;
}) {
  const [verTabela, setVerTabela] = useState(false);
  return (
    <section
      className={`flex flex-col gap-3 rounded-xl border border-border bg-card p-5 ${className}`}
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">{titulo}</h2>
          {subtitulo && <p className="text-sm text-muted">{subtitulo}</p>}
        </div>
        <button
          type="button"
          onClick={() => setVerTabela(!verTabela)}
          aria-pressed={verTabela}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted hover:bg-background hover:text-foreground"
        >
          {verTabela ? (
            <>
              <BarChart3 className="size-3.5" /> Gráfico
            </>
          ) : (
            <>
              <Table2 className="size-3.5" /> Tabela
            </>
          )}
        </button>
      </header>
      {legenda && !verTabela && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {legenda}
        </div>
      )}
      {verTabela ? <Tabela {...tabela} /> : children}
    </section>
  );
}

export function ItemLegenda({
  cor,
  forma = "quadrado",
  children,
}: {
  cor: string;
  forma?: "quadrado" | "linha" | "faixa";
  children: ReactNode;
}) {
  const estilo =
    forma === "linha"
      ? "h-0.5 w-4 rounded-full"
      : forma === "faixa"
        ? "h-2.5 w-4 rounded-sm opacity-25"
        : "size-2.5 rounded-sm";
  return (
    <span className="flex items-center gap-1.5">
      <span className={estilo} style={{ background: cor }} />
      {children}
    </span>
  );
}

function Tabela({ colunas, linhas }: TabelaDados) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm tabular-nums">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted">
            {colunas.map((c, i) => (
              <th key={c} className={`py-2 font-medium ${i ? "text-right" : ""}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, li) => (
            <tr key={li} className="border-b border-border/60 last:border-0">
              {l.map((v, i) => (
                <td key={i} className={`py-1.5 ${i ? "text-right" : ""}`}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Tooltip({
  x,
  y,
  largura,
  children,
}: {
  x: number;
  y: number;
  largura: number;
  children: ReactNode;
}) {
  // Vira para a esquerda quando encostaria na borda direita
  const paraEsquerda = x > largura - 180;
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 min-w-40 rounded-lg border border-border bg-background/95 px-3 py-2 text-xs shadow-lg"
      style={{
        left: paraEsquerda ? undefined : x + 14,
        right: paraEsquerda ? largura - x + 14 : undefined,
        top: y,
        transform: "translateY(-50%)",
      }}
    >
      {children}
    </div>
  );
}

export function LinhaTooltip({
  cor,
  rotulo,
  valor,
}: {
  cor?: string;
  rotulo: string;
  valor: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-0.5">
      <span className="flex items-center gap-1.5 text-muted">
        {cor && <span className="size-2 rounded-sm" style={{ background: cor }} />}
        {rotulo}
      </span>
      <span className="font-medium text-foreground tabular-nums">{valor}</span>
    </div>
  );
}
