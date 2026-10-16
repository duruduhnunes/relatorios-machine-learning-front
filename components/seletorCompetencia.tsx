"use client";

import { Calendar, ChevronDown } from "lucide-react";
import { COMPETENCIAS, Competencia } from "@/lib/dadosSaude";

export function SeletorCompetencia({
  valor,
  onChange,
}: {
  valor: Competencia;
  onChange: (c: Competencia) => void;
}) {
  return (
    <div className="relative">
      <Calendar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-primary" />
      <select
        aria-label="Competência"
        value={valor}
        onChange={(e) => onChange(e.target.value as Competencia)}
        className="cursor-pointer appearance-none rounded-lg border border-border bg-card py-2.5 pr-10 pl-10 text-sm text-foreground focus:border-primary focus:outline-none"
      >
        {COMPETENCIAS.map((c) => (
          <option key={c.valor} value={c.valor} className="bg-card">
            {c.rotulo}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
