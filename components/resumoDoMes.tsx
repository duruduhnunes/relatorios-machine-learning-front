import { AlertTriangle, ArrowRight, CalendarCheck, LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { GrupoId, ResumoGeral, mesPorExtenso, numero, pessoasEmRiscoAlto } from "@/lib/dadosSaude";

type Tom = "bom" | "atencao";

const TONS: Record<Tom, { fundo: string; cor: string; etiqueta: string }> = {
  bom: { fundo: "var(--primary-suave)", cor: "var(--primary)", etiqueta: "Tudo certo" },
  atencao: { fundo: "var(--aviso-suave)", cor: "var(--risco-alto)", etiqueta: "Pede atenção" },
};

// Os três recados mais importantes do mês, cada um em um cartão
export function ResumoDoMes({ resumo, onAbrirGrupo }: { resumo: ResumoGeral; onAbrirGrupo: (id: GrupoId) => void }) {
  const pontos = resumo.atendimentos;
  const ultimoFeito = [...pontos].reverse().find((p) => p.realizado !== null)!;
  const ultimoEsperado = pontos[pontos.length - 1];
  const esperado = ultimoEsperado.previsto!;
  const variacao = Math.round(((esperado - ultimoFeito.realizado!) / ultimoFeito.realizado!) * 100);

  const abaixo = resumo.cobertura.filter((c) => c.percentual < resumo.meta);
  const piorCobertura = [...abaixo].sort((a, b) => a.percentual - b.percentual)[0];
  const risco = pessoasEmRiscoAlto(resumo.risco, resumo.indicadores)[0];

  return (
    <section aria-labelledby="titulo-resumo" className="flex flex-col gap-3">
      <h2 id="titulo-resumo" className="text-lg font-semibold text-foreground">
        O que você precisa saber este mês
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Recado
          tom={variacao >= 0 ? "bom" : "atencao"}
          icone={variacao >= 0 ? TrendingUp : TrendingDown}
          titulo="Atendimentos"
        >
          Esperamos cerca de <strong>{numero(esperado)} atendimentos</strong> em {mesPorExtenso(ultimoEsperado.mes)},{" "}
          {variacao === 0
            ? "o mesmo que hoje."
            : `${Math.abs(variacao)}% ${variacao > 0 ? "a mais" : "a menos"} que em ${mesPorExtenso(ultimoFeito.mes)}.`}
        </Recado>

        <Recado
          tom={abaixo.length === 0 ? "bom" : "atencao"}
          icone={CalendarCheck}
          titulo="Consultas em dia"
          acao={piorCobertura && { rotulo: `Ver ${piorCobertura.nome.toLowerCase()}`, onClick: () => onAbrirGrupo(piorCobertura.id) }}
        >
          {abaixo.length === 0 ? (
            <>Todos os grupos passaram da meta de {resumo.meta}% com as consultas em dia.</>
          ) : (
            <>
              <strong>
                {abaixo.length} de {resumo.cobertura.length} grupos
              </strong>{" "}
              ainda não chegaram à meta de {resumo.meta}%: {juntar(abaixo.map((c) => c.nome))}.
            </>
          )}
        </Recado>

        <Recado
          tom="atencao"
          icone={AlertTriangle}
          titulo="Quem precisa de cuidado"
          acao={{ rotulo: `Ver ${risco.nome.toLowerCase()}`, onClick: () => onAbrirGrupo(risco.id) }}
        >
          <strong>{risco.nome}</strong> é o grupo com mais pessoas em risco alto: <strong>{numero(risco.pessoas)} pessoas</strong>.
        </Recado>
      </div>
    </section>
  );
}

function Recado({
  tom,
  icone: Icone,
  titulo,
  acao,
  children,
}: {
  tom: Tom;
  icone: LucideIcon;
  titulo: string;
  acao?: { rotulo: string; onClick: () => void };
  children: React.ReactNode;
}) {
  const t = TONS[tom];
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full" style={{ background: t.fundo }}>
          <Icone className="size-5" style={{ color: t.cor }} />
        </span>
        <div className="leading-tight">
          <h3 className="font-semibold text-foreground">{titulo}</h3>
          <span className="text-xs font-medium" style={{ color: t.cor }}>
            {t.etiqueta}
          </span>
        </div>
      </div>
      <p className="flex-1 text-sm leading-relaxed text-foreground">{children}</p>
      {acao && (
        <button
          type="button"
          onClick={acao.onClick}
          className="flex w-fit cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-primary-suave"
        >
          {acao.rotulo} <ArrowRight className="size-4" />
        </button>
      )}
    </article>
  );
}

function juntar(nomes: string[]) {
  return nomes.length < 2 ? nomes.join("") : `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;
}
