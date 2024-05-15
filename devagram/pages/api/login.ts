import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import md5 from 'md5';
import { UsuarioModel } from '../../Models/UsuarioModel';
import jwt from 'jsonwebtoken';

const endpointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
) => {
    const {MINHA_CHAVE_JWT} = process.env;
    if(!MINHA_CHAVE_JWT){
        res.status(500).json({erro: 'ENV JWT não informada'});  
    }

    if (req.method === 'POST') { // Use '===' para comparação estrita
        const { login, senha } = req.body;

        const usuarioEncontrado = await UsuarioModel.find({ email: login, senha: md5(senha) });
        if (usuarioEncontrado && usuarioEncontrado.length > 0) {
            const usuarioLogado = usuarioEncontrado[0];

            const token = jwt.sign({ _id: usuarioEncontrado[0]._id }, MINHA_CHAVE_JWT);

            
            
            return res.status(200).json({ msg: `Usuário ${usuarioLogado.nome} autenticado com sucesso` });
        }
        return res.status(400).json({ erro: 'Usuário ou senha inválidos' });
    }
    return res.status(405).json({ erro: 'Método informado não é válido' });
};

export default conectarMongoDB(endpointLogin);
