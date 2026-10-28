"use client";

import {
  Baby,
  BarChart3,
  Bot,
  Droplet,
  FileText,
  HeartPulse,
  Lightbulb,
  Minus,
  Paperclip,
  PersonStanding,
  Scale,
  Send,
  Sparkles,
  User,
  Venus,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { GrupoId, numero } from "@/lib/dadosSaude";
import { enviarMensagemChatBoot } from "@/hooks/chatboot";
import {
  CartaoGrupo,
  IconeSugestao,
  Item,
  Mensagem,
  Sugestao,
  mensagemBot,
  mensagemUsuario,
  saudacao,
} from "./respostas";

const ICONES: Record<GrupoId, typeof Venus> = {
  gestantes: Venus,
  diabeticos: Droplet,
  hipertensos: HeartPulse,
  criancas: Baby,
  idosos: PersonStanding,
};

const ICONES_SUGESTAO: Record<IconeSugestao, typeof BarChart3> = {
  grafico: BarChart3,
  comparar: Scale,
  pdf: FileText,
  pergunta: Sparkles,
};

export function AssistentePainel({
  aberto,
  onFechar,
}: {
  aberto: boolean;
  onFechar: () => void;
}) {
  const [mensagens, setMensagens] = useState<Mensagem[]>(() => [saudacao()]);
  const [texto, setTexto] = useState("");
  const [digitando, setDigitando] = useState(false);
  const fim = useRef<HTMLDivElement>(null);
  const entrada = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aberto) fim.current?.scrollIntoView({ block: "end" });
  }, [mensagens, digitando, aberto]);

  useEffect(() => {
    if (aberto) entrada.current?.focus();
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, onFechar]);

  async function perguntar(pergunta: string) {
    const limpa = pergunta.trim();
    if (!limpa || digitando) return;
    setMensagens((m) => [...m, mensagemUsuario(limpa)]);
    setTexto("");
    setDigitando(true);

    try {
      const resposta = await enviarMensagemChatBoot(limpa);
      setMensagens((m) => [...m, mensagemBot(resposta.texto)]);
    } catch (error) {
      const erro = error instanceof Error ? error.message : String(error);
      setMensagens((m) => [
        ...m,
        mensagemBot(`Não consegui falar com o servidor. ${erro}`),
      ]);
    } finally {
      setDigitando(false);
    }
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    perguntar(texto);
  }

  function fecharELimpar() {
    setMensagens([saudacao()]);
    setTexto("");
    onFechar();
  }

  return (
    <section
      aria-label="Assistente virtual"
      className={`fixed right-6 bottom-6 z-50 max-h-[min(44rem,calc(100dvh-3rem))] w-[min(24rem,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-primary/30 bg-sidebar shadow-[0_18px_50px_-12px_rgba(42,52,57,0.35)] ${
        aberto ? "flex flex-col" : "hidden"
      }`}
    >
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/15 ring-2 ring-primary/50">
          <Bot className="size-6 text-primary" />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <h2 className="truncate text-sm font-semibold text-foreground">
            Assistente de Saúde
          </h2>
          <p className="truncate text-xs text-muted">
            Seu aliado na análise de dados
          </p>
        </div>
        <button
          type="button"
          onClick={onFechar}
          aria-label="Minimizar assistente"
          className="cursor-pointer rounded-md p-1.5 text-muted hover:bg-card hover:text-foreground"
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          onClick={fecharELimpar}
          aria-label="Fechar assistente"
          className="cursor-pointer rounded-md p-1.5 text-muted hover:bg-card hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </header>

      <div
        role="log"
        aria-live="polite"
        className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]"
      >
        {mensagens.map((m) =>
          m.autor === "usuario" ? (
            <BalaoUsuario key={m.id} texto={m.texto} />
          ) : (
            <BalaoBot key={m.id} mensagem={m} onSugestao={perguntar} />
          ),
        )}
        {digitando && <Digitando />}
        <div ref={fim} />
      </div>

      <form
        onSubmit={enviar}
        className="flex items-center gap-2 border-t border-border px-3 py-3"
      >
        <button
          type="button"
          aria-label="Anexar arquivo"
          className="cursor-pointer rounded-md p-2 text-muted hover:bg-card hover:text-foreground"
        >
          <Paperclip className="size-4" />
        </button>
        <input
          ref={entrada}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          aria-label="Digite sua pergunta"
          placeholder="Digite sua pergunta..."
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
        />
        <button
          type="submit"
          disabled={!texto.trim() || digitando}
          aria-label="Enviar pergunta"
          className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-primary/20 text-primary hover:bg-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="size-4" />
        </button>
      </form>
    </section>
  );
}

function BalaoUsuario({ texto }: { texto: string }) {
  return (
    <div className="flex justify-end">
      <div className="flex max-w-[85%] items-start gap-2 rounded-2xl rounded-br-sm bg-[var(--bolha-usuario)] px-3 py-2">
        <User className="mt-0.5 size-4 shrink-0 text-white/80" />
        <p className="text-sm text-white">{texto}</p>
      </div>
    </div>
  );
}

function BalaoBot({
  mensagem,
  onSugestao,
}: {
  mensagem: Mensagem;
  onSugestao: (pergunta: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <AvatarBot />
        <div className="flex max-w-[85%] flex-col gap-3 rounded-2xl rounded-tl-sm border border-border bg-card px-3 py-2">
          {mensagem.texto.split("\n\n").map((p, i) => (
            <p key={i} className="text-sm whitespace-pre-line text-foreground">
              {p}
            </p>
          ))}
          {mensagem.cartao && <Cartao dados={mensagem.cartao} />}
          {mensagem.itens && <Itens itens={mensagem.itens} />}
          {mensagem.dica && (
            <p className="flex gap-2 text-xs text-muted">
              <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-[var(--risco-moderado)]" />
              {mensagem.dica}
            </p>
          )}
        </div>
      </div>
      {mensagem.sugestoes && (
        <Sugestoes lista={mensagem.sugestoes} onEscolher={onSugestao} />
      )}
    </div>
  );
}

function AvatarBot() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 ring-1 ring-primary/40">
      <Bot className="size-5 text-primary" />
    </span>
  );
}

function Cartao({ dados }: { dados: CartaoGrupo }) {
  const Icone = ICONES[dados.id];
  const cadastro =
    dados.id === "gestantes" || dados.id === "criancas"
      ? "cadastradas"
      : "cadastrados";
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background/60 p-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/15">
        <Icone className="size-5 text-primary" />
      </span>
      <div className="min-w-0 flex-1 leading-tight">
        <div className="text-xs text-muted">{dados.nome}</div>
        <div className="text-lg font-semibold text-foreground tabular-nums">
          {numero(dados.total)}{" "}
          <span className="text-xs font-normal text-muted">{cadastro}</span>
        </div>
      </div>
      <Anel percentual={dados.cobertura} />
    </div>
  );
}

function Anel({ percentual }: { percentual: number }) {
  const raio = 16;
  const volta = 2 * Math.PI * raio;
  const cor =
    percentual >= 80
      ? "var(--risco-baixo)"
      : percentual >= 60
        ? "var(--risco-moderado)"
        : "var(--risco-alto)";
  return (
    <div className="relative grid size-11 shrink-0 place-items-center">
      <svg
        viewBox="0 0 40 40"
        className="size-11 -rotate-90"
        role="img"
        aria-label={`Cobertura de ${percentual}%`}
      >
        <circle cx="20" cy="20" r={raio} fill="none" stroke="var(--grade)" strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r={raio}
          fill="none"
          stroke={cor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${(percentual / 100) * volta} ${volta}`}
        />
      </svg>
      <span className="absolute text-[10px] font-medium text-foreground tabular-nums">
        {percentual}%
      </span>
    </div>
  );
}

function Itens({ itens }: { itens: Item[] }) {
  return (
    <ul className="flex flex-col gap-1 text-xs">
      {itens.map((i) => (
        <li key={i.rotulo} className="flex justify-between gap-3">
          <span className="text-muted">• {i.rotulo}</span>
          <span className="text-right font-medium text-foreground tabular-nums">
            {i.valor}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Sugestoes({
  lista,
  onEscolher,
}: {
  lista: Sugestao[];
  onEscolher: (pergunta: string) => void;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      {lista.map((s) => {
        const Icone = ICONES_SUGESTAO[s.icone];
        return (
          <button
            key={s.rotulo}
            type="button"
            onClick={() => onEscolher(s.pergunta)}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-foreground hover:border-primary/50 hover:bg-card"
          >
            <Icone className="size-3.5 text-primary" />
            {s.rotulo}
          </button>
        );
      })}
    </div>
  );
}

function Digitando() {
  return (
    <div className="flex items-center gap-2">
      <AvatarBot />
      <div className="flex gap-1 rounded-2xl rounded-tl-sm border border-border bg-card px-3 py-3">
        {[0, 150, 300].map((atraso) => (
          <span
            key={atraso}
            className="size-1.5 animate-bounce rounded-full bg-muted"
            style={{ animationDelay: `${atraso}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
