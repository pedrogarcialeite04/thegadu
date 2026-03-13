function errorHandler(erro, req, res, _next) {
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
        console.error(`[ERRO] ${req.method} ${req.originalUrl}:`, erro.message);
    }

    if (erro.name === 'ValidationError') {
        const mensagens = Object.values(erro.errors).map(e => e.message);
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Erro de validação',
            erros: mensagens
        });
    }

    if (erro.name === 'CastError') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'ID ou parâmetro inválido'
        });
    }

    if (erro.code === 11000) {
        return res.status(409).json({
            sucesso: false,
            mensagem: 'Registro duplicado detectado'
        });
    }

    if (erro.type === 'entity.too.large') {
        return res.status(413).json({
            sucesso: false,
            mensagem: 'Requisição muito grande'
        });
    }

    if (erro.message === 'Bloqueado pela política de CORS') {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Acesso não permitido'
        });
    }

    res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor'
    });
}

module.exports = errorHandler;
