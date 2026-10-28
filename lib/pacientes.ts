export type NivelRisco = "Baixo" | "Moderado" | "Alto";

export type Paciente = {
  id: string;
  nome: string;
  idade: number;
  unidade: string;
  exame: string;
  consultas: number;
  ultimaConsulta: string | null;
  risco: NivelRisco;
};

export const RISCOS: Record<string, NivelRisco> = {
  baixo: "Baixo",
  moderado: "Moderado",
  alto: "Alto",
};

export function formatarData(iso: string | null) {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}
