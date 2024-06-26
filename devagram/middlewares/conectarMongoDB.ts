import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import type { RespostaPadraoMsg } from '../types/RespostaPadraoMsg';
import mongoose from 'mongoose';
 

// Resto do código permanece o mesmo
// ...


// Configuração inicial da conexão com o MongoDB (fora do export)
const DB_CONEXAO_STRING = process.env.DB_CONEXAO_STRING;

if (!DB_CONEXAO_STRING) {
    throw new Error('ENV de configuração do banco não informado');
}

mongoose.connection.on('connected', () => console.log('Banco de dados conectado'));
mongoose.connection.on('error', error => console.log(`Ocorreu erro ao conectar no banco: ${error}`));

// Adicionando tratamento de erro à conexão
(async () => {
    try {
        await mongoose.connect(DB_CONEXAO_STRING, {
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log('Conectado ao MongoDB.');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
    }
})();

export const conectarMongoDB = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
        // Verifica se o banco está conectado
        if (mongoose.connections[0].readyState) {
            // Seguindo para o endpoint ou middleware
            return handler(req, res);
        } else {
            // Se não estiver conectado, retorna um erro
            return res.status(500).json({ erro: 'Não foi possível conectar ao banco de dados' });
        }
    };
