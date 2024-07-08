import {NextApiRequest,NextApiResponse} from 'next';
import{RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { UsuarioModel } from '../../Models/UsuarioModel';
import { SeguidorModel } from '../../Models/SeguidorModel';


const endpointSeguir = 
async (req: NextApiRequest,res: NextApiResponse)=>{

    try{
        const {userId,id} = req?.query;
        const usuarioLogado = await UsuarioModel.findById(userId);

        if(req.method === 'PUT'){
            //id do usuario que esta logado
           // if(req?.query?.userId)
        } 
      
        if(!usuarioLogado){
            return res.status(400).json({erro: 'Usuario logado não encontrado'});
        
        }
        const usuarioASerSeguido = await UsuarioModel.findById(id);

        if(!usuarioASerSeguido){
            return res.status(400).json({erro: 'Usuario a ser seguido não encontrado'});
        }
        // Busca o usuario passando se ele segue o seu ID
        const euJaSigoEsseUsuario = await SeguidorModel.
        find({usuarioId: usuarioLogado._id ,usuarioSeguidoId: usuarioASerSeguido._id});
      
      
        // Se eu ja sigo esse usuario
        if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length >0)
        {
            //Deixar de seguir
            // percorre os seguidores
            euJaSigoEsseUsuario.forEach(async(e : any) => await SeguidorModel.findByIdAndDelete({_id : e._id}));
            usuarioLogado.seguindo --;
            await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id},usuarioLogado);
            usuarioASerSeguido.seguidores --;
            await UsuarioModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, usuarioASerSeguido);
            return res.status(200).json({msg : 'Deixou de seguir o usuario com sucesso!'});
       
        }   
        else {
            // Seguir
            const seguidor = {
                usuarioId : usuarioLogado._id,
                usuarioSeguidoId: usuarioASerSeguido._id
            }
            await SeguidorModel.create(seguidor);
            // Adiciona um seguindo no usuario logado
            usuarioLogado.seguindo++;
            await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado.id},usuarioLogado);

             // Adiciona um seguindo no usuario seguido
            usuarioASerSeguido.seguidores ++;
            await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido.id},usuarioASerSeguido);

             

            return res.status(200).json({msg : 'Usuario seguido com sucesso!'});
       
        }
    }
    
    catch(e){
        return res.status(500).json({erro: 'Não foi possível seguir/deseguir o usuario informado'});

    }

}

export default  validarTokenJWT(conectarMongoDB(endpointSeguir));