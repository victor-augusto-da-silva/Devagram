import type {NextApiRequest,NextApiResponse} from 'next';
import { conectarMongoDB} from '../../middlewares/conectarMongoDB';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';

const endpointLogin = (
    req: NextApiRequest,
    /*O objeto só aceita respostas padrões*/ 
    res: NextApiResponse<RespostaPadraoMsg>) =>{
        if (req.method == 'POST'){
            const {login,senha} =  req.body 

            if(login === 'admin@admin.com' &&  senha === 'Admin@123') {
               return res.status(200).json({msg : 'Usuario autenticado com sucesso'});
            }
            return res.status(400).json({erro : 'Usuario ou senha invalidos'});
        }
        return res.status(405).json({erro : 'Metodo informado não é valido'});
    }
//primeiro conecta depois roda o endpoint
    export default conectarMongoDB(endpointLogin)

