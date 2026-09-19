"use client";
import Link from "next/link";
import { comandaHref } from "@/utils/routes";
import { FiSearch, FiPlus } from "react-icons/fi";
import { useState } from "react";
import { ComandaCard, EmptyState, PageHead } from "@/components/ui";
import { searchComandas } from "@/services/comandas";
import type { Comanda } from "@/types/comanda";
export default function Buscar() { const [query,setQuery] = useState(""); const [searched,setSearched] = useState(""); const [results,setResults] = useState<Comanda[]>([]); function search(e:React.FormEvent) { e.preventDefault(); setSearched(query.trim()); setResults(query.trim() ? searchComandas(query) : []); } return <div className="container inner-page"><PageHead eyebrow="LOCALIZAR COMANDA" title="Encontre uma comanda." description="Busque pelo nome completo ou apenas parte dele."/><div className="form-card search-panel"><form onSubmit={search}><label htmlFor="query">Nome da pessoa</label><div className="search-form"><input id="query" placeholder="Digite um nome para buscar..." value={query} onChange={e=>setQuery(e.target.value)}/><button className="button primary"><FiSearch aria-hidden="true" /> Buscar</button></div></form></div>{searched && <section className="results"><div className="list-heading"><h2>Resultados da busca <span>{results.length}</span></h2><p>Para “{searched}”</p></div>{results.length ? <div className="card-grid">{results.map(c=><ComandaCard key={c.id} comanda={c} href={comandaHref(c.id)}/>)}</div> : <EmptyState title={`Nenhuma comanda encontrada para “${searched}”.`} description="Deseja abrir uma nova comanda para essa pessoa?" action={<Link className="button primary" href={`/comandas/nova?nome=${encodeURIComponent(searched)}`}><FiPlus aria-hidden="true" /> Abrir nova comanda</Link>}/>}</section>}</div>; }


