// ==================== THREE.JS OTIMIZADO ====================
function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 1, 5.8);

    // Iluminação
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xd4af37, 1.5, 50);
    pointLight.position.set(-3, 4, 6);
    scene.add(pointLight);

    const group = new THREE.Group();
    scene.add(group);

    const goldMat = new THREE.MeshPhongMaterial({ color: 0xd4af37, shininess: 95 });
    const darkGoldMat = new THREE.MeshPhongMaterial({ color: 0xa67c52, shininess: 70 });

    // Torus Knot central
    const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(1.1, 0.3, 160, 20, 2, 3), goldMat);
    group.add(torus);

    // Esferas orbitando
    const sphereGeo = new THREE.SphereGeometry(0.2, 32, 32);
    for (let i = 0; i < 6; i++) {
        const s = new THREE.Mesh(sphereGeo, i % 2 === 0 ? goldMat : darkGoldMat);
        s.userData = { angle: (i / 6) * Math.PI * 2, radius: 2.9, speed: 0.3 + i * 0.05 };
        group.add(s);
    }

    // Anéis decorativos
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.05, 16, 70), goldMat);
    ring1.rotation.x = Math.PI / 2;
    group.add(ring1);

    let targetY = 0, targetX = 0;

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        targetY = ((e.clientX - rect.left) / rect.width - 0.5) * 1.4;
        targetX = ((e.clientY - rect.top) / rect.height - 0.5) * -0.8;
    });

    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
    });

    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;

        group.rotation.y += (targetY - group.rotation.y) * 0.05;
        group.rotation.x += (targetX - group.rotation.x) * 0.05;
        group.rotation.y += 0.0015;

        const time = Date.now() * 0.001;
        group.children.forEach(child => {
            if (child.userData.angle !== undefined) {
                const { angle, radius, speed } = child.userData;
                const t = time * speed;
                child.position.x = Math.cos(t + angle) * radius;
                child.position.z = Math.sin(t + angle) * radius * 0.7;
                child.position.y = Math.sin(t * 1.6) * 1.0;
            }
        });

        renderer.render(scene, camera);
    }
    animate();

    function resize() {
        const w = canvas.parentElement.clientWidth;
        const h = canvas.parentElement.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener('resize', resize);
    setTimeout(resize, 100);
}

// ==================== LOJAS ====================
const stores = [
    { id: 1, zona: "Zona Sul", nome: "Loja 1 - Jatuarana", subtitulo: "Nº 4204", endereco: "Av. Jatuarana, 4204 - Conceição, Porto Velho - RO, 76808-278", wa: "https://api.whatsapp.com/send/?phone=556984936647&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0", map: "https://maps.app.goo.gl/Yjwqxytv7s2A2Wxs8" },
    { id: 2, zona: "Zona Sul", nome: "Loja 2 - Av. Jatuarana", subtitulo: "Nº 4855", endereco: "Av. Jatuarana, 4855 - Nova Floresta, Porto Velho - RO, 76807-441", wa: "https://api.whatsapp.com/send/?phone=556992291429&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0", map: "https://www.google.com/maps/search/?api=1&query=Av.+Jatuarana%2C+4855+-+Nova+Floresta%2C+Porto+Velho+-+RO" },
    { id: 3, zona: "Zona Leste", nome: "Loja 3 - José Amador dos Reis", subtitulo: "Nº 2900 • Atendimento", endereco: "Av. José Amador dos Reis, 2900 - Tancredo Neves, Porto Velho - RO, 76829-422", wa: "https://api.whatsapp.com/send/?phone=556992713872&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0", map: "https://www.google.com/maps/search/?api=1&query=Av.+Jos%C3%A9+Amador+dos+Reis%2C+2900+-+Tancredo+Neves%2C+Porto+Velho+-+RO" },
    { id: 4, zona: "Zona Sul", nome: "Loja 4 - Av. Jatuarana", subtitulo: "Nº 4677", endereco: "Av. Jatuarana, 4677 - Nova Floresta, Porto Velho - RO, 76807-313", wa: "https://api.whatsapp.com/send/?phone=556993372596&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0", map: "https://www.google.com/maps/search/?api=1&query=Av.+Jatuarana%2C+4677+-+Nova+Floresta%2C+Porto+Velho+-+RO" },
    { id: 5, zona: "Zona Leste", nome: "Loja 5 - José Amador dos Reis", subtitulo: "Nº 3368 • Atendimento", endereco: "Av. José Amador dos Reis, 3368 - Tancredo Neves, Porto Velho - RO, 76829-498", wa: "https://api.whatsapp.com/send/?phone=556993505182&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0", map: "https://www.google.com/maps/search/?api=1&query=Av.+Jos%C3%A9+Amador+dos+Reis%2C+3368+-+Tancredo+Neves%2C+Porto+Velho+-+RO" },
    { id: 6, zona: "Centro", nome: "Loja 6 - Dom Pedro II", subtitulo: "Nº 1382 • Localização", endereco: "R. Dom Pedro II, 1382 - São Cristóvão, Porto Velho - RO, 76801-102", wa: "https://api.whatsapp.com/send/?phone=556992928005&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0", map: "https://www.google.com/maps/search/?api=1&query=R.+Dom+Pedro+II%2C+1382+-+S%C3%A3o+Crist%C3%B3v%C3%A3o%2C+Porto+Velho+-+RO" },
    { id: 7, zona: "Centro", nome: "Loja 7 - Av. Sete de Setembro", subtitulo: "Nº 1074", endereco: "Av. Sete de Setembro, 1074 - Centro, Porto Velho - RO, 76820-120", wa: "https://api.whatsapp.com/send/?phone=556992764063&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0", map: "https://www.google.com/maps/search/?api=1&query=Av.+Sete+de+Setembro%2C+1074+-+Centro%2C+Porto+Velho+-+RO" },
    { id: 8, zona: "Zona Leste", nome: "Loja 8 - Rua União", subtitulo: "Nº 1881", endereco: "R. União, 1881 - São Francisco, Porto Velho - RO, 76802-330", wa: "https://api.whatsapp.com/send/?phone=556992243771&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0", map: "https://www.google.com/maps/search/?api=1&query=R.+Uni%C3%A3o%2C+1881+-+S%C3%A3o+Francisco%2C+Porto+Velho+-+RO" },
    { id: 9, zona: "Zona Leste", nome: "Loja 9 - Av. Sete de Setembro", subtitulo: "Nº 927", endereco: "Av. Sete de Setembro, 927 - Centro, Porto Velho - RO, 76801-073", wa: "https://api.whatsapp.com/send/?phone=556992634390&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0", map: "https://www.google.com/maps/search/?api=1&query=Av.+Sete+de+Setembro%2C+927+-+Centro%2C+Porto+Velho+-+RO" },
    { id: 10, zona: "Jaru", nome: "Loja Jaru", subtitulo: "Rua Padre Adolfo Rohl, 1560", endereco: "Av. Padre Adolpho Rohl, 1560 - St. 2, Jaru - RO, 76890-000", wa: "https://api.whatsapp.com/send/?phone=556992337081&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0", map: "https://www.google.com/maps/search/?api=1&query=Av.+Padre+Adolpho+Rohl%2C+1560+-+St.+2%2C+Jaru+-+RO" }
];

let currentFilter = 'all';

function renderStores(filter = 'all') {
    const container = document.getElementById('stores-grid');
    container.innerHTML = '';

    const filtered = filter === 'all' ? stores : stores.filter(s => s.zona === filter);

    filtered.forEach((store, index) => {
        const card = document.createElement('div');
        card.className = `store-card rounded-3xl p-6 flex flex-col animate-fade-up`;
        card.style.animationDelay = `${index * 80}ms`;

        card.innerHTML = `
            <div>
                <span class="px-3 py-1 text-xs font-medium tracking-wider rounded-full bg-white/5 text-[#d4af37]">${store.zona}</span>
                <h3 class="font-semibold text-2xl mt-3 tracking-tight">${store.nome}</h3>
                <p class="text-sm text-white/60">${store.subtitulo}</p>
            </div>
            
            <div class="mt-4 flex-1">
                <div class="flex items-start gap-x-2 text-sm text-white/70">
                    <i class="fas fa-map-marker-alt mt-1 text-[#d4af37]"></i>
                    <span>${store.endereco}</span>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 mt-6">
                <a href="${store.wa}" target="_blank" 
                   class="flex-1 flex items-center justify-center gap-x-2 h-11 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-sm font-semibold transition-all">
                    <i class="fab fa-whatsapp"></i>
                    <span>WhatsApp</span>
                </a>
                <button onclick="openMapModal(${store.id})" 
                        class="flex-1 flex items-center justify-center gap-x-2 h-11 rounded-2xl border border-white/20 hover:bg-white/5 text-sm font-medium transition-all">
                    <i class="fas fa-map"></i>
                    <span>Ver no Mapa</span>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderStores(currentFilter);
        });
    });
}

// ==================== MODAL DO MAPA ====================
function openMapModal(storeId) {
    const store = stores.find(s => s.id === storeId);
    if (!store) return;

    const modal = document.getElementById('map-modal');
    const title = document.getElementById('modal-title');
    const container = document.getElementById('map-container');

    title.textContent = store.nome;
    container.innerHTML = `<iframe src="${store.map}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

document.getElementById('close-modal').addEventListener('click', () => {
    const modal = document.getElementById('map-modal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
});

// ==================== INICIALIZAÇÃO ====================
function init() {
    initThreeJS();
    initFilters();
    renderStores('all');

    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            alert('Menu mobile - você pode expandir isso depois se quiser');
        });
    }
}

window.onload = init;
