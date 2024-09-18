const redis = require('redis');
require('dotenv').config();

let clientRedis = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

async function conectar(){
    await clientRedis.connect();
    clientRedis.on('error',err => {
        console.log('Erro: '+err);
    });
    console.log('Conectado com o Redis');
}

conectar();

module.exports = clientRedis;