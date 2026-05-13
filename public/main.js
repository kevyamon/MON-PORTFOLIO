document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    init3DBackground();
    initScrollReveal();
    initScrollToTop();
    initReadMore();
    
    // Check which page we are on and render specific content
    const path = window.location.pathname;
});

/* Theme Logic */
function initTheme() {
    const STORAGE_KEY = "kevin-amon-theme";
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    
    const applyTheme = (theme) => {
        root.setAttribute("data-theme", theme);
        localStorage.setItem(STORAGE_KEY, theme);
    };

    const storedTheme = localStorage.getItem(STORAGE_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(storedTheme);

    themeToggle?.addEventListener('click', () => {
        const currentTheme = root.getAttribute("data-theme");
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });
}

/* Navigation & Menu Overlay */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const body = document.body;

    navToggle?.addEventListener('click', () => {
        const isOpen = navToggle.classList.toggle('is-open');
        menuOverlay?.classList.toggle('is-open', isOpen);
        body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking links
    menuOverlay?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('is-open');
            menuOverlay?.classList.remove('is-open');
            body.style.overflow = '';
        });
    });
}

/* 3D Background Cubes */
function init3DBackground() {
    const scene = document.querySelector('.cube-scene');
    if (!scene) return;

    const cubeCount = 6;
    const cubes = [];

    for (let i = 0; i < cubeCount; i++) {
        const cube = document.createElement('div');
        cube.className = 'cube';
        
        // Create faces
        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
        faces.forEach(f => {
            const face = document.createElement('div');
            face.className = `cube-face face-${f}`;
            cube.appendChild(face);
        });

        // Random initial positions
        const x = Math.random() * 80 + 10; // 10% to 90%
        const y = Math.random() * 80 + 10;
        const z = Math.random() * -500 - 100;
        const scale = Math.random() * 0.5 + 0.5;
        
        cube.style.left = `${x}%`;
        cube.style.top = `${y}%`;
        
        const rotationSpeed = Math.random() * 0.2 + 0.05;
        const offset = Math.random() * 1000;

        cubes.push({ el: cube, x, y, z, scale, rotationSpeed, offset });
        scene.appendChild(cube);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                cubes.forEach((c, i) => {
                    const rotation = scrolled * c.rotationSpeed + c.offset;
                    const yPos = (scrolled * 0.1 * (i % 2 === 0 ? 1 : -1));
                    c.el.style.transform = `translate3d(0, ${yPos}px, ${c.z}px) rotateX(${rotation}deg) rotateY(${rotation * 0.8}deg) scale(${c.scale})`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* Scroll Reveal */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* Scroll To Top */
function initScrollToTop() {
    let btn = document.getElementById('scroll-to-top');
    
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'scroll-to-top';
        btn.className = 'scroll-to-top';
        btn.setAttribute('aria-label', 'Retour en haut');
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        `;
        document.body.appendChild(btn);
    }
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('is-visible');
        } else {
            btn.classList.remove('is-visible');
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}




/* Universal Modal System */
window.openContentModal = function(title, badge, content) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.id = 'dynamic-modal';
    
    modal.innerHTML = `
        <div class="custom-modal">
            <button class="modal-close" onclick="closeContentModal()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div class="modal-header">
                ${badge ? `<span class="modal-badge">${badge}</span>` : ''}
                <h3 class="modal-title">${title}</h3>
            </div>
            <div class="modal-body">
                <p>${content}</p>
                <div style="text-align: center; margin-top: 2rem;">
                    <button class="scroll-top-internal" onclick="this.closest('.modal-body').scrollTo({top: 0, behavior: 'smooth'})" 
                            style="background: var(--gold); border: none; width: 40px; height: 40px; border-radius: 50%; color: var(--bg); cursor: pointer; display: inline-flex; align-items: center; justify-content: center;">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"></polyline></svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => modal.classList.add('is-open'), 10);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeContentModal();
    });
};

window.closeContentModal = function() {
    const modal = document.getElementById('dynamic-modal') || document.getElementById('parcours-modal');
    if (!modal) return;

    modal.classList.remove('is-open');
    setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
    }, 400);
};

// Wrapper for legacy compatibility
window.openParcoursModal = function(id) {
    const data = {
        'lokolink': {
            badge: "NOVEMBRE 2025 – UNIVERSITÉ LOKO",
            title: "Création de la plateforme de parrainage pour LOKO.",
            content: "Par pilotage IA, j'ai créé la plateforme de parrainage de mon école. J'ai appelé cette plateforme LOKOLink, elle a pour mission de renforcer les relations Inter-étudiantes."
        },
        'yely': {
            badge: "TERMINÉ – MAFÉRÉ",
            title: "Développement d'une application de Taxi en ligne.",
            content: "L'idée est de moderniser la circulation communale. L'application Yély vient donc simplifier la vie aux populations dans leurs déplacements de tous les jours."
        }
    };
    const item = data[id];
    if (item) openContentModal(item.title, item.badge, item.content);
};

window.closeParcoursModal = window.closeContentModal;

function initReadMore() {
    const articles = document.querySelectorAll('.glass-panel');
    
    articles.forEach(article => {
        const p = article.querySelector('p');
        if (!p) return;

        const text = p.innerText;
        // Truncate if long or specific section
        if (text.length > 200 || article.hasAttribute('data-read-more')) {
            const title = article.querySelector('h2, h3')?.innerText || "Détails";
            const badge = article.querySelector('.eyebrow, .card-badge')?.innerText || "";
            
            p.classList.add('content-truncate');
            
            const btn = document.createElement('button');
            btn.className = 'read-more-btn';
            btn.innerHTML = `Lire plus <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
            
            btn.onclick = (e) => {
                e.preventDefault();
                openContentModal(title, badge, text);
            };
            article.appendChild(btn);
        }
    });
}
