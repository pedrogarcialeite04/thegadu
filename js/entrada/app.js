import { carregarDados, iniciarSincronizacao } from '../compartilhado/estado.js';
import { desenharTabelaProdutos } from './tabela.js';
import { iniciarNavegacao } from '../compartilhado/navegacao.js';
import { iniciarFormularioEntrada } from './formulario.js';
import { iniciarModal, abrirEdicao } from './modal.js';
import { iniciarBusca } from '../compartilhado/busca.js';
import { removerProduto } from '../compartilhado/exclusao.js';
import { iniciarAnimacoes } from '../compartilhado/animacoes.js';
import { iniciarLogo3D } from '../compartilhado/logo3d.js';

async function iniciar() {
    iniciarNavegacao('entrada');
    iniciarFormularioEntrada();
    iniciarModal();
    iniciarBusca();

    const listaProdutosEl = document.querySelector('#listaProdutos');
    if (listaProdutosEl) {
        listaProdutosEl.addEventListener('click', (e) => {
            const botao = e.target.closest('[data-acao]');
            if (!botao) return;
            const { acao, codigo } = botao.dataset;
            if (acao === 'editar') abrirEdicao(codigo);
            else if (acao === 'excluir') removerProduto(codigo);
        });
    }

    await carregarDados();
    await desenharTabelaProdutos();

    iniciarSincronizacao(async () => {
        await desenharTabelaProdutos();
    });

    iniciarLogo3D();
    iniciarAnimacoes();
}

iniciar();
