const mongoose = require('mongoose');

const MOTIVOS_VALIDOS = [
    'Venda',
    'Devolução ao Fornecedor',
    'Perda/Avaria',
    'Uso Interno',
    'Outro'
];

const saidaSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: [true, 'Código do produto é obrigatório'],
        trim: true,
        uppercase: true,
        maxlength: [50, 'Código não pode exceder 50 caracteres']
    },
    descricao: {
        type: String,
        required: [true, 'Descrição é obrigatória'],
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
        min: [1, 'Quantidade mínima é 1'],
        max: [999999, 'Quantidade não pode exceder 999.999'],
        validate: {
            validator: Number.isInteger,
            message: 'Quantidade deve ser um número inteiro'
        }
    },
    valor: {
        type: Number,
        min: [0, 'Valor não pode ser negativo'],
        default: 0
    },
    motivo: {
        type: String,
        required: [true, 'Motivo da saída é obrigatório'],
        enum: {
            values: MOTIVOS_VALIDOS,
            message: 'Motivo inválido. Valores aceitos: ' + MOTIVOS_VALIDOS.join(', ')
        }
    },
    data: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

saidaSchema.index({ codigo: 1 });
saidaSchema.index({ data: -1 });
saidaSchema.index({ descricao: 'text', fornecedor: 'text', codigo: 'text' });

module.exports = mongoose.model('Saida', saidaSchema);
