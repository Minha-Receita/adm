import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/sidebar";

export const metadata: Metadata = {
  title: "Minha receita Adm",
  description: "Painel administrativo do Minha Receita",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="bg-zinc-100" lang="pt-BR">
      <body className="h-screen flex">

        {/* Sidebar fixa */}
        <Sidebar />

        {/* Container da área principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header fixo no topo da área principal */}
          <header className="bg-zinc-50 p-4 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold bg-amber-500 p-2 text-white rounded-2xl">
              Minha Receita
            </h1>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="#" className="hover:underline">Home</a></li>
                <li><a href="#" className="hover:underline">Sobre</a></li>
                <li><a href="#" className="hover:underline">Contato</a></li>
              </ul>
            </nav>
          </header>

          {/* Conteúdo da página com scroll individual */}
          <main className="flex-1 overflow-auto p-6 bg-zinc-100">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}
