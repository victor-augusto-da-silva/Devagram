import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import md5 from 'md5';
import { UsuarioModel } from '../../Models/UsuarioModel';
import jwt from 'jsonwebtoken';
import {loginResposta} from '../../types/LoginResposta'

const endpointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg | loginResposta>
) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ erro: 'Método informado não é válido' });
    }

    const MINHA_CHAVE_JWT = process.env.MINHA_CHAVE_JWT;
    if (!MINHA_CHAVE_JWT) {
        return res.status(500).json({ erro: 'ENV JWT não informada' });
    }

    const { login, senha } = req.body;
    const usuarioEncontrado = await UsuarioModel.find({ email: login, senha: md5(senha) });
    if (usuarioEncontrado && usuarioEncontrado.length > 0) {
        const usuarioLogado = usuarioEncontrado[0];

        const token = jwt.sign({ _id: usuarioLogado._id }, MINHA_CHAVE_JWT);
        return res.status(200).json({
            nome : usuarioLogado.nome,email: usuarioLogado.email,token
        });
    }

    return res.status(400).json({ erro: 'Usuário ou senha inválidos' });
};

export default conectarMongoDB(endpointLogin);
