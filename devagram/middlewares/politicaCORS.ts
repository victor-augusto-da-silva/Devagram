import {NextApiRequest,NextApiResponse,NextApiHandler} from 'next'
import {RespostaPadraoMsg}  from '../types/RespostaPadraoMsg';
import NextCors from 'nextjs-cors';
import { METHODS } from 'http';
import { Postpone } from 'next/dist/server/app-render/dynamic-rendering';
import { pathToFileURL } from 'url';


export const politicaCORS = (hander : NextApiHandler ) => 
    async(req : NextApiRequest , res: NextApiResponse<RespostaPadraoMsg>) =>{
        try{
            await NextCors(req,res,{
                    origin : '*',
                    methods : ['GET','POST','PUT'],
                    //Navegadores antigos dão problema com o 204 (No Content)
                    optionSuccessStatus : 200,    
            });
            
            return hander(req,res);
        }
        catch(e){
            console.log('Erro ao tratar a exceção: ' + e );
            res.status(500).json({erro: 'Ocorreu erro ao tratar politica de CORS'})
        }
}