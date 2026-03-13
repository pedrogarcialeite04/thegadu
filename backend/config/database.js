const mongoose = require('mongoose');

async function conectarBanco() {
    try {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error('MONGODB_URI não definida no arquivo .env');
        }

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
            heartbeatFrequencyMS: 5000,
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10,
            minPoolSize: 2
        });

        console.log('✅ Conectado ao MongoDB com sucesso!');

        mongoose.connection.on('error', (erro) => {
            console.error('❌ Erro na conexão MongoDB:', erro.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB desconectado. Mongoose tentará reconectar automaticamente.');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconectado com sucesso!');
        });

    } catch (erro) {
        console.error('❌ Falha ao conectar ao MongoDB:', erro.message);
        console.error('   Verifique sua MONGODB_URI no arquivo .env');
        process.exit(1);
    }
}

module.exports = conectarBanco;
