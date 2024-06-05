import type {NextApiRequest,NextApiResponse} from 'next';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import  {conectarMongoDB} from '../../middlewares/conectarMongoDB'
import {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import { UsuarioModel } from '../../Models/UsuarioModel';
import { PublicacaoModel } from '../../Models/PublicacaoModel';
import publicacao from './publicacao';


const feedEndpoint = async (req: NextApiRequest, 
    res: NextApiResponse<RespostaPadraoMsg  | any >)=>{
       try{
        if(req.method === 'GET'){

            //recebe a informação do id_usuario 
            if(req?.query?.id){
                const usuario = await UsuarioModel.findById(req?.query?.id);
                if(!usuario){
                    return res.status(400).json({erro: 'Usuario não encontrado'});
                }
               //busca as publicações do id_usuario
               const publicacoes = await PublicacaoModel.find({idUsuario: usuario._id})
               .sort({data: -1}) ;
               return res.status(200).json(publicacoes);
            }
           
        }
        return res.status(405).json({erro: 'Metodo informado não é valido'});
       }
       catch(e){
        console.log(e);

       } 
       return res.status(400).json({erro: 'Não foi possível obter o feed'});
    }

    export default validarTokenJWT(conectarMongoDB(feedEndpoint));