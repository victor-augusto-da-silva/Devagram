import type {NextApiRequest,NextApiResponse} from 'next';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import  {conectarMongoDB} from '../../middlewares/conectarMongoDB'
import {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg'
import { UsuarioModel } from '../../Models/UsuarioModel';
import nc from 'next-connect';
import {upload,uploadImagemCosmic} from '../../Services/uploadImagemCosmic'

const handler = nc () 
.use(upload.single('avatar')) 
.put(async(req : NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>)=>{
    try{
        const{userId} = req?.query;
        const usuario = await UsuarioModel.findById(userId);

        //se o usuario foi encontrado
        if(!usuario){
            return res.status(400).json({erro: 'Usuario não encontrado'});
        }   
        const {nome} =  req.body;
        if (nome && nome.length >2 ){
            return res.status(400).json({erro: 'Nome invalido'});  
        }
    }
    catch(e){
        console.log(e);
    }
   return res.status(400).json({erro: 'Não foi possivel atualizar o usuario'});
}
);

const usuarioEndpoint =  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>)=>{
    

try{

    const {userId} = req?.query;
    const usuario = await UsuarioModel.findById(userId);
    usuario.senha = null;
    return res.status(200).json(usuario);
}
catch(e){
    console.log(e);
  
}

return res.status(400).json({erro :  'Não foi possivel obter dados do usuario'});
 
}

export default validarTokenJWT (conectarMongoDB (usuarioEndpoint));

 