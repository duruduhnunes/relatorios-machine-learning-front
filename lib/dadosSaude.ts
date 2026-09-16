// Dados de exemplo para o Resumo Geral.
// Enquanto o back-end/modelo não está ligado, os números são gerados de forma
// determinística a partir da competência, então a mesma competência sempre
// mostra os mesmos valores.

export type Competencia = "2026-09" | "2026-10" | "2026-11" | "2026-12";

export const COMPETENCIAS: { valor: Competencia; rotulo: string }[] = [
  { valor: "2026-09", rotulo: "Setembro/2026" },
  { valor: "2026-10", rotulo: "Outubro/2026" },
  { valor: "2026-11", rotulo: "Novembro/2026" },
  { valor: "2026-12", rotulo: "Dezembro/2026" },
];

export type GrupoId =
  | "gestantes"
  | "diabeticos"
  | "hipertensos"
  | "criancas"
  | "idosos";

export const GRUPOS: { id: GrupoId; nome: string; base: number }[] = [
  { id: "gestantes", nome: "Gestantes", base: 412 },
  { id: "diabeticos", nome: "Diabéticos", base: 2890 },
  { id: "hipertensos", nome: "Hipertensos", base: 6135 },
  { id: "criancas", nome: "Crianças", base: 3478 },
  { id: "idosos", nome: "Idosos", base: 5210 },
];

export type Indicador = {
  id: GrupoId;
  nome: string;
  total: number;
  anterior: number;
  serie: number[]; // últimos 12 meses
};

export type PontoAtendimento = {
  mes: string; // "set/26"
  realizado: number | null;
  previsto: number | null;
  minimo: number | null;
  maximo: number | null;
};

export type Cobertura = { id: GrupoId; nome: string; percentual: number };

export type Risco = {
  id: GrupoId;
  nome: string;
  baixo: number;
  moderado: number;
  alto: number;
};

export type ResumoGeral = {
  indicadores: Indicador[];
  atendimentos: PontoAtendimento[];
  meta: number;
  cobertura: Cobertura[];
  risco: Risco[];
};

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function aleatorio(semente: number) {
  let s = semente >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function rotuloMes(ano: number, mes: number) {
  return `${MESES[mes]}/${String(ano).slice(2)}`;
}

export function gerarResumo(competencia: Competencia): ResumoGeral {
  const [ano, mesNum] = competencia.split("-").map(Number);
  const indice = (ano - 2026) * 12 + (mesNum - 9); // 0 = set/26
  const rand = aleatorio(2026 + indice * 97);

  const indicadores = GRUPOS.map((g, gi) => {
    const r = aleatorio(31 * (gi + 1) + indice);
    const serie: number[] = [];
    let valor = g.base * 0.9;
    for (let i = 0; i < 12 + indice; i++) {
      valor = valor * (1 + 0.004 + (r() - 0.45) * 0.03);
      serie.push(Math.round(valor));
    }
    const ultimos = serie.slice(-12);
    return {
      id: g.id,
      nome: g.nome,
      total: ultimos[11],
      anterior: ultimos[10],
      serie: ultimos,
    };
  });

  // Atendimentos: 12 meses realizados até a competência + 3 meses previstos pelo modelo
  const atendimentos: PontoAtendimento[] = [];
  const inicio = new Date(ano, mesNum - 1 - 11, 1);
  let nivel = 8200;
  for (let i = 0; i < 15; i++) {
    const d = new Date(inicio.getFullYear(), inicio.getMonth() + i, 1);
    const sazonal = Math.sin(((d.getMonth() + 2) / 12) * Math.PI * 2) * 650;
    nivel = nivel * (1 + 0.006 + (rand() - 0.5) * 0.02);
    const valor = Math.round(nivel + sazonal);
    const futuro = i > 11;
    const passos = i - 11;
    const incerteza = Math.round(valor * 0.035 * passos);
    atendimentos.push({
      mes: rotuloMes(d.getFullYear(), d.getMonth()),
      realizado: futuro ? null : valor,
      // A previsão parte do último mês realizado, para a linha ficar contínua
      previsto: i >= 11 ? valor : null,
      minimo: i >= 11 ? valor - incerteza : null,
      maximo: i >= 11 ? valor + incerteza : null,
    });
  }

  const cobertura = GRUPOS.map((g, gi) => {
    const r = aleatorio(71 * (gi + 3) + indice * 13);
    const base = [78, 61, 69, 84, 57][gi];
    return {
      id: g.id,
      nome: g.nome,
      percentual: Math.min(98, Math.round(base + indice * 2 + (r() - 0.5) * 6)),
    };
  });

  const risco = GRUPOS.map((g, gi) => {
    const r = aleatorio(113 * (gi + 5) + indice * 7);
    const alto = Math.round([14, 22, 19, 6, 26][gi] - indice + (r() - 0.5) * 4);
    const moderado = Math.round([31, 38, 35, 21, 39][gi] + (r() - 0.5) * 6);
    return {
      id: g.id,
      nome: g.nome,
      alto,
      moderado,
      baixo: 100 - alto - moderado,
    };
  });

  return { indicadores, atendimentos, meta: 80, cobertura, risco };
}

export const numero = (n: number) => n.toLocaleString("pt-BR");
