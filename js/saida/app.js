import { carregarDados, iniciarSincronizacao } from '../compartilhado/estado.js';
import { desenharTabelaSaidas } from './tabela.js';
import { atualizarResumo } from '../entrada/tabela.js';
import { iniciarNavegacao } from '../compartilhado/navegacao.js';
import { iniciarFormularioSaida } from './formulario.js';
import { iniciarBusca } from '../compartilhado/busca.js';
import { removerSaida } from '../compartilhado/exclusao.js';
import { iniciarSelectsCustomizados } from './select-customizado.js';
import { iniciarAnimacoes } from '../compartilhado/animacoes.js';
import { iniciarLogo3D } from '../compartilhado/logo3d.js';

async function iniciar() {
    iniciarNavegacao('saida');
    iniciarBusca();

    const listaSaidasEl = document.querySelector('#listaSaidas');
    if (listaSaidasEl) {
        listaSaidasEl.addEventListener('click', (e) => {
            const botao = e.target.closest('[data-acao]');
            if (!botao) return;
            if (botao.dataset.acao === 'excluirSaida') removerSaida(botao.dataset.id);
        });
    }

    await carregarDados();

    iniciarFormularioSaida();
    iniciarSelectsCustomizados();

    document.dispatchEvent(new CustomEvent('produtos-atualizados'));

    desenharTabelaSaidas();
    await atualizarResumo();

    iniciarSincronizacao(async () => {
        desenharTabelaSaidas();
        await atualizarResumo();
        document.dispatchEvent(new CustomEvent('produtos-atualizados'));
    });

    iniciarLogo3D();
    iniciarAnimacoes();
}

iniciar();
