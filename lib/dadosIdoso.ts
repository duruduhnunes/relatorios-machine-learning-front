import { aleatorio, Competencia, gerarResumo } from "./dadosSaude";
import {
  distribuirRiscos,
  NOMES_F,
  NOMES_M,
  Paciente,
  SOBRENOMES,
  UNIDADES,
} from "./pacientes";

export function gerarIdosos(competencias: Competencia): Paciente[] {
  const resumo = gerarResumo(competencias);
  const indicador = resumo.indicadores.find((i) => i.id === "idosos")!;
  const cobertura = resumo.cobertura.find((c) => c.id === "idosos")!;
  const risco = resumo.risco.find((r) => r.id === "idosos")!;

  const total = indicador.total;
  const comAcompanhamento = Math.round((total * cobertura.percentual) / 100);

  const [ano, mes] = competencias.split("-").map(Number);
  const ultimoDia = new Date(ano, mes, 0).getDate();
  const r = aleatorio(431 + ano * 12 + mes);
  const riscos = distribuirRiscos(total, risco, aleatorio(7703 + mes));

  return Array.from({ length: total }, (_, i) => {
    const nomes = r() < 0.5 ? NOMES_M : NOMES_F;
    const nome = `${nomes[Math.floor(r() * nomes.length)]} ${SOBRENOMES[Math.floor(r() * SOBRENOMES.length)]}`;

    const acompanhado = i < comAcompanhamento;
    const idade = 60 + Math.floor(r() * 40);
    const consultas = acompanhado ? Math.floor(r() * 6) : 0;
    const comorbidades = Math.floor(r() * 4);

    const data = new Date(ano, mes - 1, ultimoDia);
    data.setDate(data.getDate() - Math.floor(r() * 75));

    return {
      id: `I-${String(i + 1).padStart(4, "0")}`,
      nome,
      idade,
      unidade: UNIDADES[Math.floor(r() * UNIDADES.length)],
      exame: String(comorbidades),
      consultas,
      ultimaConsulta: acompanhado
        ? `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`
        : null,
      risco: riscos[i],
    };
  });
}
