document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    init3DBackground();
    initScrollReveal();
    
    // Check which page we are on and render specific content
    const path = window.location.pathname;
    if (path.includes('parcours')) {
        renderParcours();
    } else if (path.includes('accomplissements')) {
        renderAccomplissements();
    }
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

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        cubes.forEach((c, i) => {
            const rotation = scrolled * c.rotationSpeed + c.offset;
            const yPos = (scrolled * 0.1 * (i % 2 === 0 ? 1 : -1));
            c.el.style.transform = `translate3d(0, ${yPos}px, ${c.z}px) rotateX(${rotation}deg) rotateY(${rotation * 0.8}deg) scale(${c.scale})`;
        });
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

/* Render Functions (Page Specific) */
function renderParcours() {
    const container = document.getElementById('parcours-container');
    if (!container || !window.portfolioData?.parcours) return;

    window.portfolioData.parcours.forEach(item => {
        const card = document.createElement('div');
        card.className = 'parcours-card glass-panel reveal';
        
        const isLong = item.description.length > 100;
        const shortDesc = isLong ? item.description.substring(0, 95) + '...' : item.description;

        card.innerHTML = `
            <div class="card-header">
                <span class="card-year">${item.year}</span>
                <div class="card-icon">${item.icon}</div>
            </div>
            <h3 class="card-title">${item.title}</h3>
            <p class="card-location">${item.location}</p>
            <p class="card-desc" id="desc-${item.id}">${shortDesc}</p>
            ${isLong ? `<button class="read-more-btn" onclick="openModal('${item.id}')">Lire tout</button>` : ''}
        `;
        container.appendChild(card);
    });
}

function renderAccomplissements() {
    const container = document.getElementById('accomplissements-container');
    if (!container || !window.portfolioData?.accomplissements) return;

    window.portfolioData.accomplissements.forEach(item => {
        const card = document.createElement('div');
        card.className = 'accomplissement-card glass-panel reveal';
        card.innerHTML = `
            <div class="acc-media">
                <img src="${item.mediaUrl}" alt="${item.title}">
            </div>
            <div class="acc-content">
                <h3 class="acc-title">${item.title}</h3>
                <p class="acc-desc">${item.description}</p>
                <a href="${item.link}" target="_blank" class="acc-link">Voir le projet</a>
            </div>
        `;
        container.appendChild(card);
    });
}

/* Modal Logic for Parcours */
window.openModal = function(id) {
    const item = window.portfolioData.parcours.find(p => p.id === id);
    if (!item) return;

    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
        <div class="custom-modal glass-panel">
            <button class="modal-close" onclick="closeModal()">×</button>
            <div class="modal-body" id="modal-scroll-area">
                <span class="card-year">${item.year}</span>
                <h3 class="section-title">${item.title}</h3>
                <p class="card-location">${item.location}</p>
                <div class="modal-text">
                    ${item.description.repeat(5)} <!-- Placeholder for long content if needed, though original is not that long -->
                    <p>${item.description}</p>
                </div>
                <button class="scroll-top-internal" onclick="document.getElementById('modal-scroll-area').scrollTo({top:0, behavior:'smooth'})">↑</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.classList.add('is-open'), 10);
};

window.closeModal = function() {
    const modal = document.querySelector('.custom-modal-overlay');
    if (modal) {
        modal.classList.remove('is-open');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
};
