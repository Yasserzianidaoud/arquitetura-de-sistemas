const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPedido = async (req, res) => {
  try {
    const { clienteId, itens } = req.body;
    if (!clienteId || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'clienteId e itens[] são obrigatórios' });
    }

    // calcula totais e confere estoque
    let valorTotal = 0;
    const itensCreate = [];
    for (const item of itens) {
      const produto = await prisma.produto.findUnique({ where: { id: Number(item.produtoId) } });
      if (!produto) return res.status(404).json({ error: `Produto ${item.produtoId} não encontrado` });
      if (produto.estoque < item.quantidade) return res.status(400).json({ error: `Estoque insuficiente para produto ${produto.id}` });
      const subtotal = produto.preco * item.quantidade;
      valorTotal += subtotal;
      itensCreate.push({
        quantidade: item.quantidade,
        valorUnit: produto.preco,
        valorTotal: subtotal,
        produtoId: produto.id,
      });
    }

    // cria pedido e debita estoque
    const pedido = await prisma.$transaction(async (tx) => {
      // debita estoque
      for (const item of itens) {
        await tx.produto.update({
          where: { id: Number(item.produtoId) },
          data: { estoque: { decrement: Number(item.quantidade) } }
        });
      }
      // cria pedido
      const created = await tx.pedido.create({
        data: {
          clienteId: Number(clienteId),
          valorTotal,
          itens: { create: itensCreate }
        },
        include: { itens: true }
      });
      return created;
    });

    res.status(201).json(pedido);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
