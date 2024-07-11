import type { NextApiRequest, NextApiResponse } from 'next';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { UsuarioModel } from '../../Models/UsuarioModel';

const pesquisaEndPoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | any[]>
) => {
  try {
    if (req.method === 'GET') {
      if (req?.query?.id) {
        const usuariosEncontrado = await UsuarioModel.findById(req?.query?.id);
        if (!usuariosEncontrado) {
          return res.status(400).json({ erro: 'Usuário não encontrado' });
        }
        // Removendo a senha antes de retornar o usuário
        usuariosEncontrado.senha = undefined;
        return res.status(200).json(usuariosEncontrado);
      } else {
        const { filtro } = req.query;
        if (!filtro || filtro.length < 2) {
          return res
            .status(400)
            .json({ erro: 'Favor informar pelo menos 2 caracteres para busca' });
        }
        const usuariosEncontrados = await UsuarioModel.find({
          $or: [
            { nome: { $regex: filtro, $options: 'i' } },
            { email: { $regex: filtro, $options: 'i' } },
          ],
        });
        // Removendo a senha de todos os usuários encontrados
        const usuariosSemSenha = usuariosEncontrados.map((usuario) => {
          usuario.senha = undefined;
          return usuario;
        });
        return res.status(200).json(usuariosSemSenha);
      }
    }
    return res.status(405).json({ erro: 'Método informado não é válido' });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ erro: 'Não foi possível buscar usuários: ' + e });
  }
};

export default validarTokenJWT(conectarMongoDB(pesquisaEndPoint));
