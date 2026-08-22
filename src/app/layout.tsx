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
        <nav className="border-b border-neutral-800 bg-neutral-900/80 p-4 sticky top-0 z-10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-tight text-white">Demandas TI</h1>
            <div className="space-x-6 text-sm font-medium">
              <a href="/" className="text-neutral-400 hover:text-white transition-colors">Matriz</a>
              <a href="/concluidos" className="text-neutral-400 hover:text-white transition-colors">Concluídos</a>
            </div>
          </div>
        </nav>
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
