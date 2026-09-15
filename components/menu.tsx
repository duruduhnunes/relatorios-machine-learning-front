import {
  Baby,
  Download,
  Droplet,
  HeartPulse,
  Home,
  PersonStanding,
  SheetIcon,
  Venus,
} from "lucide-react";

export function Menu() {
  return (
    <div>
      <div className="flex flex-col bg-sidebar w-64 h-screen p-4">
        <div className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-card p-2 rounded-md">
          <Home className="size-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            Resumo Geral
          </span>
        </div>
        <div className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-card p-2 rounded-md">
          <Venus className="size-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            Gestantes
          </span>
        </div>
        <div className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-card p-2 rounded-md">
          <Droplet className="size-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            Diabeticos
          </span>
        </div>
        <div className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-card p-2 rounded-md">
          <HeartPulse className="size-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            Hipertensos
          </span>
        </div>
        <div className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-card p-2 rounded-md">
          <Baby className="size-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            Crianças
          </span>
        </div>
        <div className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-card p-2 rounded-md">
          <PersonStanding className="size-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">Idosos</span>
        </div>
        <div className="border-b text-gray-400"></div>
        <div className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-card p-2 rounded-md mt-4">
          <SheetIcon className="size-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            Relatorios
          </span>
        </div>
        <div className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-card p-2 rounded-md">
          <Download className="size-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            Exportar Dados
          </span>
        </div>
      </div>
    </div>
  );
}
