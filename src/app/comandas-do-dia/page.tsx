"use client";
import Link from "next/link";
import { comandaHref } from "@/utils/routes";
import { FiArrowUpRight, FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";
import { EmptyState, PageHead, StatusBadge } from "@/components/ui";
import { getComandas } from "@/services/comandas";
import type { Comanda, ComandaStatus } from "@/types/comanda";
import { localDay, money, number, time } from "@/utils/format";
type Filter = "TODAS" | ComandaStatus;
export default function ComandasDoDia() { const [all,setAll] = useState<Comanda[]>([]); const [filter,setFilter] = useState<Filter>("TODAS"); const [query,setQuery] = useState(""); useEffect(()=>setAll(getComandas().filter(c=>localDay(c.abertaEm)===localDay(new Date()))),[]); const shown = all.filter(c=>(filter==="TODAS" || c.status===filter) && c.nome.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))); return <div className="container inner-page"><PageHead eyebrow="MOVIMENTO DE HOJE" title="Comandas do dia." description="Acompanhe todas as comandas abertas hoje." back="/mais-opcoes"/><div className="filter-bar"><div className="filter-tabs">{([ ["TODAS","Todas"],["ABERTA","Abertas"],["PAGA","Pagas"],["PENDENTE","Pendentes"] ] as [Filter,string][]).map(([value,label])=><button className={filter===value ? "active" : ""} onClick={()=>setFilter(value)} key={value}>{label}</button>)}</div><input aria-label="Buscar por nome" placeholder="Buscar por nome..." value={query} onChange={e=>setQuery(e.target.value)}/></div>{shown.length ? <div className="table-scroll"><table><thead><tr><th>Número</th><th>Nome</th><th>Horário</th><th>Status</th><th>Total</th><th>Ações</th></tr></thead><tbody>{shown.map(c=><tr key={c.id}><td>{number(c.numero)}</td><td><strong>{c.nome}</strong></td><td>{time(c.abertaEm)}</td><td><StatusBadge status={c.status}/></td><td><strong>{money(c.total)}</strong></td><td><Link href={comandaHref(c.id)}>Visualizar <FiArrowUpRight aria-hidden="true" /></Link></td></tr>)}</tbody></table></div> : <EmptyState title="Nenhuma comanda encontrada." description="Ajuste os filtros ou abra a primeira comanda do dia." action={<Link className="button primary" href="/comandas/nova"><FiPlus aria-hidden="true" /> Abrir comanda</Link>}/>}</div>; }



