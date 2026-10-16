"use client";

import { NavBar } from "@/components/navBar";
import { useState } from "react";
import { Menu } from "@/components/menu";
import { HomePage } from "@/components/homePage";
import { AssistenteFlutuante } from "@/components/assistente/botao";
import { AssistentePainel } from "@/components/assistente/painel";
import { Competencia } from "@/lib/dadosSaude";

export default function Home() {
  const [menuAberto, setMenuaberto] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);
  // Fica aqui para o assistente responder sobre a mesma competência do painel
  const [competencia, setCompetencia] = useState<Competencia>("2026-09");

  return (
    <div className="flex h-screen flex-col">
      <NavBar onToggleMenu={() => setMenuaberto(!menuAberto)} />

      <div className="flex flex-1 overflow-hidden">
        {menuAberto && <Menu />}
        <main className="flex-1 overflow-auto p-4">
          <HomePage
            competencia={competencia}
            onCompetenciaChange={setCompetencia}
          />
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
