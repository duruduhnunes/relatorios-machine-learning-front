import { Calendar, ChevronDown } from "lucide-react";

export function HomePage() {
  return (
    <div className=" flex items-center justify-between">
      <div className="flex flex-col justify-start">
        <h1 className="text-2xl font-semibold">Olá, Gestor!</h1>
        <p className="text-sm text-muted">
          Acompanhe os principais indicadores de saude da sua população.
        </p>
      </div>
      <div className="relative">
        <Calendar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-primary" />
        <select className="cursor-pointer appearance-none rounded-lg border border-border bg-card py-2.5 pr-10 pl-10 text-sm text-foreground focus:border-primary focus:outline-none">
          <option value="default" className="bg-card">
            Selecione uma competencia
          </option>
          <option value="option1" className="bg-card">
            Setembro/2026
          </option>
          <option value="option2" className="bg-card">
            Outubro/2026
          </option>
          <option value="option3" className="bg-card">
            Novembro/2026
          </option>
          <option value="option4" className="bg-card">
            Dezembro/2026
          </option>
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
      </div>
    </div>
  );
}
