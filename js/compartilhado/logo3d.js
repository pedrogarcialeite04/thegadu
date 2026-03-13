export function iniciarLogo3D() {
    const container = document.getElementById('logo3dContainer');
    const canvas = document.getElementById('logo3dCanvas');
    if (!container || !canvas) return;

    const TAMANHO = 160;
    canvas.width = TAMANHO;
    canvas.height = TAMANHO;

    const cena = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3;

    const renderizador = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });
    renderizador.setSize(TAMANHO, TAMANHO);
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderizador.setClearColor(0x000000, 0);

    const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
    cena.add(luzAmbiente);

    const luzPrincipal = new THREE.DirectionalLight(0xffffff, 1.0);
    luzPrincipal.position.set(2, 3, 4);
    cena.add(luzPrincipal);

    const luzAzul = new THREE.PointLight(0x6B7FD7, 1.5, 10);
    luzAzul.position.set(-2, 1, 3);
    cena.add(luzAzul);

    const luzRoxa = new THREE.PointLight(0x8FA0E8, 1.0, 10);
    luzRoxa.position.set(2, -1, 2);
    cena.add(luzRoxa);

    const grupo = new THREE.Group();
    cena.add(grupo);

    const carregador = new THREE.TextureLoader();
    carregador.load('imagens/imgthegadu-removebg-preview.png', (textura) => {
        textura.anisotropy = renderizador.capabilities.getMaxAnisotropy();

        const geometria = new THREE.PlaneGeometry(1.5, 1.5);
        const material = new THREE.MeshStandardMaterial({
            map: textura,
            transparent: true,
            side: THREE.DoubleSide,
            roughness: 0.3,
            metalness: 0.1,
        });

        const planoLogo = new THREE.Mesh(geometria, material);
        grupo.add(planoLogo);

        const geometriaAnel = new THREE.TorusGeometry(0.95, 0.015, 16, 64);
        const materialAnel = new THREE.MeshStandardMaterial({
            color: 0x6B7FD7,
            emissive: 0x6B7FD7,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.5,
            roughness: 0.2,
            metalness: 0.8
        });
        const anel = new THREE.Mesh(geometriaAnel, materialAnel);
        anel.position.z = -0.05;
        grupo.add(anel);

        const qntParticulas = 40;
        const geometriaParticulas = new THREE.BufferGeometry();
        const posicoes = new Float32Array(qntParticulas * 3);

        for (let i = 0; i < qntParticulas; i++) {
            const angulo = (i / qntParticulas) * Math.PI * 2;
            const raio = 1.0 + Math.random() * 0.35;
            posicoes[i * 3] = Math.cos(angulo) * raio;
            posicoes[i * 3 + 1] = Math.sin(angulo) * raio;
            posicoes[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
        }

        geometriaParticulas.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));

        const materialParticulas = new THREE.PointsMaterial({
            color: 0x8FA0E8,
            size: 0.03,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particulas = new THREE.Points(geometriaParticulas, materialParticulas);
        grupo.add(particulas);

        iniciarInteracao(container, grupo, anel, particulas);
        animar(renderizador, cena, camera, grupo, anel, particulas, luzAzul, luzRoxa);
    });
}

function iniciarInteracao(container, grupo, anel, particulas) {
    let mouseX = 0;
    let mouseY = 0;
    let hovering = false;

    const menuLateral = document.getElementById('menuLateral');
    const alvo = menuLateral || container;

    alvo.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const centroX = rect.left + rect.width / 2;
        const centroY = rect.top + rect.height / 2;

        mouseX = ((e.clientX - centroX) / (rect.width / 2));
        mouseY = -((e.clientY - centroY) / (rect.height / 2));

        mouseX = Math.max(-1, Math.min(1, mouseX));
        mouseY = Math.max(-1, Math.min(1, mouseY));
    });

    container.addEventListener('mouseenter', () => { hovering = true; });
    container.addEventListener('mouseleave', () => { hovering = false; });

    grupo._interacao = { mouseX: () => mouseX, mouseY: () => mouseY, hovering: () => hovering };
}

function animar(renderizador, cena, camera, grupo, anel, particulas, luzAzul, luzRoxa) {
    const relogio = new THREE.Clock();
    const interacao = grupo._interacao;

    let rotAlvoX = 0;
    let rotAlvoY = 0;
    let escalaAtual = 1;

    function loop() {
        requestAnimationFrame(loop);
        const tempo = relogio.getElapsedTime();
        const hovering = interacao.hovering();

        const escalaAlvo = hovering ? 1.08 : 1;
        escalaAtual += (escalaAlvo - escalaAtual) * 0.08;
        grupo.scale.setScalar(escalaAtual);

        const flutuacaoY = Math.sin(tempo * 1.5) * 0.03;
        const flutuacaoX = Math.cos(tempo * 1.2) * 0.015;

        if (hovering) {
            rotAlvoX = interacao.mouseY() * 0.4;
            rotAlvoY = interacao.mouseX() * 0.4;
        } else {
            rotAlvoX = Math.sin(tempo * 0.8) * 0.1;
            rotAlvoY = Math.cos(tempo * 0.6) * 0.1;
        }

        grupo.rotation.x += (rotAlvoX - grupo.rotation.x) * 0.06;
        grupo.rotation.y += (rotAlvoY - grupo.rotation.y) * 0.06;
        grupo.position.y = flutuacaoY;
        grupo.position.x = flutuacaoX;

        anel.rotation.z = tempo * 0.3;

        if (anel.material) {
            anel.material.opacity = 0.3 + Math.sin(tempo * 2) * 0.2;
            anel.material.emissiveIntensity = 0.3 + Math.sin(tempo * 1.5) * 0.2;
        }

        const posicoes = particulas.geometry.attributes.position.array;
        for (let i = 0; i < posicoes.length; i += 3) {
            const angOriginal = Math.atan2(posicoes[i + 1], posicoes[i]);
            const raio = Math.sqrt(posicoes[i] ** 2 + posicoes[i + 1] ** 2);
            const novoAng = angOriginal + 0.002;
            posicoes[i] = Math.cos(novoAng) * raio;
            posicoes[i + 1] = Math.sin(novoAng) * raio;
            posicoes[i + 2] = Math.sin(tempo * 2 + i) * 0.08;
        }
        particulas.geometry.attributes.position.needsUpdate = true;

        if (particulas.material) {
            particulas.material.opacity = 0.4 + Math.sin(tempo * 1.8) * 0.2;
        }

        luzAzul.position.x = Math.sin(tempo * 0.7) * 3;
        luzAzul.position.y = Math.cos(tempo * 0.5) * 2;
        luzRoxa.position.x = Math.cos(tempo * 0.9) * 2;
        luzRoxa.position.y = Math.sin(tempo * 0.6) * 3;

        renderizador.render(cena, camera);
    }

    loop();
}
