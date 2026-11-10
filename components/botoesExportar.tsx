"use client";

import { useState } from "react";
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { Competencia } from "@/lib/dadosSaude";
import {
  exportarRelatorio,
  FormatoExportacao,
  RelatorioNome,
} from "@/hooks/relatorios";

const BOTOES: { formato: FormatoExportacao; rotulo: string; Icone: typeof FileText }[] = [
  { formato: "excel", rotulo: "Excel", Icone: FileSpreadsheet },
  { formato: "pdf", rotulo: "PDF", Icone: FileText },
];

export function BotoesExportar({
  relatorio,
  competencia,
}: {
  relatorio: RelatorioNome;
  competencia: Competencia;
}) {
  const [baixando, setBaixando] = useState<FormatoExportacao | null>(null);
  const [erro, setErro] = useState("");

  async function baixar(formato: FormatoExportacao) {
    const [ano, mes] = competencia.split("-").map(Number);
    setBaixando(formato);
    setErro("");
    try {
      await exportarRelatorio(relatorio, formato, mes, ano);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao exportar.");
    } finally {
      setBaixando(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        {BOTOES.map(({ formato, rotulo, Icone }) => (
          <button
            key={formato}
            type="button"
            onClick={() => baixar(formato)}
            disabled={baixando !== null}
            aria-label={`Baixar relatório em ${rotulo}`}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground hover:border-primary hover:bg-primary-suave disabled:cursor-wait disabled:opacity-60"
          >
            {baixando === formato ? (
              <Loader2 className="size-4 animate-spin text-primary" />
            ) : (
              <Icone className="size-4 text-primary" />
            )}
            {rotulo}
          </button>
        ))}
      </div>
      {erro && (
        <p role="alert" className="text-xs" style={{ color: "var(--risco-alto)" }}>
          {erro}
        </p>
      )}
    </div>
  );
}
