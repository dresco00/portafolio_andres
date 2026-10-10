# Mi portafolio de desarrollador freelance

Cuatro sitios web independientes hechos solo con **HTML, CSS y JavaScript** (sin frameworks):
tres proyectos de demostración y tu portafolio personal, que enlaza a los tres.

> Los proyectos son **de demostración**: los negocios, personas, precios, direcciones y textos son ficticios y así se indica en cada página.

---

## 1. Qué archivos hay y para qué sirve cada uno

```
MI-PORTAFOLIO/
├── index.html                  Redirige al portafolio (así Netlify abre tu portafolio al entrar al sitio)
├── README.md                   Esta guía
│
├── portafolio/                 TU PORTAFOLIO PERSONAL (la página que compartes con clientes)
│   ├── index.html              Contenido: inicio, sobre mí, formación, servicios, tecnologías, proyectos, proceso, contacto
│   ├── style.css               Colores, tipografías y diseño
│   ├── script.js               Menú móvil, navegación suave y TUS DATOS DE CONTACTO (arriba del archivo)
│   └── assets/
│       ├── favicon.svg                      Ícono de la pestaña (marcador, reemplazable)
│       └── preview-*.jpg                    Imágenes de las tarjetas de proyectos
│
└── proyectos/
    ├── sabor-caribe/           Página para un restaurante (demuestra: sitios para negocios)
    ├── daniela-photography/    Portafolio de una fotógrafa (demuestra: diseño visual)
    └── task-manager/           App de tareas (demuestra: lógica con JavaScript)
        Cada uno tiene:  index.html (contenido) · style.css (diseño) · script.js (comportamiento) · assets/ (imágenes e ícono)
```

Cada proyecto se abre y funciona por separado; no dependen unos de otros.

---

## 2. Dónde cambiar cada cosa en tu portafolio

Todo está en la carpeta `portafolio/`.

| Qué quieres cambiar | Archivo | Dónde |
|---|---|---|
| **Tu nombre** | `index.html` | Busca `Andrés Cordero`: está en el logo, el título (`<title>`), el `<h1>` del inicio y el footer. Los comentarios `CAMBIAR AQUÍ` marcan los lugares principales. |
| **Tu descripción** | `index.html` | Sección `SOBRE MÍ` (3 párrafos). También `<meta name="description">` arriba del archivo: es el texto que ve Google. |
| **Tus habilidades y tecnologías** | `index.html` | Sección `TECNOLOGÍAS Y CAPACIDADES`: edita los textos sobre desarrollo web, Python, backend y datos, además de la lista de tecnologías. |
| **La terminal del inicio** | `index.html` | Bloque `terminal-body`: son líneas de texto decorativas, cámbialas cuando aprendas algo nuevo. |
| **Frase principal** | `index.html` | Sección `INICIO`, la clase `hero-lead`. |
| **WhatsApp** | `script.js` | Arriba, en `CONTACT`: `whatsapp: "WHATSAPP_NUMBER_AQUI"`. Escribe código de país + número, solo dígitos. Colombia: `"573001234567"`. |
| **Correo** | `script.js` | `email: "CORREO_AQUI"` → `"tucorreo@ejemplo.com"` |
| **GitHub** | `script.js` | `github: "GITHUB_AQUI"` → `"https://github.com/tu-usuario"` |
| **Mensaje de WhatsApp** | `script.js` | `WHATSAPP_MESSAGE` |
| **Botón "Ver código"** de cada proyecto | `script.js` | `REPOSITORIES`: pega el enlace de cada repositorio de GitHub. Si lo dejas vacío (`""`), el botón no se muestra. |
| **Colores** | `style.css` | Bloque `:root` al inicio (`--accent`, `--ink`…). |
| **Favicon** | `assets/favicon.svg` | Reemplázalo por tu ícono (mismo nombre de archivo). |

Mientras un dato de contacto siga siendo el marcador (`…_AQUI`), el botón muestra un aviso en vez de abrir un enlace roto.
**Antes de publicar, completa los tres** (WhatsApp, correo y GitHub). El portafolio ya no tiene botón de LinkedIn.

### Agregar un proyecto nuevo
1. Pon la carpeta del proyecto dentro de `proyectos/` (con su `index.html`).
2. En `portafolio/index.html`, busca el comentario `PARA AGREGAR UN PROYECTO NUEVO`. Copia una tarjeta `<article class="project-card">` completa, pégala dentro de `projects-grid` y cambia: `data-project`, la imagen, el título, la descripción, las etiquetas de tecnologías y el `href` de "Ver proyecto" (por ejemplo `../proyectos/mi-proyecto/index.html`).
3. Para el botón "Ver código", agrega el mismo nombre de `data-project` en `REPOSITORIES` dentro de `script.js`.
4. Imagen de la tarjeta: una captura de pantalla de tu proyecto, guardada en `portafolio/assets/`.

### Cambiar imágenes
- **Vistas previas de proyectos:** reemplaza `portafolio/assets/preview-*.jpg` por capturas tuyas (conviene proporción 16:10, por ejemplo 1280×800) o cambia la ruta en el `<img>` de la tarjeta.
- **Sabor Caribe y Daniela Photography:** las imágenes de `assets/` son **ilustraciones SVG de demostración** generadas para no depender de fotos con derechos de autor. Para usar fotos reales, guárdalas en el `assets/` de ese proyecto y cambia el `src` en su `index.html`. Fuentes de fotos libres: Unsplash, Pexels o Pixabay (revisa siempre la licencia). En Daniela Photography, no olvides actualizar `width`, `height` y `alt` de cada foto.
- Después de cambiar los proyectos, actualiza las vistas previas del portafolio.

---

## 3. Cómo abrir cada proyecto en tu computador

Haz doble clic en el `index.html` de la carpeta que quieras:

- Portafolio: `portafolio/index.html`
- Sabor Caribe: `proyectos/sabor-caribe/index.html`
- Daniela Photography: `proyectos/daniela-photography/index.html`
- Task Manager: `proyectos/task-manager/index.html`

Las tipografías vienen de Google Fonts, así que necesitas internet para verlas tal como se diseñaron (sin conexión se usa una fuente de respaldo y todo sigue funcionando).
Si usas VS Code, la extensión **Live Server** actualiza la página sola cuando guardas cambios.

---

## 4. Cómo publicar todo en Netlify

Debes subir **toda** la carpeta `MI-PORTAFOLIO` (no solo `portafolio/`), porque las tarjetas de proyectos enlazan a la carpeta `proyectos/`.

**Opción A: arrastrar y soltar (la más rápida)**
1. Completa tus datos de contacto en `portafolio/script.js` (sección 2).
2. Crea una cuenta gratuita en [netlify.com](https://www.netlify.com).
3. Entra a [app.netlify.com/drop](https://app.netlify.com/drop).
4. Arrastra la carpeta `MI-PORTAFOLIO` (descomprimida) al recuadro.
5. En unos segundos recibes una dirección `algo.netlify.app`. Al abrirla, entra directo a tu portafolio.
6. En *Site configuration → Change site name* puedes cambiar `algo` por algo como `andres-cordero-dev`.

**Opción B: con GitHub (recomendada para ir actualizando)**
1. Sube la carpeta `MI-PORTAFOLIO` a un repositorio de GitHub.
2. En Netlify: *Add new site → Import an existing project* y elige el repositorio.
3. Deja vacíos los campos *Build command* y *Publish directory* (es un sitio estático).
4. Cada vez que hagas `git push`, el sitio se actualiza solo.

### Lista de verificación antes de publicar
- [ ] WhatsApp, correo y GitHub completados en `portafolio/script.js`
- [ ] Revisaste que las habilidades y tecnologías descritas correspondan a tu experiencia real
- [ ] Probaste cada botón de la sección Contacto
- [ ] Botón "Ver proyecto" abre cada proyecto
- [ ] Leíste "Sobre mí" en voz alta y cambiaste lo que no suene como tú
- [ ] Abriste el sitio en el celular

---

## 5. Notas honestas sobre este material

- Todo el contenido de los tres proyectos es ficticio y está identificado como demostración. No hay clientes, testimonios ni cifras inventadas.
- El portafolio no muestra porcentajes de dominio ni años de experiencia: habla de lo que estás estudiando y construyendo hoy.
- **Sabor Caribe** y **Daniela Photography** usan ilustraciones SVG. Se verían mucho mejor con fotos reales de uso libre (Unsplash, Pexels); está explicado más arriba.
- **Task Manager** guarda las tareas en el `localStorage` del navegador de cada visitante: nadie más las ve y no hay base de datos.
- La primera vez que se abre Task Manager aparecen 3 tareas de ejemplo. Para quitarlas, pon `SHOW_EXAMPLE_TASKS = false` al inicio de su `script.js`.
- Los formularios y botones de Sabor Caribe y Daniela Photography son demostrativos: no envían nada a ningún servidor.
