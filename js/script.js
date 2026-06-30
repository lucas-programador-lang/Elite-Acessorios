// ==================== THREE.JS OTIMIZADO COM SOMBRAS E REFLEXOS ====================
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
    
    // Sombras de alta qualidade
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 6);

    // ==================== ILUMINAÇÃO ====================
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(6, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 40;
    dirLight.shadow.camera.left = -12;
    dirLight.shadow.camera.right = 12;
    dirLight.shadow.camera.top = 12;
    dirLight.shadow.camera.bottom = -12;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xd4af37, 1.5, 50);
    pointLight.position.set(-4, 5, 7);
    scene.add(pointLight);

    // ==================== MATERIAIS COM REFLEXOS ====================
    const goldMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.95,
        roughness: 0.15,
        envMapIntensity: 0.9
    });

    const darkGoldMat = new THREE.MeshStandardMaterial({
        color: 0xa67c52,
        metalness: 0.85,
        roughness: 0.25
    });

    const group = new THREE.Group();
    scene.add(group);

    // Torus Knot com reflexos
    const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(1.1, 0.32, 160, 20, 2, 3), goldMat);
    torus.castShadow = true;
    torus.receiveShadow = true;
    group.add(torus);

    // Esferas
    const sphereGeo = new THREE.SphereGeometry(0.22, 32, 32);
    for (let i = 0; i < 6; i++) {
        const mat = i % 2 === 0 ? goldMat : darkGoldMat;
        const sphere = new THREE.Mesh(sphereGeo, mat);
        sphere.userData = { angle: (i / 6) * Math.PI * 2, radius: 3.0, speed: 0.28 + i * 0.045 };
        if (i % 2 === 0) sphere.castShadow = true;
        sphere.receiveShadow = true;
        group.add(sphere);
    }

    // Anel
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.05, 16, 70), goldMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.castShadow = true;
    ring1.receiveShadow = true;
    group.add(ring1);

    // Plano de sombra
    const shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(18, 18),
        new THREE.ShadowMaterial({ opacity: 0.4 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -3.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // ==================== INTERAÇÃO ====================
    let targetY = 0, targetX = 0;
    let isDragging = false;
    let previousX = 0;

    canvas.addEventListener('mousedown', (e) => { isDragging = true; previousX = e.clientX; });
    window.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) {
            const rect = canvas.getBoundingClientRect();
            targetY = ((e.clientX - rect.left) / rect.width - 0.5) * 1.3;
            targetX = ((e.clientY - rect.top) / rect.height - 0.5) * -0.7;
        } else {
            group.rotation.y += (e.clientX - previousX) * 0.005;
            previousX = e.clientX;
        }
    });

    canvas.addEventListener('touchstart', (e) => { isDragging = true; previousX = e.touches[0].clientX; });
    canvas.addEventListener('touchend', () => isDragging = false);
    canvas.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        group.rotation.y += (e.touches[0].clientX - previousX) * 0.005;
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
        group.rotation.y += 0.0011;

        const time = Date.now() * 0.001;
        group.children.forEach(child => {
            if (child.userData.angle !== undefined) {
                const { angle, radius, speed } = child.userData;
                const t = time * speed;
                child.position.x = Math.cos(t + angle) * radius;
                child.position.z = Math.sin(t + angle) * radius * 0.7;
                child.position.y = Math.sin(t * 1.7) * 1.1;
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

// ==================== MENU MOBILE + LOJAS + MODAL (mesmo código anterior) ====================
function initMobileMenu() { /* código do menu mobile */ }
const stores = [ /* lista completa das 10 lojas */ ];
function renderStores(filter = 'all') { /* função de render */ }
function initFilters() { /* função de filtros */ }
function openMapModal(storeId) { /* função do modal */ }

function init() {
    initThreeJS();
    initFilters();
    initMobileMenu();
    renderStores('all');
}

window.onload = init;
