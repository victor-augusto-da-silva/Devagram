import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import type { CadastroRequisicao } from '../../types/CadastroRequisicao';
import { UsuarioModel } from '../../Models/UsuarioModel';
import md5 from 'md5';
import multer from 'multer';
import { createBucketClient } from "@cosmicjs/sdk";
import nc from 'next-connect';
import { upload, uploadImagemCosmic } from '../../Services/uploadImagemCosmic';

const handler = nc()
  .use(upload.single("file"))
  .post(
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
      try {
        console.log("Request body:", req.body);
        const usuario = req.body as CadastroRequisicao;

        if (!usuario.nome || usuario.nome.length < 2) {
          return res.status(400).json({ erro: "Nome inválido" });
        }

        if (
          !usuario.email ||
          usuario.email.length < 5 ||
          !usuario.email.includes("@") ||
          !usuario.email.includes(".")
        ) {
          return res.status(400).json({ erro: "Email inválido" });
        }

        if (!usuario.senha || usuario.senha.length < 4) {
          return res.status(400).json({ erro: "Senha inválida" });
        }

        const usuarioComMesmoEmail = await UsuarioModel.find({
          email: usuario.email,
        });
        if (usuarioComMesmoEmail && usuarioComMesmoEmail.length > 0) {
          return res
            .status(400)
            .json({ erro: "Esse email já está cadastrado" });
        }

        const image = await uploadImagemCosmic(req);
        console.log("Uploaded image:", image);

        const usuarioASerSalvo = {
          nome: usuario.nome,
          email: usuario.email,
          senha: md5(usuario.senha),
          avatar: image?.media?.url,
        };

        await UsuarioModel.create(usuarioASerSalvo);
        return res.status(200).json({ msg: "Usuário cadastrado com sucesso" });
      } catch (e) {
        console.error("Erro ao cadastrar usuário:", e);
        return res.status(500).json({ erro: "erro ao cadastrar o usuário" });
      }
    }
  );

export const config = {
  api: {
    bodyParser: false,
  },
};

export default conectarMongoDB(handler);
export { upload, uploadImagemCosmic };
