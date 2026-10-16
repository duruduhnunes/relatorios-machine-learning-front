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

export const NOMES_F = [
  "Ana",
  "Maria",
  "Juliana",
  "Camila",
  "Fernanda",
  "Patrícia",
  "Beatriz",
  "Larissa",
  "Carla",
  "Vanessa",
  "Renata",
  "Tatiane",
  "Aline",
  "Bruna",
  "Daniela",
  "Gabriela",
  "Jéssica",
  "Luciana",
  "Mariana",
  "Priscila",
  "Rafaela",
  "Simone",
  "Thaís",
  "Vitória",
];
export const NOMES_M = ["Carlos", "José", "Marcos", "Paulo", "Rafael", "Bruno"];
export const SOBRENOMES = [
  "Silva",
  "Santos",
  "Oliveira",
  "Souza",
  "Rodrigues",
  "Ferreira",
  "Alves",
  "Pereira",
  "Lima",
  "Gomes",
  "Costa",
  "Ribeiro",
  "Martins",
  "Carvalho",
  "Almeida",
  "Lopes",
  "Soares",
  "Fernandes",
  "Vieira",
  "Barbosa",
];
export const UNIDADES = [
  "UBS Central",
  "UBS Vila Nova",
  "UBS Jardim das Flores",
  "UBS São José",
  "UBS Boa Vista",
  "ESF Santa Rita",
];

export function distribuirRiscos(
  total: number,
  proporcao: { alto: number; moderado: number },
  r: () => number,
): NivelRisco[] {
  const alto = Math.round((total * proporcao.alto) / 100);
  const moderado = Math.round((total * proporcao.moderado) / 100);
  const lista: NivelRisco[] = Array.from({ length: total }, (_, i) =>
    i < alto ? "Alto" : i < alto + moderado ? "Moderado" : "Baixo",
  );
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}
export function formatarData(iso: string | null) {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}
