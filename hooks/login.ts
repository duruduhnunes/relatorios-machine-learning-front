import { BackendURL } from "./backendURL";

export type RespostaLogin = {
  access_token: string;
  token_type: string;
};

export async function fazerLogin(
  email: string,
  senha: string,
): Promise<RespostaLogin> {
  try {
    const resposta = await fetch(BackendURL("/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password: senha }),
    });

    if (!resposta.ok) {
      const corpo: { detail?: string } | null = await resposta
        .json()
        .catch(() => null);
      throw new Error(corpo?.detail ?? "Erro ao fazer login");
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
