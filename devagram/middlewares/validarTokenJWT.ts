import type {NextApiRequest,NextApiResponse,NextApiHandler} from 'next';
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg';


export const validarTokenJWT = (handler: NextApiHandler) => (
    req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    const{MINHA_CHAVE_JWT} = process.env;
    if (!MINHA_CHAVE_JWT){return res.status(500).json({ erro: 'ENV chave JWT nao informada na execução'})}
}