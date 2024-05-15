import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import md5 from 'md5';
import { UsuarioModel } from '../../models/UsuarioModel'; // Certifique-se de que o caminho está correto e é case-sensitive

const endpointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
) => {
    if (req.method === 'POST') { // Use '===' para comparação estrita
        const { login, senha } = req.body;

        const usuarioEncontrado = await UsuarioModel.find({ email: login, senha: md5(senha) });
        if (usuarioEncontrado && usuarioEncontrado.length > 0) {
            const usuarioLogado = usuarioEncontrado[0];
            return res.status(200).json({ msg: `Usuário ${usuarioLogado.nome} autenticado com sucesso` });
        }
        return res.status(400).json({ erro: 'Usuário ou senha inválidos' });
    }
    return res.status(405).json({ erro: 'Método informado não é válido' });
};

export default conectarMongoDB(endpointLogin);
