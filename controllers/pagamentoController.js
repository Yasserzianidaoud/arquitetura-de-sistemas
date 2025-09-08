const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.confirmarPagamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { pagamentos } = req.body; // [{metodo, valor}]

    if (!Array.isArray(pagamentos) || pagamentos.length === 0) {
      return res.status(400).json({ error: 'pagamentos[] é obrigatório' });
    }

    let status = 'PAGO';

    await prisma.$transaction(async (tx) => {
      for (const pg of pagamentos) {
        const aprovado = Math.random() > 0.3; // 70% de chance de aprovar
        await tx.pagamento.create({
          data: {
            metodo: pg.metodo,
            valor: Number(pg.valor),
            pedidoId: Number(id)
          }
        });
        if (!aprovado) {
          status = 'CANCELADO';
          break;
        }
      }
      await tx.pedido.update({
        where: { id: Number(id) },
        data: { status }
      });
    });

    const pedidoAtualizado = await prisma.pedido.findUnique({
      where: { id: Number(id) },
      include: { pagamentos: true }
    });

    res.json(pedidoAtualizado);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getPagamentosByPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pagamentos = await prisma.pagamento.findMany({
      where: { pedidoId: Number(id) }
    });
    res.json(pagamentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
