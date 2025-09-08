// server.js (atualizado)
const express = require('express');
const app = express();
const port = 3000;

// Rotas
const produtoRoutes = require('./routes/produtoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');

app.use(express.json());

app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/clientes', clienteRoutes);
app.use('/pagamentos', pagamentoRoutes);

app.get('/', (req, res) => res.json({ ok: true, msg: 'API Ecommerce + Prisma' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
