import { NextApiResponse } from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import nc from 'next-connect';
import { uploadImagemCosmic, upload } from '../../Services/uploadImagemCosmic';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { PublicacaoModel } from '../../Models/PublicacaoModel';
import { UsuarioModel } from '../../Models/UsuarioModel';

const handler = nc()
  .use(upload.single('file'))
  .post(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const { userId } = req.query;
      const usuario = await UsuarioModel.findById(userId);
      if (!usuario) {
        return res.status(400).json({ erro: 'Usuario não encontrado' });
      }

      if (!req || !req.body) {
        return res.status(400).json({ erro: 'Parametros de entrada não informados' });
      }

      const { descricao } = req?.body;

      if (!descricao || descricao.length < 2) {
        return res.status(400).json({ erro: 'Descrição não é valida' });
      }
      if (!req.file || !req.file.originalname) {
        return res.status(400).json({ erro: 'Imagem é obrigatoria' });
      }

      const image = await uploadImagemCosmic(req);
      const publicacao = {
        idUsuario: usuario._id,
        descricao,
        foto: image.media.url,
        data: new Date()
      };

      await PublicacaoModel.create(publicacao);

      // Contar todas as publicações existentes do usuário
      const totalPublicacoes = await PublicacaoModel.countDocuments({ idUsuario: usuario._id });

      // Atualizar o campo de publicações do usuário
      usuario.publicacoes = totalPublicacoes;
      await usuario.save();

      return res.status(200).json({ msg: 'Publicado com sucesso' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ erro: 'Erro ao cadastrar publicacao' });
    }
  });

export const config = {
  api: {
    bodyParser: false
  }
};

export default validarTokenJWT(conectarMongoDB(handler));
