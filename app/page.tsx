"use client";

import { NavBar } from "@/components/navBar";
import { useState } from "react";
import { Menu } from "@/components/menu";
import { HomePage } from "@/components/homePage";

export default function Home() {
  const [menuAberto, setMenuaberto] = useState(false);
  return (
    <div className="flex h-screen flex-col">
      <NavBar onToggleMenu={() => setMenuaberto(!menuAberto)} />

      <div className="flex flex-1 overflow-hidden">
        {menuAberto && <Menu />}
        <main className="flex-1 overflow-auto p-4">
          <HomePage />
        </main>
      </div>
    </div>
  );
}
