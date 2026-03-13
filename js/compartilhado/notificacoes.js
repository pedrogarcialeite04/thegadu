const TITULOS = {
    sucesso: 'Sucesso',
    erro:    'Erro',
    alerta:  'Atenção'
};

const ICONES = {
    sucesso: 'check_circle',
    erro:    'error',
    alerta:  'warning'
};

function obterContainer() {
    return document.getElementById('notificacoes');
}

function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

export function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    const container = obterContainer();
    if (!container) return;

    const el = document.createElement('div');
    el.className = `notificacao notificacao--${tipo}`;
    el.innerHTML = `
        <div class="notificacao__icone">
            <span class="material-icons-outlined">${ICONES[tipo]}</span>
        </div>
        <div class="notificacao__conteudo">
            <p class="notificacao__titulo">${TITULOS[tipo]}</p>
            <p class="notificacao__texto">${escaparHtml(mensagem)}</p>
        </div>
        <button class="notificacao__fechar" aria-label="Fechar">
            <span class="material-icons-outlined">close</span>
        </button>
        <div class="notificacao__progresso"></div>
    `;

    const fechar = () => {
        if (el.classList.contains('notificacao--saindo')) return;
        el.classList.add('notificacao--saindo');
        el.addEventListener('animationend', () => el.remove(), { once: true });
    };

    el.querySelector('.notificacao__fechar').addEventListener('click', fechar);

    container.appendChild(el);

    let tempoId = setTimeout(fechar, 3500);
    el.addEventListener('mouseenter', () => {
        clearTimeout(tempoId);
        const barra = el.querySelector('.notificacao__progresso');
        if (barra) barra.style.animationPlayState = 'paused';
    });
    el.addEventListener('mouseleave', () => {
        const barra = el.querySelector('.notificacao__progresso');
        if (barra) barra.style.animationPlayState = 'running';
        tempoId = setTimeout(fechar, 1500);
    });
}

export function mostrarConfirmacao(mensagem, titulo = 'Confirmar exclusão') {
    return new Promise((resolve) => {
        const fundo = document.createElement('div');
        fundo.className = 'confirmar-fundo';
        fundo.innerHTML = `
            <div class="confirmar-modal">
                <div class="confirmar-modal__icone">
                    <span class="material-icons-outlined">warning_amber</span>
                </div>
                <h3 class="confirmar-modal__titulo">${titulo}</h3>
                <p class="confirmar-modal__texto">${mensagem}</p>
                <div class="confirmar-modal__acoes">
                    <button class="botao botao--neutro" data-acao="cancelar">
                        <span class="material-icons-outlined">close</span>
                        Cancelar
                    </button>
                    <button class="botao botao--perigo" data-acao="confirmar">
                        <span class="material-icons-outlined">delete_outline</span>
                        Excluir
                    </button>
                </div>
            </div>
        `;

        const fechar = (resultado) => {
            fundo.classList.add('confirmar-fundo--saindo');
            fundo.addEventListener('animationend', () => {
                fundo.remove();
                resolve(resultado);
            }, { once: true });
        };

        fundo.querySelector('[data-acao="cancelar"]').addEventListener('click', () => fechar(false));
        fundo.querySelector('[data-acao="confirmar"]').addEventListener('click', () => fechar(true));
        fundo.addEventListener('click', (e) => { if (e.target === fundo) fechar(false); });

        const escHandler = (e) => {
            if (e.key === 'Escape') {
                fechar(false);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        document.body.appendChild(fundo);

        requestAnimationFrame(() => {
            fundo.querySelector('[data-acao="confirmar"]').focus();
        });
    });
}
