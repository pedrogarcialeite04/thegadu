function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function criarFiltroBusca(termo, campos) {
    const termoSeguro = escaparRegex(termo);
    return {
        $or: campos.map(campo => ({
            [campo]: { $regex: termoSeguro, $options: 'i' }
        }))
    };
}

function sanitizarString(valor, maxLength = 500) {
    if (typeof valor !== 'string') return '';
    return valor.trim().slice(0, maxLength);
}

module.exports = { escaparRegex, criarFiltroBusca, sanitizarString };
