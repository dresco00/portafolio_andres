// ============================================================
// SABOR CARIBE · JavaScript
// Cada función hace una sola cosa. Al final del archivo se llaman todas.
// ============================================================


// ------------------------------------------------------------
// CONFIGURACIÓN: aquí cambias el número de WhatsApp
// Formato: código de país + número, sin "+", sin espacios.
// Ejemplo para Colombia: "573001234567"
// ------------------------------------------------------------
const WHATSAPP_NUMBER = "WHATSAPP_NUMBER_AQUI";
const WHATSAPP_MESSAGE = "Hola, quiero reservar una mesa en Sabor Caribe.";


// ------------------------------------------------------------
// Referencias a elementos del HTML
// ------------------------------------------------------------
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const filterButtons = document.querySelectorAll(".filter-btn");
const dishCards = document.querySelectorAll(".dish-card");
const menuCount = document.getElementById("menu-count");
const whatsappButton = document.getElementById("whatsapp-btn");
const toast = document.getElementById("toast");

let toastTimer; // guarda el temporizador del mensaje flotante


// ------------------------------------------------------------
// 1. Menú móvil (botón de tres rayas)
// ------------------------------------------------------------
function openMobileMenu() {
  header.classList.add("nav-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Cerrar menú de navegación");
}

function closeMobileMenu() {
  header.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menú de navegación");
}

function setupMobileMenu() {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.contains("nav-open");
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Cerrar con la tecla Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileMenu();
  });

  // Si la pantalla se agranda, cerrar el menú móvil
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMobileMenu();
  });
}


// ------------------------------------------------------------
// 2. Navegación suave: al hacer clic en un enlace "#sección"
//    la página se desplaza con animación en lugar de saltar.
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
// 3. Sombra en la barra de navegación cuando se baja la página
// ------------------------------------------------------------
function setupHeaderShadow() {
  function update() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}


// ------------------------------------------------------------
// 4. Resaltar en la barra el enlace de la sección que se está viendo
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
// 5. Filtro del menú por categoría
//    Cada tarjeta del HTML tiene data-category="entradas|platos|bebidas".
//    Cada botón tiene data-filter con el mismo nombre (o "todos").
// ------------------------------------------------------------
function filterMenu(category) {
  let visibleCount = 0;

  dishCards.forEach((card) => {
    const matches = category === "todos" || card.dataset.category === category;
    card.hidden = !matches;
    if (matches) visibleCount++;
  });

  menuCount.textContent = `Mostrando ${visibleCount} ${visibleCount === 1 ? "plato" : "platos"}`;
}

function setupMenuFilter() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((other) => {
        const isSelected = other === button;
        other.classList.toggle("is-active", isSelected);
        other.setAttribute("aria-pressed", String(isSelected));
      });
      filterMenu(button.dataset.filter);
    });
  });

  filterMenu("todos");
}


// ------------------------------------------------------------
// 6. Mensaje flotante (toast)
// ------------------------------------------------------------
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3500);
}


// ------------------------------------------------------------
// 7. Botón de WhatsApp
//    Arma el enlace con el número y el mensaje. Si el número todavía
//    es el de ejemplo, muestra un aviso en lugar de abrir un enlace roto.
// ------------------------------------------------------------
function setupWhatsApp() {
  const numberIsConfigured = !WHATSAPP_NUMBER.includes("_AQUI");

  if (numberIsConfigured) {
    const text = encodeURIComponent(WHATSAPP_MESSAGE);
    whatsappButton.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    return;
  }

  whatsappButton.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("Botón de demostración: en este ejemplo no hay un número de WhatsApp real.");
  });
}


// ------------------------------------------------------------
// 8. Botón "Reservar" del inicio: baja a Contacto y destaca el botón de WhatsApp
// ------------------------------------------------------------
function setupReserveButton() {
  const reserveButton = document.querySelector('[data-action="reservar"]');

  reserveButton.addEventListener("click", () => {
    whatsappButton.classList.remove("is-highlighted");
    // Esperamos un momento para que termine el desplazamiento antes de destacar
    setTimeout(() => whatsappButton.classList.add("is-highlighted"), 600);
  });

  whatsappButton.addEventListener("animationend", () => {
    whatsappButton.classList.remove("is-highlighted");
  });
}


// ------------------------------------------------------------
// 9. Año actual en el footer
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
setupMenuFilter();
setupWhatsApp();
setupReserveButton();
setFooterYear();
