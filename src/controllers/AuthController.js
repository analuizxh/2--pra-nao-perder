export const login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const funcionario = await prisma.funcionario.findUnique({
            where: { email },
            include: {
                empresa: {
                    select: {
                        id: true,
                        licenca: true,
                        dataExpiracaoLicenca: true
                    }
                }
            }
        });

        if (!funcionario) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas.' }); 
        }

        const senhaValida = await bcrypt.compare(senha, funcionario.senha);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
        }

        // Verificar licença da empresa
        const hoje = new Date();
        if (!funcionario.empresa.licenca || 
            (funcionario.empresa.dataExpiracaoLicenca && funcionario.empresa.dataExpiracaoLicenca < hoje)) {
            return res.status(403).json({ mensagem: 'Licença da empresa inválida ou expirada' });
        }

        const token = jwt.sign(
            { 
                id: funcionario.id, 
                email: funcionario.email, 
                cargo: funcionario.cargo,
                empresaId: funcionario.empresaId,
                licenca: funcionario.empresa.licenca 
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        const { senha: _, ...dadosFuncionario } = funcionario;
        res.status(200).json({
            mensagem: 'Login bem-sucedido!',
            funcionario: dadosFuncionario,
            token
        });
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro no servidor', error: erro.message });
    }
};