import prisma from '../config/prisma.js';

export const createAgendamento = async (req, res) => {
  const { dataAgendamento, status, clienteId, produtoId, responsaveisIds } = req.body;
  try {
    const novoAgendamento = await prisma.agendamentoMedida.create({
      data: {
        dataAgendamento: new Date(dataAgendamento),
        status, clienteId, produtoId,
        responsaveis: { connect: responsaveisIds.map(id => ({ id })) },
      },
      include: { cliente: true, produto: true, responsaveis: { select: { id: true, nome: true } } },
    });
    res.status(201).json(novoAgendamento);
  } catch (erro) {
    res.status(500).json({ menssagem: 'Erro ao criar agendamento.', error: error.message });
  }
};

export const getAllAgendamentos = async (req, res) => {
  try {
    const agendamentos = await prisma.agendamentoMedida.findMany({
      include: {
        cliente: { select: { id: true, nome: true } },
        produto: { select: { id: true, nome: true } },
        responsaveis: { select: { id: true, nome: true } },
      },
    });
    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(500).json({ menssagem: 'Erro ao buscar agendamentos.', error: error.message });
  }
};

export const updateAgendamento = async (req, res) => {
    const { id } = req.params;
    const { status, altura, largura, profundidade, diametro, dataMedicao, observacaoTecnica } = req.body;
    try {
        const agendamentoAtualizado = await prisma.agendamentoMedida.update({
            where: { id: Number(id) },
            data: {
                status, altura, largura, profundidade, diametro,
                dataMedicao: dataMedicao ? new Date(dataMedicao) : undefined,
                observacaoTecnica
            }
        });
        res.status(200).json(agendamentoAtualizado);
    } catch (erro) {
        if (error.code === 'P2025') return res.status(404).json({ menssagem: 'Agendamento não encontrado.' });
        res.status(500).json({  menssagem: 'Erro ao atualizar agendamento.', error: error.message });
    }
};
