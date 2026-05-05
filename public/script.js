const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navBackdrop = document.getElementById("nav-backdrop");
const cursorGlow = document.querySelector(".cursor-glow");
const revealItems = document.querySelectorAll(".reveal");
const currentYear = document.getElementById("current-year");
const siteLoader = document.getElementById("site-loader");
const heroStage = document.querySelector(".hero-stage");
const heroMonolith = document.querySelector(".hero-monolith");
const heroFloats = document.querySelectorAll(".hero-float");
const typedWords = document.getElementById("typed-words");
const interactiveCards = document.querySelectorAll(".metric, .service-card, .project-card, .process-card, .about-card, .signature-card, .signature-stack, .contact-card");

const STORAGE_KEY = "kevin-amon-theme";
const LOADER_DURATION = 2000;
const loaderStartTime = performance.now();
const TYPED_VARIANTS = [
    "des interfaces reactives",
    "des experiences futuristes",
    "des produits premium memorables",
    "des univers web tres haut de gamme"
];

document.body.classList.add("is-loading");

const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
};

const storedTheme = window.localStorage.getItem(STORAGE_KEY);
if (storedTheme === "light" || storedTheme === "dark") {
    applyTheme(storedTheme);
}

// Theme toggle handled in main.js

const closeMenu = () => {
    navMenu?.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
};

navToggle?.addEventListener("click", () => {
    const isOpen = navMenu?.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", Boolean(isOpen));
    navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
    document.body.classList.toggle("menu-open", Boolean(isOpen));
});

navMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

navBackdrop?.addEventListener("click", closeMenu);

document.addEventListener("click", (event) => {
    if (!navMenu?.classList.contains("is-open")) {
        return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
        return;
    }

    if (navMenu.contains(target) || navToggle?.contains(target)) {
        return;
    }

    closeMenu();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

const finishLoader = () => {
    const elapsed = performance.now() - loaderStartTime;
    const remaining = Math.max(0, LOADER_DURATION - elapsed);

    window.setTimeout(() => {
        siteLoader?.classList.add("is-hidden");
        document.body.classList.remove("is-loading");
        document.body.classList.add("page-ready");
    }, remaining);
};

if (document.readyState === "complete") {
    finishLoader();
} else {
    window.addEventListener("load", finishLoader, { once: true });
}

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
    }
);

revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 40, 240)}ms`;
    observer.observe(item);
});

let typedIndex = 0;
let charIndex = 0;
let isDeleting = false;

const animateTypedWords = () => {
    if (!typedWords) {
        return;
    }

    const currentWord = TYPED_VARIANTS[typedIndex];
    const visibleText = currentWord.slice(0, charIndex);
    typedWords.textContent = visibleText;

    if (!isDeleting && charIndex < currentWord.length) {
        charIndex += 1;
        window.setTimeout(animateTypedWords, 75);
        return;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        window.setTimeout(animateTypedWords, 1500);
        return;
    }

    if (isDeleting && charIndex > 0) {
        charIndex -= 1;
        window.setTimeout(animateTypedWords, 38);
        return;
    }

    isDeleting = false;
    typedIndex = (typedIndex + 1) % TYPED_VARIANTS.length;
    window.setTimeout(animateTypedWords, 260);
};

animateTypedWords();

window.addEventListener("pointermove", (event) => {
    if (!cursorGlow) {
        return;
    }

    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;

    const { innerWidth, innerHeight } = window;
    const offsetX = (event.clientX / innerWidth - 0.5) * 18;
    const offsetY = (event.clientY / innerHeight - 0.5) * 18;

    if (heroStage) {
        heroStage.style.transform = `translate3d(${offsetX * -0.08}px, ${offsetY * -0.08}px, 0)`;
    }

    if (heroMonolith) {
        heroMonolith.style.transform = `translateX(-50%) rotate(-4deg) translate3d(${offsetX * 0.22}px, ${offsetY * 0.3}px, 0)`;
    }

    heroFloats.forEach((card, index) => {
        const direction = index === 0 ? -1 : 1;
        const baseRotation = index === 0 ? -6 : 7;
        card.style.transform = `rotate(${baseRotation}deg) translate3d(${offsetX * 0.24 * direction}px, ${offsetY * 0.24}px, 0)`;
    });
});

window.addEventListener("pointerdown", () => {
    if (cursorGlow) {
        cursorGlow.style.opacity = "0.3";
    }
});

window.addEventListener("pointerup", () => {
    if (cursorGlow) {
        cursorGlow.style.opacity = "0.2";
    }
});

interactiveCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
        const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8;
        const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
        const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;

        card.style.setProperty("--pointer-x", `${pointerX}%`);
        card.style.setProperty("--pointer-y", `${pointerY}%`);
        card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--pointer-x");
        card.style.removeProperty("--pointer-y");
        card.style.transform = "";
    });
});

currentYear.textContent = new Date().getFullYear();
