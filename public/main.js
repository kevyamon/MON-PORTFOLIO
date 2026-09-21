// Immediate theme application to prevent FOUC
(function() {
    const STORAGE_KEY = "kevin-amon-theme";
    const storedTheme = localStorage.getItem(STORAGE_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute("data-theme", storedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    init3DBackground();
    initScrollReveal();
    initScrollToTop();
    initReadMore();
    initSmoothPageTransitions();
});

/* Theme Logic */
function initTheme() {
    const STORAGE_KEY = "kevin-amon-theme";
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    
    const applyTheme = (theme) => {
        root.setAttribute("data-theme", theme);
        localStorage.setItem(STORAGE_KEY, theme);
        // Update theme color meta tag
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#07070a' : '#f4efe5');
        }
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

/* High-Performance 3D Background Cubes */
function init3DBackground() {
    const scene = document.querySelector('.cube-scene');
    if (!scene) return;

    // Check if cubes already exist to prevent duplicate creation
    if (scene.children.length > 0) return;

    const cubeCount = 5;
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

        // Initial positions
        const x = Math.random() * 80 + 10;
        const y = Math.random() * 80 + 10;
        const z = Math.random() * -400 - 80;
        const scale = Math.random() * 0.4 + 0.6;
        
        cube.style.left = `${x}%`;
        cube.style.top = `${y}%`;
        
        const rotationSpeed = Math.random() * 0.15 + 0.05;
        const offset = Math.random() * 500;

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
                    const yPos = (scrolled * 0.08 * (i % 2 === 0 ? 1 : -1));
                    c.el.style.transform = `translate3d(0, ${yPos}px, ${c.z}px) rotateX(${rotation}deg) rotateY(${rotation * 0.7}deg) scale(${c.scale})`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* Scroll Reveal */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
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
        if (window.scrollY > 350) {
            btn.classList.add('is-visible');
        } else {
            btn.classList.remove('is-visible');
        }
    }, { passive: true });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* Universal Modal System */
window.openContentModal = function(title, badge, contentHtml) {
    const existingModal = document.getElementById('dynamic-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.id = 'dynamic-modal';
    
    modal.innerHTML = `
        <div class="custom-modal">
            <button class="modal-close" onclick="closeContentModal()" aria-label="Fermer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div class="modal-header">
                ${badge ? `<span class="modal-badge">${badge}</span>` : ''}
                <h3 class="modal-title">${title}</h3>
            </div>
            <div class="modal-body">
                <div class="modal-formatted-content" style="font-size: 1.05rem; line-height: 1.7;">
                    ${contentHtml}
                </div>
                <div style="text-align: center; margin-top: 2rem;">
                    <button class="scroll-top-internal" onclick="this.closest('.modal-body').scrollTo({top: 0, behavior: 'smooth'})" 
                            style="background: var(--gold); border: none; width: 40px; height: 40px; border-radius: 50%; color: var(--bg); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(216,179,106,0.3);"
                            title="Remonter">
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
    }, 350);
};

// Wrapper for legacy compatibility
window.openParcoursModal = function(id) {
    const data = {
        'lokolink': {
            badge: "NOVEMBRE 2025 – UNIVERSITÉ LOKO",
            title: "Création de la plateforme de parrainage pour LOKO.",
            content: "<p>Par pilotage IA, j'ai créé la plateforme de parrainage de mon école. J'ai appelé cette plateforme LOKOLink, elle a pour mission de renforcer les relations inter-étudiantes et fluidifier la transmission d'expérience entre promotions.</p>"
        },
        'yely': {
            badge: "TERMINÉ – MAFÉRÉ",
            title: "Développement d'une application de Taxi en ligne.",
            content: "<p>L'idée est de moderniser la circulation communale. L'application Yély vient donc simplifier la vie aux populations dans leurs déplacements quotidiens avec un système de réservation et de localisation direct.</p>"
        }
    };
    const item = data[id];
    if (item) openContentModal(item.title, item.badge, item.content);
};

window.closeParcoursModal = window.closeContentModal;

/* Read More for long cards on mobile / desktop */
function initReadMore() {
    const articles = document.querySelectorAll('.glass-panel');
    
    articles.forEach(article => {
        // Skip if inside modal, timeline or already processed
        if (article.closest('.custom-modal') || article.classList.contains('parcours-card') || article.querySelector('.read-more-btn')) return;

        const paragraphs = Array.from(article.querySelectorAll('p'));
        if (paragraphs.length === 0) return;

        const totalLength = paragraphs.reduce((acc, p) => acc + p.innerText.length, 0);

        // Truncate if long or explicitly requested
        if (totalLength > 240 || article.hasAttribute('data-read-more')) {
            const title = article.querySelector('h1, h2, h3, h4')?.innerText || "Détails";
            const badge = article.querySelector('.eyebrow, .card-badge, span[style*="uppercase"]')?.innerText || "";
            
            // Build full formatted content for modal
            const fullContentHtml = paragraphs.map(p => `<p style="margin-bottom: 1.2rem; font-size: 1.05rem; line-height: 1.7;">${p.innerHTML}</p>`).join('');

            // Apply truncation class to first paragraph
            paragraphs[0].classList.add('content-truncate');
            for (let i = 1; i < paragraphs.length; i++) {
                paragraphs[i].style.display = 'none';
            }
            
            const btn = document.createElement('button');
            btn.className = 'read-more-btn';
            btn.setAttribute('type', 'button');
            btn.innerHTML = `Lire plus <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
            
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                openContentModal(title, badge, fullContentHtml);
            };
            article.appendChild(btn);
        }
    });
}

/* Seamless Zero-Flash Page Transitions (Instant SPA-like navigation) */
function initSmoothPageTransitions() {
    document.addEventListener('click', async (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Skip non-page links
        if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('whatsapp:') || link.target === '_blank') {
            return;
        }

        // Relative URL resolution
        const targetUrl = new URL(href, window.location.href);
        if (targetUrl.origin !== window.location.origin) return;

        // Same page with same hash
        if (targetUrl.pathname === window.location.pathname && targetUrl.hash === window.location.hash && !targetUrl.hash) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Same page hash scroll
        if (targetUrl.pathname === window.location.pathname && targetUrl.hash) {
            e.preventDefault();
            const targetEl = document.querySelector(targetUrl.hash);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, '', href);
            }
            return;
        }

        // Different page navigation
        e.preventDefault();
        await navigateToPage(targetUrl.href, targetUrl.hash, true);
    });

    window.addEventListener('popstate', async () => {
        await navigateToPage(window.location.href, window.location.hash, false);
    });
}

async function navigateToPage(url, hash = '', pushState = true) {
    const main = document.querySelector('main');
    if (!main) {
        window.location.href = url;
        return;
    }

    try {
        // Fast subtle transition
        main.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
        main.style.opacity = '0';
        main.style.transform = 'translateY(6px)';

        const response = await fetch(url);
        if (!response.ok) throw new Error('Page fetch error');

        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const newMain = doc.querySelector('main');
        if (!newMain) {
            window.location.href = url;
            return;
        }

        // Update document title
        if (doc.title) document.title = doc.title;

        // Update URL
        if (pushState) history.pushState(null, '', url);

        // Replace content
        main.innerHTML = newMain.innerHTML;
        main.className = newMain.className;
        if (newMain.getAttribute('style')) {
            main.setAttribute('style', newMain.getAttribute('style'));
        }

        // Close mobile overlay if open
        const navToggle = document.getElementById('nav-toggle');
        const menuOverlay = document.getElementById('menu-overlay');
        navToggle?.classList.remove('is-open');
        menuOverlay?.classList.remove('is-open');
        document.body.style.overflow = '';

        // Re-run interactive modules
        initScrollReveal();
        initReadMore();

        // Scroll
        if (hash) {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView();
            else window.scrollTo(0, 0);
        } else {
            window.scrollTo(0, 0);
        }

        setTimeout(() => {
            main.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            main.style.opacity = '1';
            main.style.transform = 'translateY(0)';
        }, 20);

    } catch (err) {
        window.location.href = url;
    }
}
