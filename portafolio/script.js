// ============================================================
// PORTAFOLIO DE ANDRÉS CORDERO · JavaScript
// ============================================================


// ============================================================
// CONFIGURACIÓN: AQUÍ PONES TUS DATOS REALES
// Reemplaza cada texto "…_AQUI" por tu dato. Mientras no lo cambies,
// el botón correspondiente muestra un aviso en lugar de abrir un enlace roto.
// ============================================================
const CONTACT = {
  // Código de país + número, solo dígitos, sin "+" ni espacios. Ej. Colombia: "573001234567"
  whatsapp: "573043388348",

  // Tu correo. Ej: "andres@correo.com"
  email: "andrescordero0409@gmail.com",

  // Enlace completo a tu perfil. Ej: "https://github.com/tu-usuario"
  github: "https://github.com/dresco00/portafolio_andres",
};

// Mensaje que aparece escrito al abrir WhatsApp
const WHATSAPP_MESSAGE = "Hola Andrés, vi tu portafolio y quiero hablar sobre un proyecto.";

// Repositorios de GitHub de cada proyecto (para el botón "Ver código").
// La clave es el valor de data-project de la tarjeta en index.html.
// Déjalo vacío ("") y el botón "Ver código" no se muestra.
const REPOSITORIES = {
  "sabor-caribe": "",         // Ej: "https://github.com/tu-usuario/sabor-caribe"
  "daniela-photography": "",
  "task-manager": "",
};


// ------------------------------------------------------------
// Referencias a elementos del HTML
// ------------------------------------------------------------
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const toast = document.getElementById("toast");

let toastTimer;


// ------------------------------------------------------------
// Utilidades
// ------------------------------------------------------------
function isPlaceholder(value) {
  return !value || value.includes("_AQUI");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 4000);
}


// ------------------------------------------------------------
// 1. Menú móvil
// ------------------------------------------------------------
function closeMobileMenu() {
  header.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menú de navegación");
}

function toggleMobileMenu() {
  const isOpen = header.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación");
}

function setupMobileMenu() {
  navToggle.addEventListener("click", toggleMobileMenu);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) closeMobileMenu();
  });
}


// ------------------------------------------------------------
// 2. Navegación suave entre secciones
// ------------------------------------------------------------
function setupSmoothScroll() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", targetId);
      closeMobileMenu();
    });
  });
}


// ------------------------------------------------------------
// 3. Línea marcada en la barra al bajar
// ------------------------------------------------------------
function setupHeaderShadow() {
  function update() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}


// ------------------------------------------------------------
// 4. Resaltar el enlace de la sección que se está viendo
// ------------------------------------------------------------
function setupActiveLink() {
  const sections = document.querySelectorAll("main section[id]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}


// ------------------------------------------------------------
// 5. Enlaces de contacto (WhatsApp, correo y GitHub)
// ------------------------------------------------------------
function buildContactUrl(key, value) {
  if (key === "whatsapp") return `https://wa.me/${value}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  if (key === "email") return `mailto:${value}`;
  return value; // github: enlace completo
}

function setupContactLinks() {
  document.querySelectorAll("[data-contact]").forEach((link) => {
    const key = link.dataset.contact;
    const value = CONTACT[key];

    if (isPlaceholder(value)) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        showToast("Este dato todavía no está configurado. Se cambia en script.js, en la sección CONTACT.");
      });
      return;
    }

    link.href = buildContactUrl(key, value);
  });
}


// ------------------------------------------------------------
// 6. Botón "Ver código" de cada proyecto (solo si hay repositorio)
// ------------------------------------------------------------
function setupRepositoryLinks() {
  document.querySelectorAll(".project-card").forEach((card) => {
    const repoUrl = REPOSITORIES[card.dataset.project];
    if (!repoUrl) return;

    const repoLink = card.querySelector(".repo-link");
    repoLink.href = repoUrl;
    repoLink.hidden = false;
  });
}


// ------------------------------------------------------------
// 7. Año actual en el footer
// ------------------------------------------------------------
function setFooterYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}


// ------------------------------------------------------------
// Iniciar todo
// ------------------------------------------------------------
setupMobileMenu();
setupSmoothScroll();
setupHeaderShadow();
setupActiveLink();
setupContactLinks();
setupRepositoryLinks();
setFooterYear();
