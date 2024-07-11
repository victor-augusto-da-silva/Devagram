import type { NextApiRequest, NextApiResponse } from 'next';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { UsuarioModel } from '../../Models/UsuarioModel';
import { PublicacaoModel } from '../../Models/PublicacaoModel';

const comentarioEndPoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  try {
    if (req.method === 'PUT') {
      const { userId, id } = req.query;
      const usuarioLogado = await UsuarioModel.findById(userId);
      if (!usuarioLogado) {
        return res.status(400).json({ erro: 'Usuário não encontrado' });
      }
      const publicacao = await PublicacaoModel.findById(id);
      if (!publicacao) {
        return res.status(400).json({ erro: 'Publicação não encontrada' });
      }

      // Correção: Verificar se o corpo da requisição contém o campo 'comentario'
      if (!req.body || !req.body.comentario || req.body.comentario.length < 2) {
        return res.status(400).json({ erro: 'Comentário não é válido' });
      }

      // Criação do objeto de comentário
      const comentario = {
        usuarioId: usuarioLogado._id,
        nome: usuarioLogado.nome,
        comentario: req.body.comentario,
      };

      publicacao.comentarios.push(comentario);
      await publicacao.save(); // Correção: Salvar a publicação após adicionar o comentário
      return res.status(200).json({ msg: 'Comentário adicionado com sucesso.' });
    }

    return res.status(405).json({ erro: 'Método informado não é válido!' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ erro: 'Ocorreu um erro ao adicionar um comentário' });
  }
};

export default validarTokenJWT(conectarMongoDB(comentarioEndPoint));
