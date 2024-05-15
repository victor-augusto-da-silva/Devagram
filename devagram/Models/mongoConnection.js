// mongoConnection.js

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://victor1231967:Close123@cluster0.ww8aqno.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Conexão bem-sucedida com o MongoDB!");
    } finally {
        await client.close();
    }
}

module.exports = run; // Exporte o membro corretamente
