import { BackendURL } from "./backendURL";
import { lerToken, sair } from "./token";

export type RespostaChatBoot = {
  tipo: string;
  texto: string;
  intencao: string;
  parametros: Record<string, unknown>;
  dados: unknown;
};

export async function enviarMensagemChatBoot(
  mensagem: string,
): Promise<RespostaChatBoot> {
  const token = lerToken();

  try {
    const resposta = await fetch(BackendURL("/chat"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ mensagem }),
    });

    if (!resposta.ok) {
      if (resposta.status === 401) sair();
      const corpo: { texto?: string; detail?: string } | null = await resposta
        .json()
        .catch(() => null);
      const detalhe = corpo?.texto ?? corpo?.detail ?? resposta.statusText;
      throw new Error(`${resposta.status} — ${detalhe}`);
    }

    return await resposta.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Não foi possível falar com o servidor. Verifique se ele está no ar.",
      );
    }
    throw error;
  }
}
