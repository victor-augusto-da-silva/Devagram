import type{NextApiRequest,NextApiResponse,NextApiHandler} from 'next';
import type{RespostaPadraoMsg} from '../types/RespostaPadraoMsg'
import mongoose from 'mongoose';
import { error } from 'console';

export const conectarMongoDB = (handler : NextApiHandler) => 
    //função assincrona
   async (req : NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) =>{

        //verifica se o banco esta conectado
        if(mongoose.connections[0].readyState){
            //seguindo para o end point ou middleware
            return handler(req,res);
        }
        //conectar se não, obtendo a variavel de ambiente do env
        const {DB_CONEXAO_STRING} = process.env;
        
        // se a conexão estiver vazia  
        if(!DB_CONEXAO_STRING) {
            return res.status(500).json({ erro: 'ENV de configuração do banco não informado'});
        }

        mongoose.connection.on('connected', () => console.log('Banco de dados conectado'));
        mongoose.connection.on('error', error => console.log(`Ocorreu erro ao conectar no banco: ${error}`));

       //aguarda até o mongoose conectar
       await mongoose.connect(DB_CONEXAO_STRING);
        // seguindo o endpoint
       return handler(req,res);
    }