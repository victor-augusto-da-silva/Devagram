import type { NextApiRequest, NextApiResponse } from 'next';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { UsuarioModel } from '../../Models/UsuarioModel';
import { PublicacaoModel } from '../../Models/PublicacaoModel';
import { SeguidorModel } from '../../Models/SeguidorModel';
import { politicaCORS } from '../../middlewares/politicaCORS';

const feedEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | any>
) => {
  try {
    if (req.method === 'GET') {
      const { userId } = req.query;
      const usuarioLogado = await UsuarioModel.findById(userId);

      if (!usuarioLogado) {
        return res.status(400).json({ erro: 'Usuário não encontrado' });
      }

      // Buscar os IDs dos usuários que o usuário logado segue
      const seguidores = await SeguidorModel.find({
        usuarioId: usuarioLogado._id,
      });
      const seguidoresIds = seguidores.map((s) => s.usuarioSeguidoId);

      // Buscar as publicações do usuário logado e dos usuários que ele segue
      const publicacoes = await PublicacaoModel.find({
        $or: [
          { idUsuario: usuarioLogado._id }, // Suas próprias publicações
          { idUsuario: { $in: seguidoresIds } }, // Publicações dos usuários que segue
        ],
      }).sort({ data: -1 });

      
      const  result = [];
      // fazendo um laço para que cada publicação esteja amarrada com um Usuario
      for (const publicacao of publicacoes) {
            const usuarioDaPublicacao = await UsuarioModel.findById(publicacao.idUsuario)
            if(usuarioDaPublicacao){
                //... cria um outro json copiando um dado de um json existente
                const final = {...publicacao._doc , usuario : {
                    nome : usuarioDaPublicacao.nome,
                    avatar : usuarioDaPublicacao.avatar
                }};
                result.push(final);
            }
      }

      return res.status(200).json(result);
    }

    return res.status(405).json({ erro: 'Método informado não é válido' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ erro: 'Não foi possível obter o feed' });
  }
};

export default politicaCORS  (  validarTokenJWT(conectarMongoDB(feedEndpoint)) );
