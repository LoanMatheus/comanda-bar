"use client";
import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { PageHead, Toast, useToast } from "@/components/ui";
import { getComandasByDate } from "@/services/comandas";
import { exportComandas } from "@/services/export";
import { localDay } from "@/utils/format";
type Period = "hoje" | "ontem" | "semana" | "personalizado";
export default function Planilha() {
  const [period, setPeriod] = useState<Period>("hoje");
  const [start, setStart] = useState(localDay(new Date()));
  const [end, setEnd] = useState(localDay(new Date()));
  const { toast, showToast } = useToast();
  async function exportNow() {
    const now = new Date();
    let from = localDay(now), to = from;
    if (period === "ontem") { now.setDate(now.getDate() - 1); from = to = localDay(now); }
    if (period === "semana") { now.setDate(now.getDate() - 6); from = localDay(now); }
    if (period === "personalizado") { from = start; to = end; }
    if (!from || !to || from > to) return showToast("Informe um período válido.");
    const rows = getComandasByDate(from, to);
    if (!rows.length) return showToast("Nenhuma comanda encontrada neste período.");
    try { await exportComandas(rows); } catch { return showToast("Não foi possível gerar a planilha."); }
    showToast(`Planilha gerada com ${rows.length} ${rows.length === 1 ? "comanda" : "comandas"}.`);
  }
  return <div className="container inner-page"><PageHead eyebrow="RELATÓRIOS" title="Gerar planilha" back="/mais-opcoes" /><div className="panel report-panel"><div className="section-heading"><div><h2>Escolha o período</h2><p>O arquivo incluirá todas as comandas abertas no período</p></div></div><div className="period-grid">{([["hoje", "Hoje"], ["ontem", "Ontem"], ["semana", "Últimos 7 dias"], ["personalizado", "Período personalizado"]] as [Period, string][]).map(([value, label]) => <button type="button" key={value} className={`period ${period === value ? "active" : ""}`} onClick={() => setPeriod(value)}><span className="radio-dot" />{label}</button>)}</div>{period === "personalizado" && <div className="date-fields"><div><label htmlFor="start">Data inicial</label><input id="start" type="date" value={start} onChange={e => setStart(e.target.value)} /></div><div><label htmlFor="end">Data final</label><input id="end" type="date" value={end} onChange={e => setEnd(e.target.value)} /></div></div>}<button className="button primary" onClick={exportNow}><FiDownload aria-hidden="true" /> Gerar planilha Excel</button></div><Toast message={toast} /></div>;
}
