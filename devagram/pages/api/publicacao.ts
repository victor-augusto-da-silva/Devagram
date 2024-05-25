import {NextApiRequest,NextApiResponse} from 'next';
import {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import nc from 'next-connect';
import {uploadImagemCosmic,upload} from '../../Services/uploadImagemCosmic';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';

const handler  = nc() 
.use(upload.single('file')) 
.post(async(req: NextApiRequest, res:NextApiResponse<RespostaPadraoMsg>) => {

});


// Configurando para que o NEXT não mande uma request com um JSON, por estarmos enviando uma foto é necessário que seja um FormData
export const config = {
    api : {
        bodyParse: false
    }
}

export default conectarMongoDB(handler);
 