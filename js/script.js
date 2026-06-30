// Tailwind Script
function initTailwind() {
    document.documentElement.style.setProperty('--accent-gold', '#d4af37');
}

// Three.js 3D Scene
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
    camera.position.set(0, 0.5, 5.5);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight.position.set(8, 12, 6);
    scene.add(dirLight);
    
    const pointGold = new THREE.PointLight(0xd4af37, 1.4, 50);
    pointGold.position.set(-4, 3, 5);
    scene.add(pointGold);

    // Group for all objects
    const group = new THREE.Group();
    scene.add(group);

    // Premium Gold Material
    const goldMat = new THREE.MeshPhongMaterial({ 
        color: 0xd4af37, 
        shininess: 95,
        specular: 0xeeeeee
    });
    const darkGoldMat = new THREE.MeshPhongMaterial({ 
        color: 0xa67c52, 
        shininess: 70 
    });

    // Central Torus Knot (signature piece)
    const torusKnot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.15, 0.32, 180, 24, 2, 3),
        goldMat
    );
    group.add(torusKnot);

    // Orbiting spheres
    const sphereGeo = new THREE.SphereGeometry(0.22, 48, 48);
    for (let i = 0; i < 7; i++) {
        const sphere = new THREE.Mesh(sphereGeo, i % 2 === 0 ? goldMat : darkGoldMat);
        sphere.userData = { 
            angle: (i / 7) * Math.PI * 2, 
            radius: 3.1, 
            speed: 0.25 + (i * 0.04) 
        };
        group.add(sphere);
    }

    // Decorative rings
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.06, 20, 80), goldMat);
    ring1.rotation.x = Math.PI * 0.5;
    group.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.04, 20, 70), darkGoldMat);
    ring2.rotation.y = Math.PI * 0.35;
    group.add(ring2);

    // Mouse interaction
    let targetRotationY = 0;
    let targetRotationX = 0;

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        targetRotationY = x * 1.1;
        targetRotationX = y * 0.7;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Smooth mouse follow + auto rotation
        group.rotation.y += (targetRotationY - group.rotation.y) * 0.04;
        group.rotation.x += (targetRotationX - group.rotation.x) * 0.04;
        group.rotation.y += 0.0018; // constant slow spin

        // Animate orbiting spheres
        const time = Date.now() * 0.001;
        group.children.forEach(child => {
            if (child.userData.angle !== undefined) {
                const { angle, radius, speed } = child.userData;
                const t = time * speed;
                child.position.x = Math.cos(t + angle) * radius;
                child.position.z = Math.sin(t + angle) * radius * 0.65;
                child.position.y = Math.sin(t * 1.8) * 1.1;
                child.rotation.y = t * 1.5;
            }
        });

        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    function onResize() {
        const parent = canvas.parentElement;
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    
    window.addEventListener('resize', onResize);
    setTimeout(onResize, 100);
}

// Store Data
const stores = [
    {
        id: 1, zona: "Zona Sul", nome: "Loja 1 - Jatuarana", subtitulo: "Nº 4204",
        endereco: "Av. Jatuarana, 4204 - Conceição, Porto Velho - RO, 76808-278",
        wa: "https://api.whatsapp.com/send/?phone=556984936647&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0",
        map: "https://maps.app.goo.gl/Yjwqxytv7s2A2Wxs8"
    },
    {
        id: 2, zona: "Zona Sul", nome: "Loja 2 - Av. Jatuarana", subtitulo: "Nº 4855",
        endereco: "Av. Jatuarana, 4855 - Nova Floresta, Porto Velho - RO, 76807-441",
        wa: "https://api.whatsapp.com/send/?phone=556992435937&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0",
        map: "https://www.google.com/maps/search/?api=1&query=Av.+Jatuarana%2C+4855+-+Nova+Floresta%2C+Porto+Velho+-+RO%2C+76807-441"
    },
    {
        id: 3, zona: "Zona Leste", nome: "Loja 3 - José Amador dos Reis", subtitulo: "Nº 2900 • Atendimento",
        endereco: "Av. José Amador dos Reis, 2900 - Tancredo Neves, Porto Velho - RO, 76829-422",
        wa: "https://api.whatsapp.com/send/?phone=556992713872&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0",
        map: "https://www.google.com/maps/search/?api=1&query=Av.+Jos%C3%A9+Amador+dos+Reis%2C+2900+-+Tancredo+Neves%2C+Porto+Velho+-+RO"
    },
    {
        id: 4, zona: "Zona Sul", nome: "Loja 4 - Av. Jatuarana", subtitulo: "Nº 4677",
        endereco: "Av. Jatuarana, 4677 - Nova Floresta, Porto Velho - RO, 76807-313",
        wa: "https://api.whatsapp.com/send/?phone=556993372596&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0",
        map: "https://www.google.com/maps/search/?api=1&query=Av.+Jatuarana%2C+4677+-+Nova+Floresta%2C+Porto+Velho+-+RO%2C+76807-313"
    },
    {
        id: 5, zona: "Zona Leste", nome: "Loja 5 - José Amador dos Reis", subtitulo: "Nº 3368 • Atendimento",
        endereco: "Av. José Amador dos Reis, 3368 - Tancredo Neves, Porto Velho - RO, 76829-498",
        wa: "https://api.whatsapp.com/send/?phone=556993505182&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0",
        map: "https://www.google.com/maps/search/?api=1&query=Av.+Jos%C3%A9+Amador+dos+Reis%2C+3368+-+Tancredo+Neves%2C+Porto+Velho+-+RO"
    },
    {
        id: 6, zona: "Centro", nome: "Loja 6 - Dom Pedro II", subtitulo: "Nº 1382 • Localização",
        endereco: "R. Dom Pedro II, 1382 - São Cristóvão, Porto Velho - RO, 76801-102",
        wa: "https://api.whatsapp.com/send/?phone=556992928005&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0",
        map: "https://www.google.com/maps/search/?api=1&query=R.+Dom+Pedro+II%2C+1382+-+S%C3%A3o+Crist%C3%B3v%C3%A3o%2C+Porto+Velho+-+RO"
    },
    {
        id: 7, zona: "Centro", nome: "Loja 7 - Av. Sete de Setembro", subtitulo: "Nº 1074",
        endereco: "Av. Sete de Setembro, 1074 - Centro, Porto Velho - RO, 76820-120",
        wa: "https://api.whatsapp.com/send/?phone=556992764063&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0",
        map: "https://www.google.com/maps/search/?api=1&query=Av.+Sete+de+Setembro%2C+1074+-+Centro%2C+Porto+Velho+-+RO"
    },
    {
        id: 8, zona: "Zona Leste", nome: "Loja 8 - Rua União", subtitulo: "Nº 1881",
        endereco: "R. União, 1881 - São Francisco, Porto Velho - RO, 76802-330",
        wa: "https://api.whatsapp.com/send/?phone=556992243771&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0",
        map: "https://www.google.com/maps/search/?api=1&query=R.+Uni%C3%A3o%2C+1881+-+S%C3%A3o+Francisco%2C+Porto+Velho+-+RO"
    },
    {
        id: 9, zona: "Zona Leste", nome: "Loja 9 - Av. Sete de Setembro", subtitulo: "Nº 927",
        endereco: "Av. Sete de Setembro, 927 - Centro, Porto Velho - RO, 76801-073",
        wa: "https://api.whatsapp.com/send/?phone=556992634390&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0",
        map: "https://www.google.com/maps/search/?api=1&query=Av.+Sete+de+Setembro%2C+927+-+Centro%2C+Porto+Velho+-+RO"
    },
    {
        id: 10, zona: "Jaru", nome: "Loja Jaru", subtitulo: "Rua Padre Adolfo Rohl, 1560",
        endereco: "Av. Padre Adolpho Rohl, 1560 - St. 2, Jaru - RO, 76890-000",
        wa: "https://api.whatsapp.com/send/?phone=556992337081&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0",
        map: "https://www.google.com/maps/search/?api=1&query=Av.+Padre+Adolpho+Rohl%2C+1560+-+St.+2%2C+Jaru+-+RO"
    }
];

// Render Stores
let currentFilter = 'all';

function renderStores(filter = 'all') {
    const container = document.getElementById('stores-grid');
    container.innerHTML = '';

    const filtered = filter === 'all' 
        ? stores 
        : stores.filter(store => store.zona === filter);

    filtered.forEach(store => {
        const card = document.createElement('div');
        card.className = `store-card bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 flex flex-col`;
        
        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div>
                    <span class="inline-block px-3 py-1 text-xs font-medium tracking-wider rounded-full bg-white/5 text-[#d4af37] mb-3">${store.zona}</span>
                    <h3 class="font-semibold text-2xl leading-none tracking-tight">${store.nome}</h3>
                    <p class="text-sm text-white/60 mt-1">${store.subtitulo}</p>
                </div>
            </div>
            
            <div class="flex-1">
                <p class="text-sm text-white/70 leading-snug">${store.endereco}</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 mt-6">
                <a href="${store.wa}" target="_blank" 
                   class="flex-1 inline-flex items-center justify-center gap-x-2 h-11 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-sm font-semibold transition-all active:scale-[0.985]">
                    <i class="fab fa-whatsapp"></i>
                    <span>Falar no WhatsApp</span>
                </a>
                
                <a href="${store.map}" target="_blank" 
                   class="flex-1 inline-flex items-center justify-center gap-x-2 h-11 rounded-2xl border border-white/20 hover:bg-white/5 text-sm font-medium transition-all">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Ver no Mapa</span>
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

// Filter buttons
function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFilter = btn.dataset.filter;
            renderStores(currentFilter);
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const menu = document.createElement('div');
        menu.id = 'mobile-menu';
        menu.className = 'fixed inset-0 bg-[#111111] z-[60] p-6 pt-24 md:hidden';
        menu.innerHTML = `
            <div class="flex flex-col gap-y-6 text-xl font-medium">
                <a href="#lojas" class="py-2">Lojas</a>
                <a href="#promocoes" class="py-2">Promoções</a>
                <a href="#redes" class="py-2">Redes Sociais</a>
                <div class="pt-4 border-t border-white/10">
                    <a href="https://api.whatsapp.com/send/?phone=556984936647&text=Ol%C3%A1%2C+gostaria+de+falar+com+um+atendente&type=phone_number&app_absent=0" 
                       target="_blank"
                       class="flex items-center gap-x-3 text-[#25D366]">
                        <i class="fab fa-whatsapp text-2xl"></i>
                        <span>Falar no WhatsApp</span>
                    </a>
                </div>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        menu.addEventListener('click', (e) => {
            if (e.target === menu) menu.remove();
        });
        
        // Close on link click
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => menu.remove());
        });
    });
}

// Initialize everything
function init() {
    initTailwind();
    initThreeJS();
    initFilters();
    initMobileMenu();
    
    // Initial render of stores
    renderStores('all');
    
    // Optional: subtle scroll animation for sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0.95';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(section);
    });
}

window.onload = init;
