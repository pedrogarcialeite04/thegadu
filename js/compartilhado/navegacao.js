import { elementos } from './seletores.js';

export function fecharMenu() {
    if (!elementos.menuLateral) return;
    elementos.menuLateral.classList.remove('aberto');
    if (elementos.fundoMenu) elementos.fundoMenu.classList.remove('visivel');
    document.body.style.overflow = '';
}

function abrirMenu() {
    if (!elementos.menuLateral) return;
    elementos.menuLateral.classList.add('aberto');
    if (elementos.fundoMenu) elementos.fundoMenu.classList.add('visivel');
    document.body.style.overflow = 'hidden';
}

export function iniciarNavegacao(paginaAtual) {
    elementos.botoesMenu.forEach(botao => {
        const secao = botao.dataset.secao;

        if (secao === paginaAtual) {
            botao.classList.add('ativo');
        } else {
            botao.classList.remove('ativo');
        }

        botao.addEventListener('click', () => {
            if (secao === paginaAtual) {
                fecharMenu();
                return;
            }

            const destino = secao === 'entrada' ? 'entrada.html' : 'saida.html';
            window.location.href = destino;
        });
    });

    if (elementos.botaoMenu) elementos.botaoMenu.addEventListener('click', abrirMenu);
    if (elementos.fundoMenu) elementos.fundoMenu.addEventListener('click', fecharMenu);
}
