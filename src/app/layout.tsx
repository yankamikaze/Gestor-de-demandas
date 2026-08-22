import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
              } else {
                document.documentElement.classList.remove('dark')
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} transition-colors duration-200`}>
        <nav className="bg-slate-900 text-white p-4 shadow-md dark:bg-black dark:border-b dark:border-slate-800 flex justify-between items-center">
          <h1 className="text-xl font-bold">Gestor de Demandas TI</h1>
          <div className="flex items-center space-x-6">
            <a href="/" className="hover:text-slate-300 dark:text-slate-300 dark:hover:text-white transition-colors">Painel (Matriz)</a>
            <a href="/concluidos" className="hover:text-slate-300 dark:text-slate-300 dark:hover:text-white transition-colors">Concluídos</a>
            <ThemeToggle />
          </div>
        </nav>
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
