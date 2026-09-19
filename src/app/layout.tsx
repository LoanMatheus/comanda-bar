import { Header } from "@/components/ui";
import type { Metadata } from "next";
import "./tailwind.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "BarControl — Controle de comandas",
  description: "Controle rápido de comandas para bares",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="p-2">
        <Header />
        <main className="min-w-0">{children}</main>
        <footer className="site-footer">
          <span>BarControl © {new Date().getFullYear()}</span>
          <span>Feito para manter tudo em ordem.</span>
        </footer>
      </body>
    </html>
  );
}

