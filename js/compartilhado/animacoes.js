export function iniciarAnimacoes() {
    animarEntradaPagina();
    configurarMicroInteracoes();
}

function animarEntradaPagina() {
    const elementosAnimados = [
        '.menu-lateral',
        '.cabecalho-mobile',
        '.logo3d-container',
        '.menu-lateral__botao',
        '.cartao-resumo',
        '.pagina__cabecalho > div',
        '.pagina__icone',
        '.formulario',
        '.cartao-tabela'
    ];

    elementosAnimados.forEach((seletor, i) => {
        document.querySelectorAll(seletor).forEach((el, j) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(16px)';

            requestAnimationFrame(() => {
                el.style.transition = `opacity 0.35s ease-out ${(i + j) * 60}ms, transform 0.35s ease-out ${(i + j) * 60}ms`;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        });
    });
}

function configurarMicroInteracoes() {
    document.querySelectorAll('.botao').forEach(botao => {
        botao.addEventListener('mousemove', (e) => {
            const rect = botao.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            botao.style.setProperty('--x', x + '%');
            botao.style.setProperty('--y', y + '%');
        });
    });

    document.querySelectorAll('.pagina__icone').forEach(icone => {
        icone.addEventListener('mouseenter', () => {
            icone.style.transition = 'transform 0.3s ease';
            icone.style.transform = 'scale(1.1) rotate(5deg)';
        });
        icone.addEventListener('mouseleave', () => {
            icone.style.transition = 'transform 0.25s ease';
            icone.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    document.querySelectorAll('.cartao-resumo').forEach(cartao => {
        const iconEl = cartao.querySelector('.material-icons-outlined');
        if (!iconEl) return;
        cartao.addEventListener('mouseenter', () => {
            iconEl.style.transition = 'transform 0.3s ease';
            iconEl.style.transform = 'scale(1.15) rotate(8deg)';
        });
        cartao.addEventListener('mouseleave', () => {
            iconEl.style.transition = 'transform 0.25s ease';
            iconEl.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}
