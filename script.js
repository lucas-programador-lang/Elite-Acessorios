/* ============================
   ELITE ACESSÓRIOS — script.js
   ============================ */

/* ── 3D BACKGROUND (Three.js) ── */
(function initThree() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 55;

  /* ─ Particle field ─ */
  const count = 900;
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);

  const gold   = new THREE.Color('#C9A84C');
  const white  = new THREE.Color('#ffffff');
  const purple = new THREE.Color('#4a3f8c');

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 160;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

    const mix = Math.random();
    const col = mix < 0.5 ? gold.clone().lerp(white, Math.random() * 0.3)
              : mix < 0.8 ? purple.clone().lerp(gold, Math.random() * 0.5)
              : white.clone();
    colors[i * 3]     = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.45,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
    /* BUG FIX #1 — depthWrite: false evita sorting artifacts em partículas
       transparentes, especialmente visíveis em GPUs mobile */
    depthWrite: false,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  /* ─ Floating geometric shapes ─ */
  function makeRing(radius, tube, segs, color, pos) {
    const g = new THREE.TorusGeometry(radius, tube, 16, segs);
    const m = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.15 });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(...pos);
    scene.add(mesh);
    return mesh;
  }

  const ring1 = makeRing(18, 0.08, 80, 0xC9A84C, [20, 10, -20]);
  const ring2 = makeRing(12, 0.06, 60, 0x7B6DD8, [-22, -8, -15]);
  const ring3 = makeRing(8,  0.04, 50, 0xC9A84C, [0, -18, -10]);

  /* ─ Mouse parallax ─ */
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ─ Scroll factor ─ */
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  /* ─ Resize ─ */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    /* BUG FIX #2 — setPixelRatio não era chamado no resize.
       Se o usuário mover a janela para um monitor com DPR diferente
       (ex: de tela Retina para monitor externo), a resolução ficava errada. */
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  /* ─ Animate ─ */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    points.rotation.y = t * 0.018 + mouseX * 0.12;
    points.rotation.x = t * 0.009 + mouseY * 0.06;

    ring1.rotation.x = t * 0.22;
    ring1.rotation.z = t * 0.15;
    ring2.rotation.y = t * 0.18;
    ring2.rotation.x = t * 0.10;
    ring3.rotation.z = t * 0.28;
    ring3.rotation.y = t * 0.12;

    camera.position.x += (mouseX * 4 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 3 - camera.position.y) * 0.03;
    /* BUG FIX #3 — camera.position.z poderia ficar negativo em páginas longas,
       fazendo a câmera ultrapassar a cena e inverter a perspectiva.
       Ex: scrollY = 7000 → z = 55 - 56 = -1 (câmera atrás de tudo).
       Clamp para mínimo de 10 unidades garante a câmera sempre à frente da cena. */
    camera.position.z = Math.max(10, 55 - scrollY * 0.008);

    renderer.render(scene, camera);
  }
  animate();
})();

/* ── HEADER SCROLL ── */
(function initHeader() {
  /* BUG FIX #4 — getElementById('header') retornava null porque o elemento
     usa class="header", não id="header". Isso causava TypeError no classList
     e quebrava o script inteiro sem nenhum guard de null check.
     Corrigido para querySelector com fallback seguro. */
  const header = document.querySelector('.header') || document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── HAMBURGER / MOBILE NAV ── */
(function initMobileNav() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (!btn || !nav) return;

  /* BUG FIX #5 — extraído como função reutilizável para fechar o nav,
     necessário para o handler de ESC e de resize. */
  function closeNav() {
    nav.classList.remove('open');
    btn.classList.remove('open');
    document.body.style.overflow = '';
    /* BUG FIX #6 — restaura aria-expanded ao fechar */
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    /* BUG FIX #7 — aria-expanded não era atualizado no toggle,
       leitores de tela não sabiam o estado do menu. */
    btn.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  /* BUG FIX #8 — tecla ESC não fechava o menu mobile.
     Usuários de teclado ficavam presos no menu fullscreen. */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeNav();
      btn.focus();
    }
  });

  /* BUG FIX #9 — body.style.overflow = 'hidden' ficava travado se o usuário
     redimensionasse a janela de mobile para desktop sem fechar o menu.
     Resize listener limpa o estado do nav quando viewport passa para desktop. */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && nav.classList.contains('open')) {
      closeNav();
    }
  });
})();

/* ── REVEAL ON SCROLL (IntersectionObserver) ── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ── 3D CARD TILT on hover ── */
(function initCardTilt() {
  document.querySelectorAll('.store-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        translateY(-6px)
        perspective(800px)
        rotateX(${-y * 7}deg)
        rotateY(${x * 7}deg)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
    /* BUG FIX #10 — em dispositivos touch, o inline style de transform
       podia ficar travado caso touchend não disparasse mouseleave.
       Listener de touchend garante o reset do transform em mobile. */
    card.addEventListener('touchend', () => {
      card.style.transform = '';
    }, { passive: true });
  });
})();

/* ── SMOOTH ACTIVE NAV HIGHLIGHT ON SCROLL ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      links.forEach(link => {
        /* BUG FIX #11 — link.style.color = 'var(--gold)' como inline style
           tem especificidade maior que o :hover CSS, fazendo o highlight travar
           e conflitar com estados de hover. Corrigido para uso de classe CSS
           dedicada (.nav-link--active) que tem a mesma especificidade do :hover,
           permitindo que os estados coexistam corretamente. */
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('nav-link--active', isActive);
      });
    });
  /* BUG FIX #12 — threshold: 0.4 fazia seções curtas nunca dispararem o callback
     pois nunca atingiam 40% de interseção. Threshold reduzido para 0.15 com
     rootMargin ajustado para detectar a seção dominante na viewport. */
  }, { threshold: 0.15, rootMargin: '0px 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
})();
