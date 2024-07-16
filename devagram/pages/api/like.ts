import type {NextApiRequest,NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { PublicacaoModel } from '../../Models/PublicacaoModel';
import { UsuarioModel } from '../../Models/UsuarioModel';
import { politicaCORS } from '../../middlewares/politicaCORS';

const likeEndpoint = 
async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) =>{
    try{

         if(req.method === 'PUT'){
            //ID da publicação
            const {id} = req?.query;
            const publicacao = await PublicacaoModel.findById(id);
            if(!publicacao){
                res.status(400).json({erro: 'Publicação não encontrada'})
            }
            const{userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
             return   res.status(400).json({erro: 'Usuario não encontrado'})
            }
            // se o index for -1 ele não curtiu a foto se não ele ja curtiu
            const indexDoUsuarioNoLike  = publicacao.likes.findIndex((e : any ) => e.toString() === usuario._id.toString());
            if(indexDoUsuarioNoLike != -1){
               // se ja curtiu 
               // .splice remove do array
               publicacao.likes.splice(indexDoUsuarioNoLike,1);
               await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id},publicacao);
               return res.status(200).json({msg: 'Publicacao descurtida com sucesso'});  
            }    
            else {
                // Não curtiu a foto
                // push insere no final do array
                publicacao.likes.push(usuario._id);
                await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id},publicacao);
                return res.status(200).json({msg: 'Publicacao curtida com sucesso'});
            
            }
         }
         return res.status(405).json({erro: 'Metodo informado não é valido'})
    }
    catch(e){console.log(e)
        return res.status(500).json({erro: 'Ocorreu erro ao curtir/descurtir uma publicação'});
    }
}
export default   politicaCORS(   validarTokenJWT(conectarMongoDB(likeEndpoint)));