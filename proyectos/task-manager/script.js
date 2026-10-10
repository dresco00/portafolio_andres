// ============================================================
// TASK MANAGER · JavaScript
//
// Cómo funciona (idea general):
//   1. Las tareas viven en un arreglo: `tasks`.
//   2. Cada acción (agregar, editar, completar, eliminar) cambia ese arreglo,
//      lo guarda en LocalStorage y vuelve a dibujar la pantalla con render().
// ============================================================


// ------------------------------------------------------------
// CONFIGURACIÓN
// ------------------------------------------------------------
const STORAGE_KEY = "taskManager.tasks";

// Si es true, la primera vez que se abre la app aparecen 3 tareas de ejemplo.
// Ponlo en false si prefieres que empiece vacía.
const SHOW_EXAMPLE_TASKS = true;

const PRIORITY_LABELS = { alta: "Alta", media: "Media", baja: "Baja" };


// ------------------------------------------------------------
// ESTADO DE LA APLICACIÓN
// ------------------------------------------------------------
let tasks = [];            // todas las tareas
let currentFilter = "todas"; // "todas" | "pendientes" | "completadas"
let editingId = null;      // id de la tarea que se está editando (null = ninguna)


// ------------------------------------------------------------
// REFERENCIAS AL HTML
// ------------------------------------------------------------
const form = document.getElementById("task-form");
const formCard = document.querySelector(".form-card");
const formTitle = document.getElementById("form-title");
const titleInput = document.getElementById("task-title");
const descriptionInput = document.getElementById("task-description");
const dateInput = document.getElementById("task-date");
const priorityInput = document.getElementById("task-priority");
const titleError = document.getElementById("title-error");
const submitButton = document.getElementById("submit-btn");
const cancelButton = document.getElementById("cancel-btn");

const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const counter = document.getElementById("counter");
const clearCompletedButton = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter-btn");

const statTotal = document.getElementById("stat-total");
const statPending = document.getElementById("stat-pending");
const statDone = document.getElementById("stat-done");


// ============================================================
// 1. GUARDAR Y CARGAR (LocalStorage)
// ============================================================
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.warn("No se pudieron guardar las tareas:", error);
  }
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn("No se pudieron leer las tareas guardadas:", error);
    return [];
  }

  // Primera visita (no hay nada guardado todavía)
  return SHOW_EXAMPLE_TASKS ? createExampleTasks() : [];
}

function createExampleTasks() {
  return [
    createTask("Preparar la presentación del lunes", "Revisar las diapositivas y practicar la introducción.", getDateOffset(2), "alta"),
    createTask("Comprar los materiales del proyecto", "", getDateOffset(5), "media"),
    { ...createTask("Responder los correos pendientes", "", "", "baja"), completed: true },
  ];
}

// Devuelve una fecha "YYYY-MM-DD" a N días de hoy (solo para las tareas de ejemplo)
function getDateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDateForInput(date);
}

function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


// ============================================================
// 2. OPERACIONES SOBRE LAS TAREAS
// ============================================================
function createTask(title, description, date, priority) {
  return {
    id: Date.now().toString() + Math.random().toString(16).slice(2, 6), // identificador único
    title,
    description,
    date,
    priority,
    completed: false,
  };
}

function addTask(title, description, date, priority) {
  tasks.unshift(createTask(title, description, date, priority)); // unshift = al principio de la lista
}

function updateTask(id, title, description, date, priority) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  task.title = title;
  task.description = description;
  task.date = date;
  task.priority = priority;
}

function toggleTask(id) {
  const task = tasks.find((item) => item.id === id);
  if (task) task.completed = !task.completed;
}

function deleteTask(id) {
  tasks = tasks.filter((item) => item.id !== id);
}


// ============================================================
// 3. FORMULARIO: validación, edición y limpieza
// ============================================================
function showTitleError(message) {
  titleError.textContent = message;
  if (message) {
    titleInput.setAttribute("aria-invalid", "true");
  } else {
    titleInput.removeAttribute("aria-invalid");
  }
}

// Devuelve el mensaje de error, o "" si el título es válido
function validateTitle(title) {
  if (title === "") return "Escribe un título para la tarea.";
  if (title.length < 3) return "El título debe tener al menos 3 caracteres.";
  return "";
}

function resetForm() {
  form.reset();
  priorityInput.value = "media";
  showTitleError("");
  editingId = null;

  formTitle.textContent = "Nueva tarea";
  submitButton.textContent = "Agregar tarea";
  cancelButton.hidden = true;
  formCard.classList.remove("is-editing");
}

function startEditing(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  editingId = id;
  titleInput.value = task.title;
  descriptionInput.value = task.description;
  dateInput.value = task.date;
  priorityInput.value = task.priority;
  showTitleError("");

  formTitle.textContent = "Editar tarea";
  submitButton.textContent = "Guardar cambios";
  cancelButton.hidden = false;
  formCard.classList.add("is-editing");

  render(); // para resaltar la tarea que se edita
  formCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  titleInput.focus();
}

function handleSubmit(event) {
  event.preventDefault(); // evita que la página se recargue

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const date = dateInput.value;
  const priority = priorityInput.value;

  const errorMessage = validateTitle(title);
  if (errorMessage) {
    showTitleError(errorMessage);
    titleInput.focus();
    return;
  }

  if (editingId) {
    updateTask(editingId, title, description, date, priority);
  } else {
    addTask(title, description, date, priority);
  }

  saveTasks();
  resetForm();
  render();
}


// ============================================================
// 4. DIBUJAR LA PANTALLA
// ============================================================
function sortTasks(taskItems) {
  const priorityWeight = { alta: 0, media: 1, baja: 2 };

  return [...taskItems].sort((a, b) => {
    if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);

    const dateA = a.date || "9999-12-31";
    const dateB = b.date || "9999-12-31";

    if (dateA !== dateB) return dateA.localeCompare(dateB);

    return (priorityWeight[a.priority] ?? 99) - (priorityWeight[b.priority] ?? 99);
  });
}

function getFilteredTasks() {
  const orderedTasks = sortTasks(tasks);

  if (currentFilter === "pendientes") return orderedTasks.filter((task) => !task.completed);
  if (currentFilter === "completadas") return orderedTasks.filter((task) => task.completed);
  return orderedTasks;
}

// Convierte "2026-10-08" en "8 oct 2026" (sin problemas de zona horaria)
function formatDateForDisplay(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

function isOverdue(task) {
  if (!task.date || task.completed) return false;
  return task.date < formatDateForInput(new Date()); // comparar "YYYY-MM-DD" como texto funciona
}

// Crea un elemento HTML con texto. Usamos textContent (no innerHTML)
// para que lo que escriba el usuario nunca se interprete como código.
function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function buildTaskElement(task) {
  const item = createElement("li", "task");
  item.dataset.id = task.id;
  if (task.completed) item.classList.add("is-done");
  if (task.id === editingId) item.classList.add("is-editing");

  // Casilla de completada
  const checkbox = createElement("input", "task-check");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.dataset.action = "toggle";
  checkbox.setAttribute("aria-label", `Marcar como completada: ${task.title}`);

  // Contenido
  const content = createElement("div", "task-content");
  content.appendChild(createElement("p", "task-title", task.title));
  if (task.description) content.appendChild(createElement("p", "task-desc", task.description));

  const meta = createElement("div", "task-meta");
  meta.appendChild(createElement("span", `badge badge-${task.priority}`, `Prioridad ${PRIORITY_LABELS[task.priority].toLowerCase()}`));
  if (task.date) {
    const dateText = formatDateForDisplay(task.date) + (isOverdue(task) ? " · Vencida" : "");
    meta.appendChild(createElement("span", isOverdue(task) ? "overdue" : "", dateText));
  }
  content.appendChild(meta);

  // Botones
  const actions = createElement("div", "task-actions");
  const editButton = createElement("button", "icon-btn", "Editar");
  editButton.type = "button";
  editButton.dataset.action = "edit";
  editButton.setAttribute("aria-label", `Editar: ${task.title}`);

  const deleteButton = createElement("button", "icon-btn danger", "Eliminar");
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  deleteButton.setAttribute("aria-label", `Eliminar: ${task.title}`);

  actions.append(editButton, deleteButton);
  item.append(checkbox, content, actions);
  return item;
}

function updateSummary() {
  const total = tasks.length;
  const done = tasks.filter((task) => task.completed).length;
  const pending = total - done;

  statTotal.textContent = total;
  statDone.textContent = done;
  statPending.textContent = pending;
  clearCompletedButton.hidden = done === 0;
}

function getEmptyMessage() {
  if (tasks.length === 0) return "Todavía no tienes tareas. Crea la primera con el formulario.";
  if (currentFilter === "pendientes") return "No tienes tareas pendientes.";
  if (currentFilter === "completadas") return "Aún no has completado ninguna tarea.";
  return "";
}

function render() {
  const visibleTasks = getFilteredTasks();

  taskList.replaceChildren(...visibleTasks.map(buildTaskElement));

  emptyMessage.textContent = getEmptyMessage();
  emptyMessage.hidden = visibleTasks.length > 0;

  counter.textContent = `${visibleTasks.length} ${visibleTasks.length === 1 ? "tarea" : "tareas"}`;
  updateSummary();
}

function clearCompletedTasks() {
  const completedTasks = tasks.filter((task) => task.completed).length;
  if (!completedTasks) return;

  const confirmed = confirm(`¿Eliminar las ${completedTasks} tareas completadas?`);
  if (!confirmed) return;

  tasks = tasks.filter((task) => !task.completed);

  if (editingId && tasks.every((task) => task.id !== editingId)) {
    resetForm();
  }

  saveTasks();
  render();
}


// ============================================================
// 5. EVENTOS
// ============================================================
function handleListClick(event) {
  const actionElement = event.target.closest("[data-action]");
  if (!actionElement) return;

  const id = actionElement.closest(".task").dataset.id;
  const action = actionElement.dataset.action;

  if (action === "toggle") {
    toggleTask(id);
    saveTasks();
    render();
  }

  if (action === "edit") {
    startEditing(id);
  }

  if (action === "delete") {
    const task = tasks.find((item) => item.id === id);
    const confirmed = confirm(`¿Eliminar la tarea "${task.title}"?`);
    if (!confirmed) return;

    deleteTask(id);
    if (editingId === id) resetForm(); // si se estaba editando esa tarea, se cancela
    saveTasks();
    render();
  }
}

function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach((button) => {
    const isSelected = button.dataset.filter === filter;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
  render();
}

function setupEvents() {
  form.addEventListener("submit", handleSubmit);
  cancelButton.addEventListener("click", () => { resetForm(); render(); });
  taskList.addEventListener("click", handleListClick);
  clearCompletedButton.addEventListener("click", clearCompletedTasks);

  // Quitar el mensaje de error en cuanto la persona vuelve a escribir
  titleInput.addEventListener("input", () => showTitleError(""));

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.filter));
  });
}


// ============================================================
// INICIO
// ============================================================
tasks = loadTasks();
saveTasks(); // guarda también las tareas de ejemplo en la primera visita
setupEvents();
render();
document.getElementById("year").textContent = new Date().getFullYear();
