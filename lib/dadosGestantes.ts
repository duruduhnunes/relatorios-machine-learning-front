import { Competencia, aleatorio, gerarResumo } from "./dadosSaude";
import {
  Paciente,
  NOMES_F,
  SOBRENOMES,
  UNIDADES,
  distribuirRiscos,
} from "./pacientes";

const doisDigitos = (n: number) => String(n).padStart(2, "0");

export function gerarGestantes(competencia: Competencia): Paciente[] {
  const resumo = gerarResumo(competencia);
  const indicador = resumo.indicadores.find((i) => i.id === "gestantes")!;
  const cobertura = resumo.cobertura.find((c) => c.id === "gestantes")!;
  const risco = resumo.risco.find((r) => r.id === "gestantes")!;

  const total = indicador.total;

  const comAcompanhamento = Math.round((total * cobertura.percentual) / 100);

  const [ano, mes] = competencia.split("-").map(Number);
  const ultimoDia = new Date(ano, mes, 0).getDate();
  const r = aleatorio(907 + ano * 12 + mes);

  const riscos = distribuirRiscos(total, risco, aleatorio(5501 + mes));

  return Array.from({ length: total }, (_, i) => {
    const nome = `${NOMES_F[Math.floor(r() * NOMES_F.length)]} ${SOBRENOMES[Math.floor(r() * SOBRENOMES.length)]} ${SOBRENOMES[Math.floor(r() * SOBRENOMES.length)]}`;
    const semanas = 4 + Math.floor(r() * 37);
    const acompanhada = i < comAcompanhamento;

    const consultas = acompanhada
      ? Math.max(1, Math.min(10, Math.round(semanas / 4.5) - (r() < 0.3 ? 1 : 0)))
      : 0;

    const data = new Date(ano, mes - 1, ultimoDia);
    data.setDate(data.getDate() - Math.floor(r() * 75));

    return {
      id: `G-${String(i + 1).padStart(4, "0")}`,
      nome,
      idade: 15 + Math.floor(r() * 28),
      unidade: UNIDADES[Math.floor(r() * UNIDADES.length)],
      exame: `${semanas} sem.`,
      consultas,
      ultimaConsulta: acompanhada
        ? `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`
        : null,
      risco: riscos[i],
    };
  });
}
