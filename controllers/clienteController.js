const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createCliente = async (req, res) => {
  try {
    const { nome, email } = req.body;
    if (!nome || !email) return res.status(400).json({ error: 'nome e email são obrigatórios' });
    const cliente = await prisma.cliente.create({ data: { nome, email } });
    res.status(201).json(cliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPedidosByCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const pedidos = await prisma.pedido.findMany({
      where: { clienteId: Number(id) },
      include: { itens: true, pagamentos: true }
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
