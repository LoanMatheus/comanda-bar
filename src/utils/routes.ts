export function comandaHref(id: string, criada = false): string {
  const params = new URLSearchParams({ id });
  if (criada) params.set("criada", "1");
  return `/comandas/detalhe?${params.toString()}`;
}
