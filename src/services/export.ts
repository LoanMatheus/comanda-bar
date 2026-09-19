import ExcelJS from "exceljs";
import type { Comanda } from "@/types/comanda";
import { date, time, localDay } from "@/utils/format";

export async function exportComandas(comandas: Comanda[]) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Comandas");
  sheet.columns = [
    { header: "ID da comanda", key: "id", width: 18 },
    { header: "Nome", key: "nome", width: 26 },
    { header: "Data", key: "data", width: 16 },
    { header: "Hora de abertura", key: "hora", width: 20 },
    { header: "Consumo", key: "consumo", width: 52 },
    { header: "Status", key: "status", width: 16 },
    { header: "Total", key: "total", width: 16 },
    { header: "Data de pagamento", key: "dataPagamento", width: 22 },
    { header: "Hora do pagamento", key: "horaPagamento", width: 22 },
  ];
  for (const c of comandas) sheet.addRow({
    id: c.numero, nome: c.nome, data: date(c.abertaEm), hora: time(c.abertaEm),
    consumo: c.itens.map(i => `${i.quantidade}x ${i.nome}`).join("; "),
    status: c.status, total: c.total,
    dataPagamento: c.fechadaEm ? date(c.fechadaEm) : "",
    horaPagamento: c.fechadaEm ? time(c.fechadaEm) : "",
  });
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF237C5B" } };
  sheet.getColumn("total").numFmt = '"R$" #,##0.00';
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `comandas-${localDay(new Date())}.xlsx`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
