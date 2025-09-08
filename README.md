# API Ecommerce + Prisma (Atualizada)

## Requisitos atendidos
- Cadastro de cliente (nome, email)
- Todo pedido é vinculado a um cliente
- Buscar todos os pedidos de um cliente
- Status do pedido: `AGUARDANDO_PAGAMENTO` (default), `FALHA_NO_PAGAMENTO`, `PAGO`, `CANCELADO`
- Atualização de produto **sem estoque**; estoque possui endpoint dedicado
- Confirmar pagamento via endpoint (usa `Math.random()`)
  - Se todos métodos aprovarem → pedido **PAGO**
  - Se qualquer método falhar → pedido **CANCELADO**
- Endpoint para listar pagamentos de um pedido

## Como rodar
1. Suba o Postgres + pgAdmin com Docker (seu docker-compose)
2. Configure `.env` com:
```
DATABASE_URL="postgresql://postgres:naouseadmin@127.0.0.1:5432/ecommerce?schema=public"
```
3. Rode:
```
npx prisma migrate dev --name init
npm start
```

## Endpoints

### Clientes
- **POST /clientes**
```json
{ "nome": "Cliente 1", "email": "cliente1@email.com" }
```
- **GET /clientes/:id/pedidos**

### Produtos
- **PATCH /produtos/:id** (não aceita estoque)
```json
{ "nome": "Novo nome", "preco": 99.9 }
```
- **PATCH /produtos/:id/estoque**
```json
{ "estoque": 50 }
```

### Pedidos
- **POST /pedidos**
```json
{
  "clienteId": 1,
  "itens": [
    { "produtoId": 1, "quantidade": 2 },
    { "produtoId": 2, "quantidade": 1 }
  ]
}
```

### Pagamentos
- **PATCH /pagamentos/:id/confirmar**
```json
{
  "pagamentos": [
    { "metodo": "cartao", "valor": 120.00 },
    { "metodo": "pix", "valor": 30.00 }
  ]
}
```
- **GET /pagamentos/:id/pagamentos**

## Observações
- Estoque é debitado quando o pedido é criado.
- Use o pgAdmin em `http://localhost:5050` para verificar tabelas.
