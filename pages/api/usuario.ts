import type { NextApiRequest, NextApiResponse } from 'next';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { UsuarioModel } from '../../Models/UsuarioModel';
import nc from 'next-connect';
import { upload, uploadImagemCosmic } from '../../Services/uploadImagemCosmic';
import { politicaCORS } from '../../middlewares/politicaCORS';

const handler = nc()
  .use(upload.single('file'))
  .put(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const { userId } = req?.query;
      const usuario = await UsuarioModel.findById(userId);

      // Se o usuário foi encontrado
      if (!usuario) {
        return res.status(400).json({ erro: 'Usuário não encontrado' });
      }
      const { nome } = req.body;
      if (nome && nome.length > 2) {
        usuario.nome = nome;
      }
      const { file } = req;
      if (file && file.originalname) {
        const image = await uploadImagemCosmic(req);
        if (image && image.media && image.media.url) {
          usuario.avatar = image.media.url;
        }
      }

      // Altera os dados no BD
      await usuario.save(); // Correção: salvar o usuário atualizado
      return res.status(200).json({ msg: 'Usuário alterado com sucesso' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ erro: 'Não foi possível atualizar o usuário' });
    }
  })
  .get(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
    try {
      const { userId } = req?.query;
      const usuario = await UsuarioModel.findById(userId);
      usuario.senha = null;
      return res.status(200).json(usuario);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ erro: 'Não foi possível obter dados do usuário: ' + e });
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default  politicaCORS(  validarTokenJWT(conectarMongoDB(handler)));
