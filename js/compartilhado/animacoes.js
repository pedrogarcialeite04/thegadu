export function iniciarAnimacoes() {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    animarEntradaPagina();
    configurarMicroInteracoes();
}

function animarEntradaPagina() {
    const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.35 }
    });

    const eMobile = window.innerWidth <= 768;

    if (eMobile) {
        tl.from('.cabecalho-mobile', { y: -30, opacity: 0, duration: 0.25 });
    } else {
        tl.from('.menu-lateral', { x: -40, opacity: 0, duration: 0.3 });
    }

    tl.from('.logo3d-container', {
        scale: 0.8, opacity: 0, duration: 0.3, ease: 'back.out(1.5)'
    }, '-=0.15');

    tl.from('.menu-lateral__botao', {
        y: 15, opacity: 0, stagger: 0.04, duration: 0.2
    }, '-=0.15');

    tl.from('.cartao-resumo', {
        y: 15, opacity: 0, stagger: 0.05, duration: 0.2
    }, '-=0.1');

    const paginaAtiva = document.querySelector('.pagina.ativo');
    if (paginaAtiva) {
        animarElementosPagina(tl, paginaAtiva);
    }
}

function animarElementosPagina(tl, pagina) {
    const cabecalhoTexto = pagina.querySelector('.pagina__cabecalho > div');
    const icone = pagina.querySelector('.pagina__icone');
    const formulario = pagina.querySelector('.formulario');
    const cartaoTabela = pagina.querySelector('.cartao-tabela');

    if (cabecalhoTexto) {
        tl.from(cabecalhoTexto, { y: 15, opacity: 0, duration: 0.2 }, '-=0.05');
    }

    if (icone) {
        tl.from(icone, { scale: 0.6, opacity: 0, duration: 0.25, ease: 'back.out(2)' }, '-=0.1');
    }

    if (formulario) {
        tl.from(formulario, { y: 20, opacity: 0, duration: 0.25 }, '-=0.1');
    }

    if (cartaoTabela) {
        tl.from(cartaoTabela, { y: 20, opacity: 0, duration: 0.25 }, '-=0.05');
    }
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
            gsap.to(icone, { scale: 1.1, rotation: 5, duration: 0.3, ease: 'back.out(2)' });
        });
        icone.addEventListener('mouseleave', () => {
            gsap.to(icone, { scale: 1, rotation: 0, duration: 0.25, ease: 'power2.out' });
        });
    });

    document.querySelectorAll('.cartao-resumo').forEach(cartao => {
        const iconEl = cartao.querySelector('.material-icons-outlined');
        if (!iconEl) return;
        cartao.addEventListener('mouseenter', () => {
            gsap.to(iconEl, { scale: 1.15, rotation: 8, duration: 0.3, ease: 'back.out(2)' });
        });
        cartao.addEventListener('mouseleave', () => {
            gsap.to(iconEl, { scale: 1, rotation: 0, duration: 0.25, ease: 'power2.out' });
        });
    });
}
