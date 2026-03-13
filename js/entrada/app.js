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

    window.controle = {
        editar:  abrirEdicao,
        excluir: removerProduto
    };

    await carregarDados();
    await desenharTabelaProdutos();

    iniciarSincronizacao(async () => {
        await desenharTabelaProdutos();
    });

    iniciarLogo3D();
    iniciarAnimacoes();
}

iniciar();
