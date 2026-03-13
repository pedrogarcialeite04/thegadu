require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const path = require('path');
const conectarBanco = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
const produtosRouter = require('./routes/produtos');
const saidasRouter = require('./routes/saidas');

const app = express();
const PORT = process.env.PORT || 3000;

// --- SEGURANÇA: Headers HTTP ---
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://cdn.jsdelivr.net",
                "https://cdnjs.cloudflare.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com"
            ],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'"],
            workerSrc: ["'self'", "blob:"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// --- SEGURANÇA: CORS restritivo ---
const origensPermitidas = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : [];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origensPermitidas.length === 0 || origensPermitidas.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Bloqueado pela política de CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    maxAge: 86400
}));

// --- SEGURANÇA: Rate Limiting ---
const limitadorGeral = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
        sucesso: false,
        mensagem: 'Muitas requisições. Tente novamente em 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const limitadorEscrita = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message: {
        sucesso: false,
        mensagem: 'Muitas operações de escrita. Tente novamente em 1 minuto.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/', limitadorGeral);

// --- SEGURANÇA: Body parsing com limite de tamanho ---
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// --- SEGURANÇA: Sanitização contra NoSQL Injection ---
app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`[SEGURANÇA] Tentativa de NoSQL Injection bloqueada - ${key} em ${req.originalUrl}`);
    }
}));

// --- SEGURANÇA: Proteção contra HTTP Parameter Pollution ---
app.use(hpp({
    whitelist: ['busca']
}));

// --- SEGURANÇA: Ocultar tecnologia do servidor ---
app.disable('x-powered-by');

// --- Servir frontend ---
app.use(express.static(path.join(__dirname, '..'), {
    dotfiles: 'deny',
    index: false
}));

app.get('/', (req, res) => {
    res.redirect('/entrada.html');
});

// --- Rotas da API ---
app.use('/api/produtos', (req, res, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        return limitadorEscrita(req, res, next);
    }
    next();
}, produtosRouter);

app.use('/api/saidas', (req, res, next) => {
    if (['POST', 'DELETE'].includes(req.method)) {
        return limitadorEscrita(req, res, next);
    }
    next();
}, saidasRouter);

app.get('/api/health', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'API THêGADü funcionando!',
        timestamp: new Date().toISOString()
    });
});

// --- SEGURANÇA: Bloquear rotas não existentes na API ---
app.all('/api/{*path}', (req, res) => {
    res.status(404).json({
        sucesso: false,
        mensagem: 'Endpoint não encontrado'
    });
});

// --- Error handler centralizado ---
app.use(errorHandler);

// --- Graceful Shutdown ---
function encerrarServidor(sinal) {
    console.log(`\n⏹️  Sinal ${sinal} recebido. Encerrando servidor...`);

    const mongoose = require('mongoose');

    mongoose.connection.close(false).then(() => {
        console.log('📦 Conexão com MongoDB encerrada.');
        process.exit(0);
    }).catch(() => {
        process.exit(1);
    });

    setTimeout(() => {
        console.error('⚠️  Forçando encerramento após timeout.');
        process.exit(1);
    }, 10000);
}

process.on('SIGTERM', () => encerrarServidor('SIGTERM'));
process.on('SIGINT', () => encerrarServidor('SIGINT'));

process.on('unhandledRejection', (razao) => {
    console.error('❌ Promise não tratada:', razao);
});

process.on('uncaughtException', (erro) => {
    console.error('❌ Exceção não capturada:', erro);
    encerrarServidor('uncaughtException');
});

// --- Iniciar servidor ---
async function iniciar() {
    await conectarBanco();

    app.listen(PORT, () => {
        console.log(`\n🚀 Servidor THêGADü rodando na porta ${PORT}`);
        console.log(`📦 API disponível em /api`);
        console.log(`🔒 Segurança: Helmet, Rate Limit, NoSQL Sanitize, HPP ativos\n`);
    });
}

iniciar();
