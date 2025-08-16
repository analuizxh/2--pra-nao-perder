import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// Rotas
import authRoutes from './src/routes/AuthRoutes.js';
import empresaRoutes from './src/routes/EmpresaRoutes.js';
import funcionarioRoutes from './src/routes/FuncionarioRoutes.js';
import clienteRoutes from './src/routes/ClienteRoutes.js';
import produtoRoutes from './src/routes/ProdutoRoutes.js';
import agendamentoRoutes from './src/routes/AgendamentoRoutes.js';
import orcamentoRoutes from './src/routes/OrcamentoRoutes.js';

// Middlewares
import { authMiddleware } from './src/middlewares/AuthMiddleware.js';
import { verifyLicense } from './src/middlewares/LicenseMiddleware.js';
import { requirePermission } from './src/controllers/permissions.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas
app.use('/api/empresas', authMiddleware, verifyLicense, empresaRoutes);
app.use('/api/funcionarios', authMiddleware, verifyLicense, funcionarioRoutes);
app.use('/api/clientes', authMiddleware, verifyLicense, clienteRoutes);
app.use('/api/produtos', authMiddleware, verifyLicense, produtoRoutes);
app.use('/api/agendamentos', authMiddleware, verifyLicense, agendamentoRoutes);
app.use('/api/orcamentos', authMiddleware, verifyLicense, orcamentoRoutes);

// Rota de exemplo com permissão específica
app.get('/api/exemplo', 
  authMiddleware, 
  verifyLicense, 
  requirePermission('exemplo', 'leitura'),
  (req, res) => {
    res.json({ message: 'Acesso permitido' });
  }
);

// Rota para renovar licença
app.put('/api/empresas/:id/licenca', 
  authMiddleware,
  verifyLicense,
  requirePermission('empresas', 'administrar'),
  (req, res) => {
    // Implementação da renovação de licença
  }
);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}!`);
});