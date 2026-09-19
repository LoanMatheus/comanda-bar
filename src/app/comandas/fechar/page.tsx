"use client";
/* eslint-disable @next/next/no-img-element -- Prévia local do comprovante enviado. */
import Link from "next/link";
import { comandaHref } from "@/utils/routes";
import { useState } from "react";
import { FiArrowLeft, FiCamera, FiCheck, FiPlus, FiSearch, FiUploadCloud } from "react-icons/fi";
import { ConsumptionSummary, EmptyState, PageHead, StatusBadge, Toast, useToast } from "@/components/ui";
import { closeComanda, searchComandas } from "@/services/comandas";
import type { Comanda, Comprovante } from "@/types/comanda";
import { dateTime, money, number } from "@/utils/format";

export default function Fechar() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Comanda[]>([]);
  const [selected, setSelected] = useState<Comanda>();
  const [proof, setProof] = useState<Comprovante>();
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const { toast, showToast } = useToast();

  function search(e: React.FormEvent) {
    e.preventDefault();
    setSearched(true);
    setSelected(undefined);
    setResults(query.trim() ? searchComandas(query, true) : []);
  }
  function attach(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) return showToast("Use um arquivo JPG, PNG ou PDF.");
    const reader = new FileReader();
    reader.onload = () => { setProof({ nomeArquivo: file.name, tipo: file.type, url: String(reader.result) }); showToast("Comprovante anexado."); };
    reader.onerror = () => showToast("Não foi possível ler o arquivo.");
    reader.readAsDataURL(file);
  }
  function finish() {
    if (!selected || !proof) return;
    try { setSelected(closeComanda(selected.id, proof)); setDone(true); setConfirm(false); showToast("Comanda fechada com sucesso."); }
    catch (e) { showToast(e instanceof Error ? e.message : "Erro ao fechar comanda."); }
  }
  return <div className="container inner-page">
    <PageHead eyebrow="FINALIZAR PAGAMENTO" title="Fechar comanda" />
    {done && selected ? <div className="success-card">
      <div className="success-icon"><FiCheck aria-hidden="true" /></div>
      <h2>Comanda fechada com sucesso.</h2><p>{selected.nome} · Comanda {number(selected.numero)}</p>
      <div className="success-actions"><Link className="button primary" href="/">Voltar ao início</Link><Link className="button outline" href={comandaHref(selected.id)}>Visualizar comanda</Link><button className="button outline" onClick={() => { setDone(false); setSelected(undefined); setProof(undefined); setQuery(""); setSearched(false); }}>Fechar outra comanda</button></div>
    </div> : <>
      {!selected && <>
        <div className="form-card search-panel"><form onSubmit={search}><label htmlFor="close-query">Nome da pessoa</label><div className="search-form"><input id="close-query" placeholder="Digite o nome da pessoa..." value={query} onChange={e => setQuery(e.target.value)} /><button className="button primary"><FiSearch aria-hidden="true" /> Buscar</button></div></form></div>
        {searched && <section className="results"><div className="list-heading"><h2>Comandas abertas <span>{results.length}</span></h2></div>
          {results.length ? <div className="card-grid">{results.map(c => <button key={c.id} className="card-button result-card" onClick={() => setSelected(c)}><div className="result-top"><div><strong>{c.nome}</strong><small>Aberta em: {dateTime(c.abertaEm)}</small></div><span className="result-number">{number(c.numero)}</span></div><div className="result-bottom"><span>Status: <StatusBadge status={c.status} /></span><span>Total atual: <strong>{money(c.total)}</strong></span></div></button>)}</div> : <EmptyState title="Nenhuma comanda aberta encontrada." description="Confira o nome informado ou abra uma nova comanda." action={<Link href="/comandas/nova" className="button primary"><FiPlus aria-hidden="true" /> Abrir nova comanda</Link>} />}
        </section>}
      </>}
      {selected && <div className="detail-grid"><div className="detail-main">
        <div className="panel"><div className="payment-header"><div><span className="eyebrow">COMANDA {number(selected.numero)}</span><h2>{selected.nome}</h2><p>Aberta em {dateTime(selected.abertaEm)}</p></div><StatusBadge status={selected.status} /></div><button className="text-button" onClick={() => { setSelected(undefined); setProof(undefined); }}><FiArrowLeft aria-hidden="true" /> Escolher outra comanda</button></div>
        <div className="panel"><div className="section-heading"><div><h2>Comprovante de pagamento</h2><p>Obrigatório para finalizar esta comanda</p></div></div>
          <label className="upload-zone" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); attach(e.dataTransfer.files[0]); }}><input type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" onChange={e => attach(e.target.files?.[0])} /><span><FiUploadCloud aria-hidden="true" /></span><strong>Clique para anexar ou arraste o arquivo aqui</strong><small>JPG, PNG ou PDF</small></label>
          <label className="camera-label"><FiCamera aria-hidden="true" /> Usar câmera<input type="file" accept="image/*" capture="environment" onChange={e => attach(e.target.files?.[0])} /></label>
          {proof && <div className="proof-preview"><span><FiCheck aria-hidden="true" /> {proof.nomeArquivo}</span>{proof.tipo.startsWith("image/") && <img src={proof.url} alt="Prévia do comprovante" />}</div>}
        </div>
      </div><aside className="detail-side"><ConsumptionSummary items={selected.itens} total={selected.total} /><button className="button primary full save-button" disabled={!proof} onClick={() => setConfirm(true)}><FiCheck aria-hidden="true" /> Fechar comanda</button><p className="save-hint">Registrar como paga</p></aside></div>}
    </>}
    {confirm && <div className="modal-backdrop"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><span className="modal-icon"><FiCheck aria-hidden="true" /></span><h2 id="confirm-title">Confirmar pagamento?</h2><p>A comanda será registrada como paga. Esta ação não pode ser desfeita.</p><div className="modal-actions"><button className="button outline" onClick={() => setConfirm(false)}>Cancelar</button><button className="button primary" onClick={finish}>Confirmar fechamento</button></div></div></div>}
    <Toast message={toast} />
  </div>;
}

