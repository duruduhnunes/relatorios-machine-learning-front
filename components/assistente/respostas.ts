// Respostas do assistente montadas a partir dos mesmos dados do Resumo Geral.
// Enquanto a API do modelo não está ligada, a interpretação da pergunta é feita
// aqui por palavras-chave, então os números do chat batem com os dos gráficos.

import { Competencia, GRUPOS, GrupoId, gerarResumo, numero } from "@/lib/dadosSaude";

export type IconeSugestao = "grafico" | "comparar" | "pdf" | "pergunta";

export type Sugestao = { rotulo: string; icone: IconeSugestao; pergunta: string };

export type CartaoGrupo = {
  id: GrupoId;
  nome: string;
  total: number;
  cobertura: number;
};

export type Item = { rotulo: string; valor: string };

export type Mensagem = {
  id: string;
  autor: "bot" | "usuario";
  texto: string;
  cartao?: CartaoGrupo;
  itens?: Item[];
  dica?: string;
  sugestoes?: Sugestao[];
};

let sequencia = 0;
const novoId = () => `m${++sequencia}`;

const semAcento = (t: string) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const PALAVRAS: Record<GrupoId, string[]> = {
  gestantes: ["gestante", "gravida", "pre-natal", "pre natal", "gestacao"],
  diabeticos: ["diabetic", "diabetes", "glicemia"],
  hipertensos: ["hipertens", "pressao"],
  criancas: ["crianca", "infantil", "pediatr"],
  idosos: ["idoso", "terceira idade"],
};

export function saudacao(): Mensagem {
  return {
    id: novoId(),
    autor: "bot",
    texto:
      "Olá! Eu sou o Assistente de Saúde.\nPosso te ajudar a analisar os dados da sua população, acompanhar indicadores e tirar dúvidas sobre os números do painel. 😊\n\nComo posso te ajudar hoje?",
    sugestoes: [
      { rotulo: "Quantas gestantes temos?", icone: "pergunta", pergunta: "Quantas gestantes temos no município e qual a cobertura de acompanhamento?" },
      { rotulo: "Quais grupos estão abaixo da meta?", icone: "grafico", pergunta: "Quais grupos estão abaixo da meta de cobertura?" },
      { rotulo: "Como estão os atendimentos?", icone: "grafico", pergunta: "Como estão os atendimentos e a previsão do modelo?" },
    ],
  };
}

export function mensagemUsuario(texto: string): Mensagem {
  return { id: novoId(), autor: "usuario", texto };
}

function sugestoesGrupo(nome: string): Sugestao[] {
  return [
    { rotulo: "Ver evolução mensal", icone: "grafico", pergunta: `Ver a evolução mensal de ${nome}` },
    { rotulo: "Comparar com outros municípios", icone: "comparar", pergunta: `Comparar ${nome} com outros municípios` },
    { rotulo: "Gerar relatório em PDF", icone: "pdf", pergunta: `Gerar relatório em PDF de ${nome}` },
  ];
}

function identificarGrupo(pergunta: string): GrupoId | null {
  const p = semAcento(pergunta);
  for (const g of GRUPOS) {
    if (PALAVRAS[g.id].some((termo) => p.includes(termo))) return g.id;
  }
  return null;
}

export function responder(pergunta: string, competencia: Competencia): Mensagem {
  const p = semAcento(pergunta);
  const resumo = gerarResumo(competencia);
  const meta = resumo.meta;
  const grupo = identificarGrupo(pergunta);

  // Ações que ainda dependem do back-end
  if (p.includes("pdf") || p.includes("relatorio") || p.includes("exportar")) {
    return {
      id: novoId(),
      autor: "bot",
      texto:
        "A geração de relatório em PDF ainda não está ligada — ela entra junto com a API do modelo.\n\nPor enquanto, dá para exportar os dados pelo menu lateral, em “Exportar Dados”.",
    };
  }

  if (p.includes("comparar") || p.includes("outros municipios") || p.includes("ranking")) {
    return {
      id: novoId(),
      autor: "bot",
      texto:
        "Ainda tenho acesso só aos dados deste município. A comparação entre municípios depende da base regional, que será conectada junto com a API.",
    };
  }

  // Evolução mensal de um grupo
  if ((p.includes("evolucao") || p.includes("historico") || p.includes("ultimos meses")) && grupo) {
    const ind = resumo.indicadores.find((i) => i.id === grupo)!;
    const serie = ind.serie.slice(-6);
    const variacao = ((serie[5] - serie[0]) / serie[0]) * 100;
    return {
      id: novoId(),
      autor: "bot",
      texto: `Evolução de ${ind.nome} nos últimos 6 meses:`,
      itens: rotulosMeses(competencia, 6).map((mes, i) => ({
        rotulo: mes,
        valor: numero(serie[i]),
      })),
      dica: `No período, o grupo ${variacao >= 0 ? "cresceu" : "caiu"} ${Math.abs(variacao).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%.`,
      sugestoes: sugestoesGrupo(ind.nome),
    };
  }

  // Pergunta sobre um grupo específico
  if (grupo) {
    const ind = resumo.indicadores.find((i) => i.id === grupo)!;
    const cob = resumo.cobertura.find((c) => c.id === grupo)!;
    const comAcomp = Math.round((ind.total * cob.percentual) / 100);
    return {
      id: novoId(),
      autor: "bot",
      texto: "No momento, o município possui:",
      cartao: { id: grupo, nome: ind.nome, total: ind.total, cobertura: cob.percentual },
      itens: [
        { rotulo: "Com acompanhamento", valor: numero(comAcomp) },
        { rotulo: "Sem acompanhamento", valor: numero(ind.total - comAcomp) },
        { rotulo: "Cobertura", valor: `${cob.percentual}%` },
      ],
      dica:
        cob.percentual >= meta
          ? `A cobertura está dentro do ideal (≥ ${meta}%). Vale manter o ritmo de agendamento para não perder a meta.`
          : `A cobertura de acompanhamento está abaixo do ideal (≥ ${meta}%). Considere reforçar o agendamento das consultas.`,
      sugestoes: sugestoesGrupo(ind.nome),
    };
  }

  // Cobertura geral / grupos abaixo da meta
  if (p.includes("cobertura") || p.includes("meta") || p.includes("abaixo")) {
    const abaixo = resumo.cobertura.filter((c) => c.percentual < meta);
    return {
      id: novoId(),
      autor: "bot",
      texto: abaixo.length
        ? `${abaixo.length} de ${resumo.cobertura.length} grupos estão abaixo da meta de ${meta}%:`
        : `Todos os grupos estão na meta de ${meta}%. 🎉`,
      itens: (abaixo.length ? abaixo : resumo.cobertura).map((c) => ({
        rotulo: c.nome,
        valor: `${c.percentual}%`,
      })),
      dica: abaixo.length
        ? `O grupo mais distante da meta é ${abaixo.reduce((a, b) => (a.percentual < b.percentual ? a : b)).nome}.`
        : undefined,
    };
  }

  // Atendimentos e previsão do modelo
  if (p.includes("atendimento") || p.includes("previsao") || p.includes("projecao") || p.includes("modelo")) {
    const realizados = resumo.atendimentos.filter((a) => a.realizado !== null);
    const ultimo = realizados[realizados.length - 1];
    const previstos = resumo.atendimentos.slice(-3);
    return {
      id: novoId(),
      autor: "bot",
      texto: `No último mês fechado (${ultimo.mes}) foram ${numero(ultimo.realizado!)} atendimentos. A previsão do modelo para os próximos 3 meses é:`,
      itens: previstos.map((a) => ({
        rotulo: a.mes,
        valor: `${numero(a.previsto!)} (${numero(a.minimo!)} – ${numero(a.maximo!)})`,
      })),
      dica: "Os valores entre parênteses são o intervalo de confiança da previsão.",
    };
  }

  // Risco
  if (p.includes("risco") || p.includes("grave") || p.includes("critico")) {
    const ordenado = [...resumo.risco].sort((a, b) => b.alto - a.alto);
    return {
      id: novoId(),
      autor: "bot",
      texto: "Distribuição de pacientes em risco alto por grupo:",
      itens: ordenado.map((r) => ({ rotulo: r.nome, valor: `${r.alto}%` })),
      dica: `${ordenado[0].nome} é o grupo com maior proporção de risco alto (${ordenado[0].alto}%).`,
    };
  }

  // Não entendi
  return {
    id: novoId(),
    autor: "bot",
    texto:
      "Ainda não sei responder isso. Por enquanto trabalho com os dados do painel — posso falar sobre:",
    itens: [
      { rotulo: "Grupos", valor: "gestantes, diabéticos, hipertensos, crianças e idosos" },
      { rotulo: "Indicadores", valor: "cobertura, atendimentos e risco" },
    ],
    sugestoes: saudacao().sugestoes,
  };
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// Rótulos dos N meses que terminam na competência selecionada
function rotulosMeses(competencia: Competencia, quantidade: number) {
  const [ano, mes] = competencia.split("-").map(Number);
  return Array.from({ length: quantidade }, (_, i) => {
    const d = new Date(ano, mes - 1 - (quantidade - 1 - i), 1);
    return `${MESES[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
  });
}
