"use client";
import type { Comanda, ComandaItem, ComandaStatus } from "@/types/comanda";
import { dateTime, money, number } from "@/utils/format";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  FiCheck,
  FiFileText,
  FiMinus,
  FiPlus,
} from "react-icons/fi";

export function Header() {
  const [now, setNow] = useState<Date>();
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark">🍺</span>
          <span>BarControl</span>
        </Link>
        <span className="header-date">
          {now
            ? new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(now)
            : ""}
        </span>
      </div>
    </header>
  );
}
export function PageHead({
  title,
  back = "/",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  back?: string;
}) {
  return (
    <div className="page-head">
      <Link className="back-link" href={back}>
        ↩ <h3>Voltar</h3>
      </Link>
      <h3>{title}</h3>
    </div>
  );
}
export function StatusBadge({ status }: { status: ComandaStatus }) {
  return (
    <span className={`status status-${status.toLowerCase()}`}>
      {status === "ABERTA" ? "Aberta" : status === "PAGA" ? "Paga" : "Pendente"}
    </span>
  );
}
export function QuantitySelector({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="quantity">
      <button
        type="button"
        aria-label="Diminuir quantidade"
        disabled={disabled || value <= 0}
        onClick={() => onChange(Math.max(0, value - 1))}
      >
        <FiMinus aria-hidden="true" />
      </button>
      <span>{value}</span>
      <button
        type="button"
        aria-label="Aumentar quantidade"
        disabled={disabled}
        onClick={() => onChange(value + 1)}
      >
        <FiPlus aria-hidden="true" />
      </button>
    </div>
  );
}
export function ConsumptionSummary({
  items,
  total,
}: {
  items: ComandaItem[];
  total: number;
}) {
  return (
    <div className="summary">
      <div className="section-heading">
        <h2>Seu consumo</h2>
      </div>
      <div className="summary-list">
        {items.length ? (
          items.map((item) => (
            <div className="summary-row" key={item.id}>
              <div>
                <strong>{item.nome}</strong>
                <small>
                  {item.quantidade} x {money(item.precoUnitario)}
                </small>
              </div>
              <strong>{money(item.quantidade * item.precoUnitario)}</strong>
            </div>
          ))
        ) : (
          <div className="empty-consumption">
            <p>Nenhum item adicionado ainda.</p>
          </div>
        )}
      </div>
      <div className="summary-total">
        <span>Total</span>
        <strong>{money(total)}</strong>
      </div>
    </div>
  );
}
export function ComandaCard({
  comanda,
  href,
}: {
  comanda: Comanda;
  href: string;
}) {
  return (
    <Link href={href} className="result-card">
      <div className="result-top">
        <div>
          <strong>{comanda.nome}</strong>
          <small>Aberta em: {dateTime(comanda.abertaEm)}</small>
        </div>
        <span className="result-number">{number(comanda.numero)}</span>
      </div>
      <div className="result-bottom">
        <span>
          Status: &nbsp;
          <StatusBadge status={comanda.status} />
        </span>
        <span>
          Total atual: &nbsp;<strong>{money(comanda.total)}</strong>
        </span>
      </div>
    </Link>
  );
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <FiFileText aria-hidden="true" />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function useToast() {
  const [toast, setToast] = useState("");
  const showToast = useCallback((message: string) => setToast(message), []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);
  return { toast, showToast };
}
export function Toast({ message }: { message: string }) {
  return message ? (
    <div className="toast" role="status">
      <FiCheck aria-hidden="true" /> {message}
    </div>
  ) : null;
}

