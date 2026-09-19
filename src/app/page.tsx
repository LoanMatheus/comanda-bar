"use client";
import Link from "next/link";
import { ActionIcon, type ActionIconValue } from "@/components/action-icon";

const actions: {
  href: string;
  icon: ActionIconValue;
  label: string;
  desc: string;
  tone: string;
}[] = [
  {
    href: "/comandas/nova",
    icon: "📋",
    label: "Abrir Comanda",
    desc: "Inicie uma nova comanda",
    tone: "green",
  },
  {
    href: "/comandas/buscar",
    icon: "🔍",
    label: "Buscar Comanda",
    desc: "Encontre uma comanda",
    tone: "blue",
  },
  {
    href: "/comandas/fechar",
    icon: "✅",
    label: "Fechar Comanda",
    desc: "Finalize e registre o pagamento",
    tone: "orange",
  },
  {
    href: "/mais-opcoes",
    icon: "⚙️",
    label: "Mais Opções",
    desc: "Relatórios e configurações",
    tone: "purple",
  },
];

export default function Home() {
  return (
    <div className="reference-home">
      <div className="home-photo" aria-hidden="true" />
      <div className="reference-home-content">
        <div className="welcome">
          <h1>Bem-vindo!</h1>
          <p>O controle das suas comandas, de forma simples.</p>
        </div>
        <div className="reference-actions">
          {actions.map((action) => (
            <Link
              href={action.href}
              key={action.href}
              className={`reference-action ${action.tone}`}
            >
              <span className="reference-action-icon">
                <ActionIcon icon={action.icon} />
              </span>
              <strong>{action.label}</strong>
              <small>{action.desc}</small>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

