import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestor de Demandas TI",
  description: "Matriz de Eisenhower",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <nav className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center">
          <h1 className="text-xl font-bold">Gestor de Demandas TI</h1>
          <div className="space-x-4">
            <a href="/" className="hover:text-slate-300">Painel (Matriz)</a>
            <a href="/concluidos" className="hover:text-slate-300">Concluídos</a>
          </div>
        </nav>
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
