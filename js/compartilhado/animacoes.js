export function iniciarAnimacoes() {
    gsap.registerPlugin(ScrollTrigger);

    animarEntradaPagina();
    configurarScrollTriggers();
    configurarMicroInteracoes();
}

function animarEntradaPagina() {
    const tl = gsap.timeline({
        defaults: { ease: 'back.out(1.7)', duration: 0.3 },
        onComplete: () => limparEstilosEntrada()
    });

    const eMobile = window.innerWidth <= 768;

    if (eMobile) {
        tl.fromTo('.cabecalho-mobile',
            { y: -40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.25, ease: 'power3.out' }
        );
    } else {
        tl.fromTo('.menu-lateral',
            { x: -80 },
            { x: 0, duration: 0.35, ease: 'power3.out' }
        );
    }

    tl.fromTo('.logo3d-container',
        { scale: 0, rotation: -90, autoAlpha: 0 },
        { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.5)' },
        '-=0.15'
    );

    tl.fromTo('.menu-lateral__botao',
        { y: 30, autoAlpha: 0, scale: 0.6 },
        { y: 0, autoAlpha: 1, scale: 1, stagger: 0.05, duration: 0.25, ease: 'back.out(3)' },
        '-=0.2'
    );

    tl.fromTo('.cartao-resumo',
        { y: 30, autoAlpha: 0, scale: 0.7 },
        { y: 0, autoAlpha: 1, scale: 1, stagger: 0.06, duration: 0.25, ease: 'back.out(2.5)' },
        '-=0.1'
    );

    const paginaAtiva = document.querySelector('.pagina.ativo');
    if (paginaAtiva) {
        animarElementosPagina(tl, paginaAtiva);
    }
}

function limparEstilosEntrada() {
    gsap.set('.menu-lateral, .logo3d-container, .menu-lateral__botao, .cartao-resumo', {
        clearProps: 'all'
    });
}

function animarElementosPagina(tl, pagina) {
    const cabecalhoTexto = pagina.querySelector('.pagina__cabecalho > div');
    const icone = pagina.querySelector('.pagina__icone');
    const formulario = pagina.querySelector('.formulario');
    const campos = pagina.querySelectorAll('.formulario .campo');
    const botoesForm = pagina.querySelectorAll('.formulario__acoes .botao');
    const cartaoTabela = pagina.querySelector('.cartao-tabela');

    if (cabecalhoTexto) {
        tl.fromTo(cabecalhoTexto,
            { y: 25, autoAlpha: 0, scale: 0.9 },
            { y: 0, autoAlpha: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' },
            '-=0.1'
        );
    }

    if (icone) {
        tl.fromTo(icone,
            { scale: 0, autoAlpha: 0, rotation: -20 },
            { scale: 1, autoAlpha: 1, rotation: 0, duration: 0.3, ease: 'back.out(4)' },
            '-=0.15'
        );
    }

    if (formulario) {
        tl.fromTo(formulario,
            { y: 35, autoAlpha: 0, scale: 0.95 },
            { y: 0, autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(1.5)' },
            '-=0.1'
        );
    }

    if (campos.length) {
        tl.fromTo(campos,
            { y: 20, autoAlpha: 0, scale: 0.85 },
            { y: 0, autoAlpha: 1, scale: 1, stagger: 0.04, duration: 0.2, ease: 'back.out(3)' },
            '-=0.15'
        );
    }

    if (botoesForm.length) {
        tl.fromTo(botoesForm,
            { y: 15, autoAlpha: 0, scale: 0.7 },
            { y: 0, autoAlpha: 1, scale: 1, stagger: 0.04, duration: 0.2, ease: 'back.out(3.5)' },
            '-=0.1'
        );
    }

    if (cartaoTabela) {
        tl.fromTo(cartaoTabela,
            { y: 30, autoAlpha: 0, scale: 0.96 },
            { y: 0, autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(1.8)' },
            '-=0.1'
        );
    }
}

function configurarScrollTriggers() {
    gsap.utils.toArray('.cartao-tabela').forEach(cartao => {
        gsap.fromTo(cartao,
            { boxShadow: '0 1px 3px rgba(26,29,46,0.06)' },
            {
                boxShadow: '0 12px 40px rgba(107,127,215,0.12)',
                scrollTrigger: {
                    trigger: cartao,
                    start: 'top 80%',
                    end: 'top 30%',
                    scrub: true
                }
            }
        );
    });

    gsap.utils.toArray('.formulario').forEach(form => {
        gsap.fromTo(form,
            { boxShadow: '0 1px 3px rgba(26,29,46,0.06)' },
            {
                boxShadow: '0 8px 32px rgba(107,127,215,0.08)',
                scrollTrigger: {
                    trigger: form,
                    start: 'top 85%',
                    end: 'top 40%',
                    scrub: true
                }
            }
        );
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

    const icones = document.querySelectorAll('.pagina__icone');
    icones.forEach(icone => {
        icone.addEventListener('mouseenter', () => {
            gsap.to(icone, {
                scale: 1.12,
                rotation: 5,
                duration: 0.4,
                ease: 'back.out(2)'
            });
        });
        icone.addEventListener('mouseleave', () => {
            gsap.to(icone, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    document.querySelectorAll('.campo__entrada').forEach(campo => {
        campo.addEventListener('focus', () => {
            gsap.fromTo(campo,
                { boxShadow: '0 0 0 0px rgba(107,127,215,0)' },
                { boxShadow: '0 0 0 3px rgba(107,127,215,0.08), 0 2px 8px rgba(107,127,215,0.1)', duration: 0.3, ease: 'power2.out' }
            );
        });
    });

    const cartoes = document.querySelectorAll('.cartao-resumo');
    cartoes.forEach(cartao => {
        cartao.addEventListener('mouseenter', () => {
            gsap.to(cartao.querySelector('.material-icons-outlined'), {
                scale: 1.2,
                rotation: 10,
                duration: 0.35,
                ease: 'back.out(2)'
            });
        });
        cartao.addEventListener('mouseleave', () => {
            gsap.to(cartao.querySelector('.material-icons-outlined'), {
                scale: 1,
                rotation: 0,
                duration: 0.25,
                ease: 'power2.out'
            });
        });
    });
}
