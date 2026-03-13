import { elementos } from './seletores.js';

const MOBILE_BREAKPOINT = 768;

function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
}

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

function habilitarTransicao() {
    if (!elementos.menuLateral) return;
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            elementos.menuLateral.classList.add('com-transicao');
        });
    });
}

export function iniciarNavegacao(paginaAtual) {
    fecharMenu();

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

    if (elementos.botaoMenu) {
        elementos.botaoMenu.addEventListener('click', abrirMenu);
    }

    if (elementos.botaoFecharMenu) {
        elementos.botaoFecharMenu.addEventListener('click', fecharMenu);
    }

    if (elementos.fundoMenu) {
        elementos.fundoMenu.addEventListener('click', fecharMenu);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elementos.menuLateral?.classList.contains('aberto')) {
            fecharMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (!isMobile() && elementos.menuLateral?.classList.contains('aberto')) {
            fecharMenu();
        }
    });

    habilitarTransicao();
}
