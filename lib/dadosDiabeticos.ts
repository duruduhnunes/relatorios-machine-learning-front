import { aleatorio, Competencia, gerarResumo } from "./dadosSaude";
import {
  distribuirRiscos,
  NOMES_F,
  NOMES_M,
  Paciente,
  SOBRENOMES,
  UNIDADES,
} from "./pacientes";

export function gerarDiabeticos(competencia: Competencia): Paciente[] {
  const resumo = gerarResumo(competencia);
  const indicador = resumo.indicadores.find((i) => i.id === "diabeticos")!;
  const cobertura = resumo.cobertura.find((c) => c.id === "diabeticos")!;
  const risco = resumo.risco.find((r) => r.id === "diabeticos")!;

  const total = indicador.total;
  const comAcompanhamento = Math.round((total * cobertura.percentual) / 100);

  const [ano, mes] = competencia.split("-").map(Number);
  const ultimoDia = new Date(ano, mes, 0).getDate();
  const r = aleatorio(431 + ano * 12 + mes);
  const riscos = distribuirRiscos(total, risco, aleatorio(7703 + mes));

  return Array.from({ length: total }, (_, i) => {
    const nomes = r() < 0.5 ? NOMES_M : NOMES_F;
    const nome = `${nomes[Math.floor(r() * nomes.length)]} ${SOBRENOMES[Math.floor(r() * SOBRENOMES.length)]}`;

    const acompanhado = i < comAcompanhamento;
    const glicada = Number((5 + r() * 7).toFixed(1));
    const consultas = acompanhado ? Math.floor(r() * 6) : 0;

    const data = new Date(ano, mes - 1, ultimoDia);
    data.setDate(data.getDate() - Math.floor(r() * 75));

    return {
      id: `D-${String(i + 1).padStart(4, "0")}`,
      nome,
      idade: 30 + Math.floor(r() * 40),
      unidade: UNIDADES[Math.floor(r() * UNIDADES.length)],
      exame: `${glicada.toFixed(1).replace(".", ",")}%`,
      consultas,
      ultimaConsulta: acompanhado
        ? `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`
        : null,
      risco: riscos[i],
    };
  });
}
