"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { comandaHref } from "@/utils/routes";
import { Suspense, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { PageHead, Toast, useToast } from "@/components/ui";
import { createComanda } from "@/services/comandas";

function NewForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [nome, setNome] = useState(params.get("nome") || "");
  const [busy, setBusy] = useState(false);
  const { toast, showToast } = useToast();
  function submit(e: React.FormEvent) {
    e.preventDefault();
    try { setBusy(true); const c = createComanda(nome); router.push(comandaHref(c.id, true)); }
    catch (error) { showToast(error instanceof Error ? error.message : "Não foi possível criar a comanda."); setBusy(false); }
  }
  return <div className="container inner-page new-page">
    <PageHead eyebrow="NOVA COMANDA" title="Nova Comanda" />
    <div className="steps" aria-label="Etapas da comanda"><div className="active"><b>1</b><span>Nome</span></div><i/><div><b>2</b><span>Comanda</span></div><i/><div><b>3</b><span>Concluído</span></div></div>
    <form onSubmit={submit}>
      <div className="form-card narrow"><label htmlFor="nome">Nome da pessoa <b>*</b></label><input id="nome" autoFocus required maxLength={100} placeholder="Nome da pessoa" value={nome} onChange={e => setNome(e.target.value)} /></div>
      <button className="button primary full" disabled={busy}>{busy ? "Criando..." : <>Continuar <FiArrowRight aria-hidden="true" /></>}</button>
    </form>
    <Toast message={toast} />
  </div>;
}
export default function Nova() { return <Suspense><NewForm /></Suspense>; }


