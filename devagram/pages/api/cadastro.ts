// cadastro.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import type { CadastroRequisicao } from '../../types/CadastroRequisicao';
import { UsuarioModel } from '../../Models/UsuarioModel';

const endpointCadastro = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    if (req.method === 'POST') {
        const usuario = req.body as CadastroRequisicao;
        if (!usuario.nome || usuario.nome.length < 2) {
            return res.status(400).json({ erro: 'Nome inválido' });
        }
        if (!usuario.email || usuario.email.length < 5 || !usuario.email.includes('@') || !usuario.email.includes('.')) {
            return res.status(400).json({ erro: 'E-mail inválido' });
        }
        if (!usuario.senha || usuario.senha.length < 4) {
            return res.status(400).json({ erro: 'Senha inválida' });
        }
        // Salva no banco de dados
        await UsuarioModel.create(usuario);
        return res.status(200).json({ msg: 'Usuário criado com sucesso' });
    }
    return res.status(405).json({ erro: 'Método informado não é válido' });
};

export default endpointCadastro;
