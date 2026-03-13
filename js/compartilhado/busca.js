import { elementos } from './seletores.js';
import { desenharTabelaProdutos } from '../entrada/tabela.js';
import { desenharTabelaSaidas } from '../saida/tabela.js';

export function iniciarBusca() {
    if (elementos.buscaProdutos) {
        elementos.buscaProdutos.addEventListener('input', function () {
            desenharTabelaProdutos(this.value);
        });
    }

    if (elementos.buscaSaidas) {
        elementos.buscaSaidas.addEventListener('input', function () {
            desenharTabelaSaidas(this.value);
        });
    }
}
