// ============================================================
// DANIELA PHOTOGRAPHY · JavaScript
// Cada función hace una sola cosa. Al final del archivo se llaman todas.
// ============================================================


// ------------------------------------------------------------
// Referencias a elementos del HTML
// ------------------------------------------------------------
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a");

const filterButtons = document.querySelectorAll(".filter-btn");
const photos = document.querySelectorAll(".photo");

const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lb-image");
const lbTitle = document.getElementById("lb-title");
const lbCount = document.getElementById("lb-count");
const lbFigure = document.getElementById("lb-figure");

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

// Estado del visor: qué fotos se pueden recorrer y cuál se está mostrando
let lightboxPhotos = [];
let lightboxIndex = 0;


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

  // Al elegir una sección, el menú se cierra
  navLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.open) closeMobileMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMobileMenu();
  });
}


// ------------------------------------------------------------
// 2. Línea inferior en la barra al bajar la página
// ------------------------------------------------------------
function setupHeaderLine() {
  function update() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}


// ------------------------------------------------------------
// 3. Filtro de la galería por categoría
//    Cada foto tiene data-category; cada botón tiene data-filter.
// ------------------------------------------------------------
function filterGallery(category) {
  photos.forEach((photo) => {
    const matches = category === "todo" || photo.dataset.category === category;
    photo.hidden = !matches;
  });
}

function setupFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((other) => {
        const isSelected = other === button;
        other.classList.toggle("is-active", isSelected);
        other.setAttribute("aria-pressed", String(isSelected));
      });
      filterGallery(button.dataset.filter);
    });
  });
}


// ------------------------------------------------------------
// 4. Visor de imágenes (modal)
// ------------------------------------------------------------
function getVisiblePhotos() {
  return Array.from(photos).filter((photo) => !photo.hidden);
}

function showPhoto(index) {
  // Si pasamos del último, volvemos al primero (y al revés)
  lightboxIndex = (index + lightboxPhotos.length) % lightboxPhotos.length;

  const photo = lightboxPhotos[lightboxIndex];
  const thumbnail = photo.querySelector("img");

  lbImage.style.opacity = 0;
  lbImage.src = thumbnail.getAttribute("src");
  lbImage.alt = thumbnail.alt;
  lbTitle.textContent = `${photo.dataset.title} · ${photo.dataset.label}`;
  lbCount.textContent = `${lightboxIndex + 1} / ${lightboxPhotos.length}`;

  lbImage.onload = () => { lbImage.style.opacity = 1; };
  if (lbImage.complete) lbImage.style.opacity = 1;
}

function openLightbox(photo) {
  lightboxPhotos = getVisiblePhotos(); // solo recorremos las fotos del filtro activo
  showPhoto(lightboxPhotos.indexOf(photo));
  lightbox.showModal();
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  lightbox.close();
}

function showNextPhoto() { showPhoto(lightboxIndex + 1); }
function showPreviousPhoto() { showPhoto(lightboxIndex - 1); }

function setupLightbox() {
  // Abrir: clic en cualquier miniatura
  photos.forEach((photo) => {
    photo.querySelector(".photo-btn").addEventListener("click", () => openLightbox(photo));
  });

  // Botones del visor
  lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lb-next").addEventListener("click", showNextPhoto);
  lightbox.querySelector(".lb-prev").addEventListener("click", showPreviousPhoto);

  // Clic en el fondo oscuro (fuera de la imagen) cierra el visor
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target === lbFigure) closeLightbox();
  });

  // Teclado: flechas para navegar (Escape ya cierra el <dialog> por defecto)
  document.addEventListener("keydown", (event) => {
    if (!lightbox.open) return;
    if (event.key === "ArrowRight") showNextPhoto();
    if (event.key === "ArrowLeft") showPreviousPhoto();
  });

  // Al cerrarse (por cualquier medio) se vuelve a permitir el scroll
  lightbox.addEventListener("close", () => document.body.classList.remove("no-scroll"));

  // Móvil: deslizar el dedo a izquierda o derecha
  let touchStartX = 0;
  lbFigure.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  lbFigure.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 50) return; // movimiento muy corto: se ignora
    if (distance < 0) showNextPhoto(); else showPreviousPhoto();
  });
}


// ------------------------------------------------------------
// 5. Formulario de contacto (solo demostración: no se envía a ningún servidor)
// ------------------------------------------------------------
function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}-error`);
  errorElement.textContent = message;
  if (message) {
    field.setAttribute("aria-invalid", "true");
  } else {
    field.removeAttribute("aria-invalid");
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Devuelve true si todos los campos son correctos
function validateForm() {
  const name = contactForm.elements.name.value.trim();
  const email = contactForm.elements.email.value.trim();
  const message = contactForm.elements.message.value.trim();
  let isValid = true;

  if (name.length < 2) {
    setFieldError("name", "Escribe tu nombre.");
    isValid = false;
  } else {
    setFieldError("name", "");
  }

  if (!isValidEmail(email)) {
    setFieldError("email", "Escribe un correo válido, por ejemplo nombre@correo.com.");
    isValid = false;
  } else {
    setFieldError("email", "");
  }

  if (message.length < 10) {
    setFieldError("message", "El mensaje debe tener al menos 10 caracteres.");
    isValid = false;
  } else {
    setFieldError("message", "");
  }

  return isValid;
}

function showFormStatus(text) {
  formStatus.textContent = text;
  formStatus.classList.toggle("is-visible", Boolean(text));
}

function setupContactForm() {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault(); // evita que la página se recargue
    showFormStatus("");

    if (!validateForm()) {
      // Llevar el cursor al primer campo con error
      contactForm.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    showFormStatus("Esto es una demostración: tu mensaje no se envió a ningún lado. Gracias por probar el formulario.");
    contactForm.reset();
  });
}


// ------------------------------------------------------------
// 6. Año actual en el footer
// ------------------------------------------------------------
function setFooterYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}


// ------------------------------------------------------------
// Iniciar todo
// ------------------------------------------------------------
setupMobileMenu();
setupHeaderLine();
setupFilters();
setupLightbox();
setupContactForm();
setFooterYear();
