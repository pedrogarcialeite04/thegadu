const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: [true, 'Código do produto é obrigatório'],
        unique: true,
        trim: true,
        uppercase: true,
        maxlength: [50, 'Código não pode exceder 50 caracteres'],
        match: [/^[A-Z0-9\-_]+$/i, 'Código só pode conter letras, números, hífens e underscores']
    },
    descricao: {
        type: String,
        required: [true, 'Descrição do produto é obrigatória'],
        trim: true,
        maxlength: [200, 'Descrição não pode exceder 200 caracteres']
    },
    fornecedor: {
        type: String,
        trim: true,
        default: '',
        maxlength: [200, 'Nome do fornecedor não pode exceder 200 caracteres']
    },
    quantidade: {
        type: Number,
        required: [true, 'Quantidade é obrigatória'],
        min: [0, 'Quantidade não pode ser negativa'],
        max: [999999, 'Quantidade não pode exceder 999.999'],
        validate: {
            validator: Number.isInteger,
            message: 'Quantidade deve ser um número inteiro'
        }
    },
    valor: {
        type: Number,
        required: [true, 'Valor unitário é obrigatório'],
        min: [0.01, 'Valor deve ser maior que zero'],
        max: [99999999.99, 'Valor não pode exceder R$ 99.999.999,99']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

produtoSchema.virtual('valorTotal').get(function () {
    return +(this.quantidade * this.valor).toFixed(2);
});

produtoSchema.index({ descricao: 'text', fornecedor: 'text', codigo: 'text' });

module.exports = mongoose.model('Produto', produtoSchema);
