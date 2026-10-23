"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [esqueci, setEsqueci] = useState(false);

  function entrar(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !senha) {
      setErro("Preencha o seu e-mail e a sua senha para entrar.");
      return;
    }
    // Ainda não há API de login: por enquanto qualquer e-mail e senha entram no painel
    setErro("");
    router.push("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image src="/coracao.png" alt="" width={56} height={56} />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Saúde em Dados</h1>
            <p className="text-muted">Que bom ter você aqui! Entre para ver os dados do seu município.</p>
          </div>
        </div>

        <form onSubmit={entrar} noValidate className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
            E-mail
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@prefeitura.gov.br"
              className="rounded-xl border border-border bg-background px-4 py-3 text-base font-normal text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
            Senha
            <span className="relative">
              <input
                type={verSenha ? "text" : "password"}
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full rounded-xl border border-border bg-background py-3 pr-12 pl-4 text-base font-normal text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setVerSenha(!verSenha)}
                aria-label={verSenha ? "Esconder senha" : "Mostrar senha"}
                className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-lg p-2 text-muted hover:text-foreground"
              >
                {verSenha ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </span>
          </label>

          {erro && (
            <p role="alert" className="rounded-xl bg-aviso-suave px-4 py-3 text-sm text-foreground">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-semibold text-white shadow-sm hover:opacity-90"
          >
            <LogIn className="size-5" /> Entrar
          </button>
        </form>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => setEsqueci(!esqueci)}
            className="cursor-pointer font-medium text-primary hover:underline"
          >
            Esqueci minha senha
          </button>
          {esqueci && (
            <p className="mt-2 text-muted">
              Sem problema! Fale com o responsável pelo sistema na Secretaria de Saúde para criar uma senha nova.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
