const CHAVE = "token";

export function salvarToken(token: string) {
  localStorage.setItem(CHAVE, token);
}

export function lerToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CHAVE);
}

export function apagarToken() {
  localStorage.removeItem(CHAVE);
}

export function sair() {
  apagarToken();
  window.location.replace("/login");
}
