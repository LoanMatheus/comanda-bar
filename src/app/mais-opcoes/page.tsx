"use client";
import Link from "next/link";
import { ActionIcon, type ActionIconValue } from "@/components/action-icon";
import { FiPower, FiFileText, FiList, FiSettings, FiInfo, FiChevronRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import { PageHead } from "@/components/ui";
import { getComandas } from "@/services/comandas";
import { localDay, money } from "@/utils/format";
import type { Comanda } from "@/types/comanda";
const options: { href: string; icon: ActionIconValue; title: string; description: string; tone: string }[] = [
  { href: "/mais-opcoes/fechar-dia", icon: FiPower, title: "Fechar registro do dia", description: "Fecha todas as comandas abertas como pendentes", tone: "red" },
  { href: "/mais-opcoes/planilha", icon: FiFileText, title: "Gerar planilha (Excel)", description: "Exporta todas as comandas do período", tone: "blue" },
  { href: "/comandas-do-dia", icon: FiList, title: "Comandas do dia", description: "Visualize todas as comandas", tone: "green" },
  { href: "/mais-opcoes/configuracoes", icon: FiSettings, title: "Configurações", description: "Ajustes do sistema", tone: "purple" },
];
export default function MaisOpcoes() {
  const [items, setItems] = useState<Comanda[]>([]);
  useEffect(() => setItems(getComandas().filter(c => localDay(c.abertaEm) === localDay(new Date()))), []);
  const pagas = items.filter(c => c.status === "PAGA");
  const pendentes = items.filter(c => c.status === "PENDENTE");
  return <div className="container inner-page"><PageHead eyebrow="GESTÃO DO BAR" title="Mais Opções" />
    <div className="options-grid">{options.map(option => <Link className={`option-card ${option.tone}`} href={option.href} key={option.href}><span className="option-icon"><ActionIcon icon={option.icon} /></span><div><h2>{option.title}</h2><p>{option.description}</p></div><span className="option-arrow"><FiChevronRight aria-hidden="true" /></span></Link>)}
      <div className="today-summary"><span className="today-info"><FiInfo aria-hidden="true" /></span><div><strong>Resumo do dia</strong><p>Comandas pagas: {pagas.length}<br />Comandas pendentes: {pendentes.length}<br />Total em consumo: <b>{money(items.reduce((sum, item) => sum + item.total, 0))}</b></p></div></div>
    </div>
  </div>;
}


