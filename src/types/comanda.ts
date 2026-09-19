export type ComandaStatus = "ABERTA" | "PAGA" | "PENDENTE";
export type ComandaItem = { id: string; nome: string; quantidade: number; precoUnitario: number };
export type Comprovante = { nomeArquivo: string; tipo: string; url: string };
export type Comanda = { id: string; numero: number; nome: string; status: ComandaStatus; itens: ComandaItem[]; total: number; abertaEm: string; fechadaEm?: string; pendenteEm?: string; comprovante?: Comprovante };
export type RegistroDiario = { id: string; fechadoEm: string; quantidade: number; totalRecebido: number; totalPendente: number };
