// ==================== THREE.JS OTIMIZADO ====================
function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 1, 5.8);

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

    const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(1.1, 0.3, 160, 20, 2, 3), goldMat);
    group.add(torus);

    const sphereGeo = new THREE.SphereGeometry(0.2, 32, 32);
    for (let i = 0; i < 6; i++) {
        const s = new THREE.Mesh(sphereGeo, i % 2 === 0 ? goldMat : darkGoldMat);
        s.userData = { angle: (i / 6) * Math.PI * 2, radius: 2.9, speed: 0.3 + i * 0.05 };
        group.add(s);
    }

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.05, 16, 70), goldMat);
    ring1.rotation.x = Math.PI / 2;
    group.add(ring1);

    let targetY = 0, targetX = 0;
    let isDragging = false;
    let previousX = 0;

    // Mouse
    canvas.addEventListener('mousedown', (e) => { isDragging = true; previousX = e.clientX; });
    window.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) {
            const rect = canvas.getBoundingClientRect();
            targetY = ((e.clientX - rect.left) / rect.width - 0.5) * 1.3;
            targetX = ((e.clientY - rect.top) / rect.height - 0.5) * -0.7;
        } else {
            const delta = (e.clientX - previousX) * 0.005;
            group.rotation.y += delta;
            previousX = e.clientX;
        }
    });

    // Touch (Mobile)
    canvas.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousX = e.touches[0].clientX;
    });
    canvas.addEventListener('touchend', () => isDragging = false);
    canvas.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const delta = (e.touches[0].clientX - previousX) * 0.005;
        group.rotation.y += delta;
        previousX = e.touches[0].clientX;
    });

    let isVisible = true;
    document.addEventListener('visibilitychange', () => isVisible = !document.hidden);

    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;

        if (!isDragging) {
            group.rotation.y += (targetY - group.rotation.y) * 0.06;
            group.rotation.x += (targetX - group.rotation.x) * 0.06;
        }
        group.rotation.y += 0.0012;

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

// ==================== MENU MOBILE ====================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const panel = document.getElementById('mobile-menu-panel');
    const closeBtn = document.getElementById('close-mobile-menu');

    if (!menuBtn || !mobileMenu || !panel) return;

    function openMenu() {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
        setTimeout(() => {
            panel.style.transform = 'translateX(0)';
        }, 10);
    }

    function closeMenu() {
        panel.style.transform = 'translateX(100%)';
        setTimeout(() => {
            mobileMenu.classList.remove('flex');
            mobileMenu.classList.add('hidden');
        }, 300);
    }

    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);

    // Fecha ao clicar nos links
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fecha ao clicar fora do painel
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) closeMenu();
    });
}

// ==================== RESTANTE DO CÓDIGO (Lojas, Filtros, Modal) ====================
// (Mantive o mesmo código anterior de renderStores, filters e modal)

const stores = [ /* mesma lista de 10 lojas */ ]; // (copiar da versão anterior)

function renderStores(filter = 'all') { /* mesma função */ }
function initFilters() { /* mesma função */ }
function openMapModal(storeId) { /* mesma função */ }

// ==================== INICIALIZAÇÃO ====================
function init() {
    initThreeJS();
    initFilters();
    initMobileMenu();
    renderStores('all');
}

window.onload = init;
