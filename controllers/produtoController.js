const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.updateProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco } = req.body; // estoque não pode ser atualizado aqui
    const data = {};
    if (nome !== undefined) data.nome = nome;
    if (preco !== undefined) data.preco = Number(preco);
    if ('estoque' in req.body) return res.status(400).json({ error: 'Atualização de estoque deve ser feita no endpoint /produtos/:id/estoque' });
    const produto = await prisma.produto.update({ where: { id: Number(id) }, data });
    res.json(produto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateEstoque = async (req, res) => {
  try {
    const { id } = req.params;
    const { estoque } = req.body;
    if (estoque === undefined) return res.status(400).json({ error: 'estoque é obrigatório' });
    const produto = await prisma.produto.update({
      where: { id: Number(id) },
      data: { estoque: Number(estoque) }
    });
    res.json(produto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
