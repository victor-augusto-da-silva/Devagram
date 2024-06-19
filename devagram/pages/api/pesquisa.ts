import type {NextApiRequest,NextApiResponse} from 'next';
import type {RespostaPadraoMsg	} from '../../types/RespostaPadraoMsg';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { UsuarioModel } from '../../Models/UsuarioModel';

const pesquisaEndPoint = async(req: NextApiRequest, 
    res:  NextApiResponse<RespostaPadraoMsg | any[]>)=>{
    try{
        if(req.method === 'GET'){

            const {filtro} = req.query;
            // busca pelo nome,e-mail...etc
            //ira percorrer todos os campos
            if(!filtro || filtro.length <2 )
                {
                    return res.status(400).json({erro: 'Favor informar pelo menos 2 caracteres para busca'});

                }
                const usuariosEncontrados = await UsuarioModel.find({
                   // faz com que não fique case sensitive
                   // o i é de ignore case (busca indiferente do case sensitive)
                    $or: [{nome: {$regex: filtro , $options : 'i'}},
                        {email: {$regex: filtro , $options : 'i'}}]
                });
            return res.status(200).json(usuariosEncontrados);
        }
        return res.status(405).json({erro : 'Metodo informado não é valido' })
    }   

    catch(e){
        console.log(e);
        return res.status(500).json({erro : 'Não foi possível buscar usuarios: ' + e})
    }

}


export default validarTokenJWT( conectarMongoDB(pesquisaEndPoint));