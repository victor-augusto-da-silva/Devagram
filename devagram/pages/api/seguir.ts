import {NextApiRequest,NextApiResponse} from 'next';
import{RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';


const endpointSeguir = 
(req: NextApiRequest,res: NextApiResponse)=>{

    try{
        if(req.method === 'PUT'){
            //id do usuario que esta logado
           // if(req?.query?.userId)
        } 

        return res.status(405).json({erro: 'Metodo informado não existe'});
    }
    catch(e){
        return res.status(500).json({erro: 'Não foi possível seguir/deseguir o usuario informado'});

    }

}

export default  validarTokenJWT(conectarMongoDB(endpointSeguir));