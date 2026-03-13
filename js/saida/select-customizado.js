const ICONES_MOTIVO = {
    'Venda':                 'point_of_sale',
    'Devolução Fornecedor':  'assignment_return',
    'Perda/Avaria':          'report_problem',
    'Uso Interno':           'home_work',
    'Outro':                 'more_horiz'
};

class SelectCustomizado {
    constructor(selectNativo, opcoes = {}) {
        this.select = selectNativo;
        this.buscavel = opcoes.buscavel ?? false;
        this.icones = opcoes.icones ?? {};
        this.placeholder = opcoes.placeholder ?? 'Selecione...';
        this.iconePadrao = opcoes.iconePadrao ?? 'list';
        this.aberto = false;
        this.indiceFoco = -1;

        this._construir();
        this._vincularEventos();
        this._observarMudancas();
    }

    _construir() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'selecao-custom';

        const textoPlaceholder = this.select.options[0]?.text || this.placeholder;

        this.gatilho = document.createElement('button');
        this.gatilho.type = 'button';
        this.gatilho.className = 'selecao-custom__gatilho';
        this.gatilho.setAttribute('role', 'combobox');
        this.gatilho.setAttribute('aria-expanded', 'false');
        this.gatilho.setAttribute('aria-haspopup', 'listbox');
        this.gatilho.innerHTML = `
            <span class="selecao-custom__icone-sel">
                <span class="material-icons-outlined">${this.iconePadrao}</span>
            </span>
            <span class="selecao-custom__valor selecao-custom__valor--placeholder">${textoPlaceholder}</span>
            <span class="selecao-custom__seta">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </span>
        `;

        this.painel = document.createElement('div');
        this.painel.className = 'selecao-custom__painel';
        this.painel.setAttribute('role', 'listbox');

        if (this.buscavel) {
            const buscaWrapper = document.createElement('div');
            buscaWrapper.className = 'selecao-custom__busca-wrapper';
            buscaWrapper.innerHTML = `
                <span class="material-icons-outlined">search</span>
                <input type="text" class="selecao-custom__busca" placeholder="Buscar..." autocomplete="off">
            `;
            this.painel.appendChild(buscaWrapper);
            this.inputBusca = buscaWrapper.querySelector('input');
        }

        this.lista = document.createElement('div');
        this.lista.className = 'selecao-custom__lista';
        this.painel.appendChild(this.lista);

        this.wrapper.appendChild(this.gatilho);

        document.body.appendChild(this.painel);

        this.select.style.display = 'none';
        this.select.parentNode.insertBefore(this.wrapper, this.select.nextSibling);

        this._renderizarOpcoes();
    }

    _renderizarOpcoes(filtro = '') {
        this.lista.innerHTML = '';
        const opcoes = Array.from(this.select.options);
        const filtroLower = filtro.toLowerCase();
        let temResultados = false;

        opcoes.forEach((opcao, indice) => {
            if (indice === 0 && !opcao.value) return;

            const texto = opcao.text;
            const valorBusca = `${opcao.value} ${texto} ${opcao.dataset.descricao || ''}`;
            if (filtro && !valorBusca.toLowerCase().includes(filtroLower)) return;

            temResultados = true;
            const el = document.createElement('div');
            el.className = 'selecao-custom__opcao';
            if (opcao.value === this.select.value) {
                el.classList.add('selecao-custom__opcao--ativo');
            }
            el.setAttribute('role', 'option');
            el.setAttribute('data-valor', opcao.value);
            el.setAttribute('data-indice', indice);

            const icone = this.icones[opcao.value] || this.iconePadrao;

            const textoSecundario = opcao.dataset.descricao
                ? `<span class="selecao-custom__opcao-detalhe">${opcao.dataset.descricao} — ${opcao.dataset.qtd || 0} un.</span>`
                : '';

            const textoExibicao = opcao.dataset.descricao
                ? opcao.value
                : texto;

            el.innerHTML = `
                <span class="selecao-custom__opcao-icone">
                    <span class="material-icons-outlined">${icone}</span>
                </span>
                <div class="selecao-custom__opcao-conteudo">
                    <span class="selecao-custom__opcao-texto">${textoExibicao}</span>
                    ${textoSecundario}
                </div>
                ${opcao.value === this.select.value ? '<span class="material-icons-outlined selecao-custom__opcao-check">check</span>' : ''}
            `;

            el.addEventListener('click', () => this._selecionarPorIndice(indice));
            el.addEventListener('mouseenter', () => {
                this._limparFoco();
                el.classList.add('selecao-custom__opcao--foco');
                this.indiceFoco = Array.from(this.lista.children).indexOf(el);
            });

            this.lista.appendChild(el);
        });

        if (!temResultados) {
            const vazio = document.createElement('div');
            vazio.className = 'selecao-custom__vazio';
            vazio.innerHTML = `
                <span class="material-icons-outlined">search_off</span>
                <span>Nenhum resultado encontrado</span>
            `;
            this.lista.appendChild(vazio);
        }
    }

    _selecionarPorIndice(indice) {
        this.select.selectedIndex = indice;
        this.select.dispatchEvent(new Event('change', { bubbles: true }));
        this._atualizarGatilho();
        this.fechar();
    }

    _atualizarGatilho() {
        const opcaoSelecionada = this.select.options[this.select.selectedIndex];
        const elValor = this.gatilho.querySelector('.selecao-custom__valor');
        const elIcone = this.gatilho.querySelector('.selecao-custom__icone-sel .material-icons-outlined');

        if (!opcaoSelecionada || !opcaoSelecionada.value) {
            const textoPlaceholder = this.select.options[0]?.text || this.placeholder;
            elValor.textContent = textoPlaceholder;
            elValor.classList.add('selecao-custom__valor--placeholder');
            elIcone.textContent = this.iconePadrao;
        } else {
            const textoExibicao = opcaoSelecionada.dataset.descricao
                ? `${opcaoSelecionada.value} — ${opcaoSelecionada.dataset.descricao}`
                : opcaoSelecionada.text;

            elValor.textContent = textoExibicao;
            elValor.classList.remove('selecao-custom__valor--placeholder');
            elIcone.textContent = this.icones[opcaoSelecionada.value] || this.iconePadrao;
        }
    }

    abrir() {
        if (this.aberto) return;
        this.aberto = true;

        document.querySelectorAll('.selecao-custom__painel--aberto').forEach(el => {
            const inst = el._instanciaSelect;
            if (inst && inst !== this) inst.fechar();
        });

        this._renderizarOpcoes();
        this._posicionarPainel();
        this.wrapper.classList.add('selecao-custom--aberto');
        this.painel.classList.add('selecao-custom__painel--aberto');
        this.gatilho.setAttribute('aria-expanded', 'true');
        this.indiceFoco = -1;

        if (this.inputBusca) {
            this.inputBusca.value = '';
            requestAnimationFrame(() => this.inputBusca.focus());
        }
    }

    fechar() {
        if (!this.aberto) return;
        this.aberto = false;
        this.wrapper.classList.remove('selecao-custom--aberto');
        this.painel.classList.add('selecao-custom__painel--fechando');
        this.gatilho.setAttribute('aria-expanded', 'false');

        setTimeout(() => {
            this.painel.classList.remove('selecao-custom__painel--aberto', 'selecao-custom__painel--fechando');
        }, 200);
    }

    _posicionarPainel() {
        const rect = this.gatilho.getBoundingClientRect();
        const espacoAbaixo = window.innerHeight - rect.bottom - 12;
        const espacoAcima = rect.top - 12;
        const alturaEstimada = Math.min(this.select.options.length * 56 + (this.buscavel ? 56 : 16), 340);
        const abrirAcima = espacoAbaixo < alturaEstimada && espacoAcima > espacoAbaixo;

        this.painel.style.width = rect.width + 'px';
        this.painel.style.left = rect.left + 'px';

        if (abrirAcima) {
            this.painel.style.top = 'auto';
            this.painel.style.bottom = (window.innerHeight - rect.top + 6) + 'px';
            this.painel.classList.add('selecao-custom__painel--acima');
        } else {
            this.painel.style.top = (rect.bottom + 6) + 'px';
            this.painel.style.bottom = 'auto';
            this.painel.classList.remove('selecao-custom__painel--acima');
        }

        this.painel.style.maxHeight = Math.min(abrirAcima ? espacoAcima : espacoAbaixo, 340) + 'px';
    }

    _limparFoco() {
        this.lista.querySelectorAll('.selecao-custom__opcao--foco').forEach(el => {
            el.classList.remove('selecao-custom__opcao--foco');
        });
    }

    _vincularEventos() {
        this.painel._instanciaSelect = this;

        this.gatilho.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.aberto ? this.fechar() : this.abrir();
        });

        if (this.inputBusca) {
            this.inputBusca.addEventListener('input', () => {
                this._renderizarOpcoes(this.inputBusca.value);
                this.indiceFoco = -1;
            });

            this.inputBusca.addEventListener('keydown', (e) => {
                this._navegarTeclado(e);
            });
        }

        this.gatilho.addEventListener('keydown', (e) => {
            if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
                e.preventDefault();
                if (!this.aberto) this.abrir();
                else this._navegarTeclado(e);
            }
        });

        document.addEventListener('click', (e) => {
            if (this.aberto && !this.wrapper.contains(e.target) && !this.painel.contains(e.target)) {
                this.fechar();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.aberto) {
                this.fechar();
                this.gatilho.focus();
            }
        });

        window.addEventListener('scroll', () => {
            if (this.aberto) this._posicionarPainel();
        }, true);

        window.addEventListener('resize', () => {
            if (this.aberto) this._posicionarPainel();
        });

        const form = this.select.closest('form');
        if (form) {
            form.addEventListener('reset', () => {
                requestAnimationFrame(() => {
                    this._atualizarGatilho();
                    this._renderizarOpcoes();
                });
            });
        }
    }

    _navegarTeclado(e) {
        const itens = this.lista.querySelectorAll('.selecao-custom__opcao');
        if (!itens.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.indiceFoco = Math.min(this.indiceFoco + 1, itens.length - 1);
            this._limparFoco();
            itens[this.indiceFoco].classList.add('selecao-custom__opcao--foco');
            itens[this.indiceFoco].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.indiceFoco = Math.max(this.indiceFoco - 1, 0);
            this._limparFoco();
            itens[this.indiceFoco].classList.add('selecao-custom__opcao--foco');
            itens[this.indiceFoco].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.indiceFoco >= 0 && itens[this.indiceFoco]) {
                const indice = parseInt(itens[this.indiceFoco].dataset.indice);
                this._selecionarPorIndice(indice);
            }
        }
    }

    _observarMudancas() {
        this.observer = new MutationObserver(() => {
            this._renderizarOpcoes();
            this._atualizarGatilho();
        });

        this.observer.observe(this.select, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });
    }

    destruir() {
        this.observer?.disconnect();
        this.select.style.display = '';
        this.painel.remove();
        this.wrapper.remove();
    }
}

export function iniciarSelectsCustomizados() {
    new SelectCustomizado(document.querySelector('#saidaCodigo'), {
        buscavel: true,
        placeholder: 'Selecione um produto',
        iconePadrao: 'inventory_2',
        icones: {}
    });

    new SelectCustomizado(document.querySelector('#saidaMotivo'), {
        buscavel: false,
        placeholder: 'Selecione o motivo',
        iconePadrao: 'label',
        icones: ICONES_MOTIVO
    });
}
