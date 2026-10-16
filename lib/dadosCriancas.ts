import { aleatorio, Competencia, gerarResumo } from "./dadosSaude";
import {
  distribuirRiscos,
  NOMES_F,
  NOMES_M,
  Paciente,
  SOBRENOMES,
  UNIDADES,
} from "./pacientes";

export function gerarCriancas(competencia: Competencia): Paciente[] {
  const resumo = gerarResumo(competencia);
  const indicador = resumo.indicadores.find((i) => i.id === "criancas")!;
  const cobertura = resumo.cobertura.find((c) => c.id === "criancas")!;
  const risco = resumo.risco.find((r) => r.id === "criancas")!;

  const total = indicador.total;
  const comAcompanhamento = Math.round((total * cobertura.percentual) / 100);

  const [ano, mes] = competencia.split("-").map(Number);
  const ultimoDia = new Date(ano, mes, 0).getDate();
  const r = aleatorio(431 + ano * 12 + mes);
  const riscos = distribuirRiscos(total, risco, aleatorio(7703 + mes));

  return Array.from({ length: total }, (_, i) => {
    const nomes = r() < 0.5 ? NOMES_M : NOMES_F;
    const nome = `${nomes[Math.floor(r() * nomes.length)]} ${SOBRENOMES[Math.floor(r() * SOBRENOMES.length)]}`;

    const acompanhada = i < comAcompanhamento;
    const idade = 1 + Math.floor(r() * 12);
    const consultas = acompanhada ? Math.floor(r() * 6) : 0;
    const vacinaEmDia = r() > 0.2;

    const data = new Date(ano, mes - 1, ultimoDia);
    data.setDate(data.getDate() - Math.floor(r() * 75));

    return {
      id: `C-${String(i + 1).padStart(4, "0")}`,
      nome,
      idade,
      unidade: UNIDADES[Math.floor(r() * UNIDADES.length)],
      exame: vacinaEmDia ? "Em dia" : "Atrasada",
      consultas,
      ultimaConsulta: acompanhada
        ? `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`
        : null,
      risco: riscos[i],
    };
  });
}
