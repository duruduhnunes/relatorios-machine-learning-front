import { GrupoId } from "@/lib/dadosSaude";

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

export function mensagemBot(texto: string): Mensagem {
  return { id: novoId(), autor: "bot", texto };
}
