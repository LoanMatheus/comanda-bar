# BarControl

Sistema responsivo de controle de comandas para bar, feito com Next.js App Router e TypeScript.

## Executar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Verificar

```bash
npm run lint
npm run typecheck
npm run build
```

## Funcionalidades

- Abrir, buscar, editar e fechar comandas com comprovante de pagamento.
- Adicionar produtos do cardápio ou itens personalizados.
- Consultar comandas do dia e fechar o movimento, tornando pendentes as comandas abertas.
- Exportar comandas para Excel por período.

Os dados e comprovantes são armazenados no `localStorage` deste navegador. A camada em `src/services/comandas.ts` concentra a persistência para facilitar uma futura API. Como o armazenamento é local, os dados não são compartilhados entre dispositivos e imagens grandes podem atingir o limite de espaço do navegador.

## Estilos

O projeto inclui Tailwind CSS v4. As classes utilitárias podem ser usadas diretamente nos componentes; a configuração está em `postcss.config.mjs` e `src/app/tailwind.css`. O reset Preflight não é carregado para preservar o CSS existente em `src/app/globals.css`.
