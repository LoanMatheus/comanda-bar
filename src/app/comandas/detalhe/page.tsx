"use client";
import {
  ConsumptionSummary,
  PageHead,
  QuantitySelector,
  StatusBadge,
  Toast,
  useToast,
} from "@/components/ui";
import { menu } from "@/data/menu";
import { getComandaById, totalOf, updateComanda } from "@/services/comandas";
import type { Comanda, ComandaItem } from "@/types/comanda";
import { dateTime, money, number } from "@/utils/format";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FiArrowRight, FiBookOpen, FiPlus } from "react-icons/fi";
function Details() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const router = useRouter();
  const [comanda, setComanda] = useState<Comanda>();
  const [items, setItems] = useState<ComandaItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [custom, setCustom] = useState({ nome: "", quantidade: 1, preco: "" });
  const { toast, showToast } = useToast();
  useEffect(() => {
    const c = getComandaById(id);
    setComanda(c);
    setItems(c?.itens || []);
    setLoaded(true);
    if (params.get("criada")) showToast("Comanda criada com sucesso.");
  }, [id, params, showToast]);
  function setQuantity(
    product: { id: string; nome: string; preco: number },
    quantity: number,
  ) {
    setItems((current) => {
      const rest = current.filter((i) => i.id !== product.id);
      return quantity
        ? [
            ...rest,
            {
              id: product.id,
              nome: product.nome,
              quantidade: quantity,
              precoUnitario: product.preco,
            },
          ]
        : rest;
    });
  }
  function addCustom(e: React.FormEvent) {
    e.preventDefault();
    const price = Number(custom.preco.replace(",", "."));
    if (!custom.nome.trim() || !Number.isFinite(price) || price < 0)
      return showToast("Informe um nome e preço válido.");
    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        nome: custom.nome.trim(),
        quantidade: custom.quantidade,
        precoUnitario: price,
      },
    ]);
    setCustom({ nome: "", quantidade: 1, preco: "" });
    showToast("Item adicionado à comanda.");
  }
  function save() {
    try {
      const updated = updateComanda(id, items);
      setComanda(updated);
      setItems(updated.itens);
      router.push("/");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Erro ao salvar.");
    }
  }
  if (!loaded) return <div className="container inner-page">Carregando...</div>;
  if (!comanda)
    return (
      <div className="container inner-page">
        <PageHead eyebrow="COMANDA" title="Comanda não encontrada." />
      </div>
    );
  const editable = comanda.status === "ABERTA";
  const total = totalOf(items);
  return (
    <div className="container inner-page">
      <PageHead
        eyebrow={`COMANDA ${number(comanda.numero)}`}
        title={comanda.nome}
        description={`Aberta em ${dateTime(comanda.abertaEm)}`}
      />
      <div className="detail-meta">
        <StatusBadge status={comanda.status} />
        <span>Comanda {number(comanda.numero)}</span>
        <span>Aberta · {dateTime(comanda.abertaEm)}</span>
        {comanda.fechadaEm && (
          <span>Paga em {dateTime(comanda.fechadaEm)}</span>
        )}
      </div>
      {!editable && (
        <div className="notice">
          Esta comanda está disponível apenas para consulta.
        </div>
      )}
      <div className="detail-grid">
        <div className="detail-main">
          <section className="panel">
            <div className="section-heading">
              <span className="section-icon">
                <FiBookOpen aria-hidden="true" />
              </span>
              <div>
                <h2>Cardápio</h2>
                <p>Escolha os itens consumidos</p>
              </div>
            </div>
            <div className="menu-list">
              {menu.map((product) => {
                const quantity =
                  items.find((i) => i.id === product.id)?.quantidade || 0;
                return (
                  <div className="menu-row" key={product.id}>
                    <div className="menu-symbol">
                      {<FiBookOpen aria-hidden="true" />}
                    </div>
                    <div className="menu-info">
                      <b>{product.nome}</b>
                      <small>
                        <b>{money(product.preco)}</b>
                      </small>
                    </div>
                    <QuantitySelector
                      value={quantity}
                      disabled={!editable}
                      onChange={(value) => setQuantity(product, value)}
                    />
                  </div>
                );
              })}
            </div>
          </section>
          {editable && (
            <section className="panel">
              <div className="section-heading">
                <span className="section-icon">
                  <FiPlus aria-hidden="true" />
                </span>
                <div>
                  <h2>Adicionar outro item</h2>
                  <p>Para algo que não está no cardápio</p>
                </div>
              </div>
              <form onSubmit={addCustom} className="custom-form">
                <div>
                  <label htmlFor="item-name">Nome do item</label>
                  <input
                    id="item-name"
                    value={custom.nome}
                    onChange={(e) =>
                      setCustom({ ...custom, nome: e.target.value })
                    }
                    placeholder="Ex.: Porção de batata"
                    required
                  />
                </div>
                <div>
                  <label>Quantidade</label>
                  <QuantitySelector
                    value={custom.quantidade}
                    onChange={(value) =>
                      setCustom({ ...custom, quantidade: Math.max(1, value) })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="item-price">Preço unitário (R$)</label>
                  <input
                    id="item-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={custom.preco}
                    onChange={(e) =>
                      setCustom({ ...custom, preco: e.target.value })
                    }
                    placeholder="0,00"
                    required
                  />
                </div>
                <button className="button outline" type="submit">
                  <FiPlus aria-hidden="true" /> Adicionar item
                </button>
              </form>
              {items
                .filter((i) => !menu.some((m) => m.id === i.id))
                .map((item) => (
                  <div key={item.id} className="custom-item">
                    <span>
                      {item.quantidade}× {item.nome} ·{" "}
                      {money(item.precoUnitario)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setItems(items.filter((i) => i.id !== item.id))
                      }
                    >
                      Remover
                    </button>
                  </div>
                ))}
            </section>
          )}
        </div>
        <aside className="detail-side">
          <ConsumptionSummary items={items} total={total} />
          {editable && (
            <>
              <button
                className="button primary full save-button"
                onClick={save}
              >
                💾 Salvar alterações
              </button>
              <p className="save-hint">
                As alterações são aplicadas após salvar.
              </p>
              <Link className="button outline full" href="/comandas/fechar">
                Fechar comanda <FiArrowRight aria-hidden="true" />
              </Link>
            </>
          )}
        </aside>
      </div>
      <Toast message={toast} />
    </div>
  );
}
export default function ComandaPage() {
  return (
    <Suspense>
      <Details />
    </Suspense>
  );
}




