"use client";

import { NavBar } from "@/components/navBar";
import { useState } from "react";
import { Menu, SecaoId } from "@/components/menu";
import { HomePage } from "@/components/homePage";
import { PaginaGestantes } from "@/components/paginas/gestantes";
import { AssistenteFlutuante } from "@/components/assistente/botao";
import { AssistentePainel } from "@/components/assistente/painel";
import { Competencia } from "@/lib/dadosSaude";
import { PaginaDiabeticos } from "@/components/paginas/diabeticos";
import { PaginaHipertensos } from "@/components/paginas/hipertensos";
import { PaginaCriancas } from "@/components/paginas/criancas";
import { PaginaIdoso } from "@/components/paginas/idoso";

export default function Home() {
  const [menuAberto, setMenuaberto] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);
  const [secao, setSecao] = useState<SecaoId>("resumo");
  const [competencia, setCompetencia] = useState<Competencia>("2026-09");

  return (
    <div className="flex h-screen flex-col">
      <NavBar onToggleMenu={() => setMenuaberto(!menuAberto)} />

      <div className="flex flex-1 overflow-hidden">
        {menuAberto && <Menu secao={secao} onSelecionar={setSecao} />}
        <main className="flex-1 overflow-auto p-4">
          {secao === "resumo" ? (
            <HomePage
              competencia={competencia}
              onCompetenciaChange={setCompetencia}
            />
          ) : secao === "gestantes" ? (
            <PaginaGestantes
              competencia={competencia}
              onCompetenciaChange={setCompetencia}
            />
          ) : secao === "diabeticos" ? (
            <PaginaDiabeticos
              competencia={competencia}
              onCompetenciaChange={setCompetencia}
            />
          ) : secao === "hipertensos" ? (
            <PaginaHipertensos
              competencia={competencia}
              onCompetenciaChange={setCompetencia}
            />
          ) : secao === "criancas" ? (
            <PaginaCriancas
              competencia={competencia}
              onCompetenciaChange={setCompetencia}
            />
          ) : secao === "idosos" ? (
            <PaginaIdoso
              competencia={competencia}
              onCompetenciaChange={setCompetencia}
            />
          ) : (
            <div className="text-center text-gray-500">
              <h2 className="text-2xl font-bold">Nada pra mostrar aqui...</h2>
            </div>
          )}
        </main>
      </div>

      <AssistenteFlutuante
        oculto={chatAberto}
        onAbrir={() => setChatAberto(true)}
      />
      <AssistentePainel
        competencia={competencia}
        aberto={chatAberto}
        onFechar={() => setChatAberto(false)}
      />
    </div>
  );
}
