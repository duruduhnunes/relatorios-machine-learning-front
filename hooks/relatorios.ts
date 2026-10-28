import { BackendURL } from "./backendURL";
import { lerToken, sair } from "./token";

export type RelatorioNome =
  | "relatorio_gestantes"
  | "relatorio_hipertensos"
  | "relatorio_diabeticos"
  | "relatorio_criancas"
  | "relatorio_idosos"
  | "resumo_cobertura";

type LinhaBase = {
  codigo: string;
  nome: string;
  idade: number;
  unidade_saude: string;
  total_consultas: number;
  ultima_consulta: string | null;
  risco: string;
};
export type LinhaGestante = LinhaBase & { semanas_gestacao: number };
export type LinhaHipertenso = LinhaBase & {
  pressao_sistolica: number;
  pressao_diastolica: number;
};
export type LinhaDiabetico = LinhaBase & { hemoglobina_glicada: number };
export type LinhaCrianca = LinhaBase & { vacinacao_em_dia: boolean };
export type LinhaIdoso = LinhaBase & { comorbidades: number };
export type LinhaCobertura = {
  grupo: string;
  cadastrados: number;
  atendidos: number;
  cobertura: number;
};

type LinhaDe = {
  relatorio_gestantes: LinhaGestante;
  relatorio_hipertensos: LinhaHipertenso;
  relatorio_diabeticos: LinhaDiabetico;
  relatorio_criancas: LinhaCrianca;
  relatorio_idosos: LinhaIdoso;
  resumo_cobertura: LinhaCobertura;
};

export type RelatorioResposta<L> = {
  relatorio: string;
  descricao: string;
  mes: number;
  ano: number;
  total: number;
  dados: L[];
};

export async function obterRelatorio<N extends RelatorioNome>(
  nome: N,
  mes: number,
  ano: number,
): Promise<RelatorioResposta<LinhaDe[N]>> {
  const token = lerToken();
  const busca = new URLSearchParams({ mes: String(mes), ano: String(ano) });
  const resposta = await fetch(BackendURL(`/relatorios/${nome}?${busca}`), {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!resposta.ok) {
    if (resposta.status === 401) sair();
    const corpo: { detail?: string } | null = await resposta
      .json()
      .catch(() => null);
    throw new Error(
      `${resposta.status} — ${corpo?.detail ?? resposta.statusText}`,
    );
  }

  return resposta.json();
}
