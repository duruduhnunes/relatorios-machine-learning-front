import { AlertTriangle, CalendarCheck, TrendingDown, TrendingUp } from "lucide-react";
import { ResumoGeral, mesPorExtenso, numero, pessoasEmRiscoAlto } from "@/lib/dadosSaude";

// Os três recados mais importantes do mês, em frases simples
export function ResumoDoMes({ resumo }: { resumo: ResumoGeral }) {
  const pontos = resumo.atendimentos;
  const ultimoFeito = [...pontos].reverse().find((p) => p.realizado !== null)!;
  const ultimoEsperado = pontos[pontos.length - 1];
  const esperado = ultimoEsperado.previsto!;
  const variacao = Math.round(((esperado - ultimoFeito.realizado!) / ultimoFeito.realizado!) * 100);
  const Seta = variacao >= 0 ? TrendingUp : TrendingDown;

  const abaixo = resumo.cobertura.filter((c) => c.percentual < resumo.meta);
  const risco = pessoasEmRiscoAlto(resumo.risco, resumo.indicadores)[0];

  return (
    <section className="rounded-xl border border-primary/30 bg-primary/5 p-5">
      <h2 className="mb-3 text-base font-semibold text-foreground">O que você precisa saber este mês</h2>
      <ul className="flex flex-col gap-3 text-sm text-foreground">
        <li className="flex items-start gap-3">
          <Seta className="mt-0.5 size-5 shrink-0 text-primary" />
          <span>
            Esperamos cerca de <strong>{numero(esperado)} atendimentos</strong> em {mesPorExtenso(ultimoEsperado.mes)},{" "}
            {variacao === 0
              ? "o mesmo que hoje."
              : `${Math.abs(variacao)}% ${variacao > 0 ? "a mais" : "a menos"} que em ${mesPorExtenso(ultimoFeito.mes)}.`}
          </span>
        </li>
        <li className="flex items-start gap-3">
          <CalendarCheck className="mt-0.5 size-5 shrink-0 text-primary" />
          <span>
            {abaixo.length === 0 ? (
              <>Todos os grupos estão com o acompanhamento em dia acima da meta de {resumo.meta}%.</>
            ) : (
              <>
                <strong>
                  {abaixo.length} de {resumo.cobertura.length} grupos
                </strong>{" "}
                ainda não bateram a meta de acompanhamento ({resumo.meta}%): {juntar(abaixo.map((c) => c.nome))}.
              </>
            )}
          </span>
        </li>
        <li className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" style={{ color: "var(--risco-alto)" }} />
          <span>
            <strong>{risco.nome}</strong> é o grupo com mais pessoas precisando de atenção:{" "}
            <strong>{numero(risco.pessoas)} pessoas</strong> em risco alto.
          </span>
        </li>
      </ul>
    </section>
  );
}

function juntar(nomes: string[]) {
  return nomes.length < 2 ? nomes.join("") : `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;
}
