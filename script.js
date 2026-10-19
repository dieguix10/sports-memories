"use strict";

/* ============================================================
   SPORTS MEMORIES · Lógica de la aplicación
   Diario personal de recuerdos deportivos.
   Datos y fotografías se guardan en localStorage.
   ============================================================ */

/* ---------- 1. Configuración ---------- */
const STORAGE_KEY = "sportsMemories.v1";
const MAX_PHOTOS = 8;
const MAX_PHOTO_SIDE = 1400;
const PHOTO_QUALITY = 0.72;

const DEPORTES = {
  ciclismo: { label: "Ciclismo", icon: "bike" },
  running: { label: "Running", icon: "running" },
  gimnasio: { label: "Gimnasio", icon: "gym" },
  natacion: { label: "Natación", icon: "swim" },
  senderismo: { label: "Senderismo", icon: "hike" },
  otro: { label: "Otro", icon: "sparkles" },
};

/* Iconos de línea (SVG estático y de confianza, nunca datos del usuario) */
const ICONS = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  route: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="19" r="2.4"/><circle cx="18" cy="5" r="2.4"/><path d="M8.4 18.4c4.5-.7 7.2-2.4 7.2-6.2 0-3.2-2.6-4.8-5.2-4.8"/></svg>',
  mountain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 19.5 9 8l4 6.5 2.4-4 6.1 9H2.5Z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.4"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M6.5 7l.8 13h9.4l.8-13M10 11v5M14 11v5"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16v4Z"/><path d="m13 7 4 4"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5"/><circle cx="12" cy="17.2" r=".9" fill="currentColor" stroke="none"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.8" r=".9" fill="currentColor" stroke="none"/></svg>',
  bike: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5.5" cy="17.5" r="3.4"/><circle cx="18.5" cy="17.5" r="3.4"/><path d="M5.5 17.5 9.5 9h4.5l4.5 8.5M9.5 9 7.5 5.5H5M14 9l4-3.5h2M8 17.5h7"/></svg>',
  running: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="15.5" cy="4.5" r="2"/><path d="m13.5 8.5-4.5 3 2.5 3.5-2.5 6M9 11.5l-4 1M14 9.5l3.5 2 .5 4M11.5 15l4.5 6"/></svg>',
  gym: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 8v8M3.5 10v4M17.5 8v8M20.5 10v4M6.5 12h11M2 12h1.5M20.5 12H22"/></svg>',
  swim: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="16" cy="6" r="2"/><path d="m3 10 6-3 4 2 3-2M2 16c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M2 20c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/></svg>',
  hike: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20 9 8l4 6 2-3 6 9H3Z"/><path d="M9 8V4h4"/><path d="M13 4v2.5"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/></svg>',
};

/* ---------- 2. Estado de la aplicación ---------- */
let records = [];
let storageOK = true;

let currentSection = "inicio";
let editingId = null;
let draftPhotos = [];
let processingPhotos = false;

let detailId = null;
let detailPhotoIndex = 0;
let lightboxPhotos = [];
let lightboxIndex = 0;

const now = new Date();
let calendarYear = now.getFullYear();
let calendarMonth = now.getMonth();
let selectedDate = todayISO();
let calendarEnterDirection = "";

let activeSport = "all";

/* ---------- 3. Utilidades generales ---------- */
function $(selector, root = document) {
  return root.querySelector(selector);
}

function $$(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

/* Crea un SVG a partir de una constante de confianza (nunca de datos del usuario) */
function icon(name, className = "icon") {
  const template = document.createElement("template");
  template.innerHTML = (ICONS[name] || "").trim();
  const svg = template.content.firstElementChild;
  if (svg && className) svg.setAttribute("class", className);
  return svg;
}

function uid() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return "sm-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
}

function clampText(value, max) {
  return String(value == null ? "" : value).trim().slice(0, max);
}

const numberFormatter = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 });

function formatNumber(value) {
  return numberFormatter.format(value);
}

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

/* ---------- 4. Fechas locales (sin desfases UTC) ---------- */
function pad2(number) {
  return String(number).padStart(2, "0");
}

function dateToISO(date) {
  return date.getFullYear() + "-" + pad2(date.getMonth() + 1) + "-" + pad2(date.getDate());
}

function todayISO() {
  return dateToISO(new Date());
}

function parseISODate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function isValidISODate(value) {
  return parseISODate(value) !== null;
}

function formatLongDate(iso) {
  const date = parseISODate(iso);
  if (!date) return "";
  return capitalize(
    new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  );
}

function formatShortDate(iso) {
  const date = parseISODate(iso);
  if (!date) return "";
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatMonthTitle(year, month) {
  return capitalize(
    new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(
      new Date(year, month, 1)
    )
  );
}

function monthKey(year, month) {
  return year + "-" + pad2(month + 1);
}

/* ---------- 5. Carga y validación de datos guardados ---------- */
function toOptionalNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.round(number * 10) / 10;
}

function sanitizeRecord(raw) {
  if (!raw || typeof raw !== "object") return null;

  const titulo = clampText(raw.titulo, 100);
  if (!titulo) return null;

  const deporte = Object.prototype.hasOwnProperty.call(DEPORTES, raw.deporte)
    ? raw.deporte
    : "otro";

  const fecha = isValidISODate(raw.fecha) ? raw.fecha : todayISO();
  const fotos = Array.isArray(raw.fotos)
    ? raw.fotos
        .filter((photo) => typeof photo === "string" && photo.startsWith("data:image/"))
        .slice(0, MAX_PHOTOS)
    : [];

  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : uid(),
    titulo,
    deporte,
    fecha,
    descripcion: clampText(raw.descripcion, 1200),
    distancia: toOptionalNumber(raw.distancia),
    duracion: clampText(raw.duracion, 30),
    desnivel: toOptionalNumber(raw.desnivel),
    notas: clampText(raw.notas, 1200),
    fotos,
    creado: Number.isFinite(raw.creado) ? raw.creado : Date.now(),
  };
}

function checkStorageAvailability() {
  try {
    const testKey = STORAGE_KEY + ".test";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn("localStorage no disponible:", error);
    return false;
  }
}

function loadRecords() {
  if (!checkStorageAvailability()) {
    storageOK = false;
    return [];
  }

  let raw = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("El formato guardado no es una lista");
    return parsed.map(sanitizeRecord).filter(Boolean);
  } catch (error) {
    console.error("No se pudieron cargar los recuerdos:", error);
    // Conservamos una copia del contenido dañado antes de sobrescribirlo.
    if (raw) {
      try {
        window.localStorage.setItem(STORAGE_KEY + ".backup", raw);
      } catch (backupError) {
        console.warn("No se pudo crear la copia de seguridad:", backupError);
      }
    }
    showToast("No pudimos cargar los recuerdos guardados. Empezamos de cero.", "error", 6500);
    return [];
  }
}

/* ---------- 6. Avisos (toasts) ---------- */
function showToast(message, type = "success", duration = 4000) {
  const container = $("#toasts");
  if (!container) return;

  const toast = el("div", "toast toast--" + type);
  const iconName = type === "error" ? "alert" : type === "info" ? "info" : "check";
  toast.append(icon(iconName, "toast__icon"));

  const text = el("span", "toast__text");
  text.textContent = message;
  toast.append(text);
  container.append(toast);

  window.setTimeout(() => {
    toast.classList.add("is-leaving");
    window.setTimeout(() => toast.remove(), 320);
  }, duration);
}

/* ---------- 7. Imágenes: lectura, compresión y reducción ---------- */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo decodificar la imagen."));
    image.src = source;
  });
}

/* Reduce y recomprime una imagen en el propio navegador con canvas */
async function downscaleDataURL(source, maxSide, quality) {
  const image = await loadImage(source);
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  if (!width || !height) throw new Error("La imagen no tiene dimensiones válidas.");

  const scale = Math.min(1, maxSide / Math.max(width, height));
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("El navegador no permite procesar la imagen.");

  // Fondo oscuro para fotos con transparencia convertidas a JPEG
  context.fillStyle = "#0c1712";
  context.fillRect(0, 0, targetWidth, targetHeight);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  let output;
  try {
    output = canvas.toDataURL("image/jpeg", quality);
  } catch (error) {
    throw new Error("No se pudo convertir la imagen.");
  }

  // Si no hubo que reducir y la original ya pesa menos, conservamos la original
  if (scale === 1 && source.startsWith("data:image/") && source.length <= output.length) {
    return source;
  }
  return output;
}

async function compressImageFile(file) {
  if (!file || !file.type || !file.type.startsWith("image/")) {
    throw new Error("El archivo no es una imagen.");
  }
  if (file.size > 30 * 1024 * 1024) {
    throw new Error("La imagen supera los 30 MB.");
  }
  const source = await readFileAsDataURL(file);
  return downscaleDataURL(source, MAX_PHOTO_SIDE, PHOTO_QUALITY);
}

async function shrinkPhotoList(photos, maxSide, quality) {
  const result = [];
  for (const photo of photos) {
    try {
      result.push(await downscaleDataURL(photo, maxSide, quality));
    } catch (error) {
      // Si una foto antigua no se puede reprocesar, la mantenemos tal cual.
      result.push(photo);
    }
  }
  return result;
}

/* ---------- 8. Guardado en localStorage ---------- */
function writeRecords(list) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function isQuotaError(error) {
  return Boolean(error) && (
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    error.code === 22 ||
    error.code === 1014
  );
}

function storageErrorMessage(error) {
  if (isQuotaError(error)) {
    return "No hay espacio suficiente en el navegador. Elimina algún recuerdo o reduce el número de fotos.";
  }
  if (error && (error.name === "SecurityError" || error.name === "NotAllowedError")) {
    return "El navegador bloquea el almacenamiento local. Revisa la configuración de privacidad.";
  }
  return "No pudimos guardar los cambios. Inténtalo de nuevo.";
}

/* Intenta guardar; si falta espacio, reduce primero las fotos del recuerdo
   que se está guardando y después todas las demás. */
async function persistWithFallback(list, focusRecordId) {
  try {
    writeRecords(list);
    return { ok: true, records: list, optimized: false };
  } catch (error) {
    if (!isQuotaError(error)) return { ok: false, error };
  }

  const focusRecord = list.find((record) => record.id === focusRecordId);
  if (focusRecord && focusRecord.fotos.length) {
    try {
      const fotos = await shrinkPhotoList(focusRecord.fotos, 1000, 0.6);
      const adjusted = Object.assign({}, focusRecord, { fotos });
      const next = list.map((record) => (record.id === focusRecord.id ? adjusted : record));
      writeRecords(next);
      return { ok: true, records: next, optimized: true };
    } catch (error) {
      if (!isQuotaError(error)) return { ok: false, error };
    }
  }

  try {
    const next = [];
    for (const record of list) {
      if (!record.fotos.length) {
        next.push(record);
        continue;
      }
      const fotos = await shrinkPhotoList(record.fotos, 820, 0.52);
      next.push(Object.assign({}, record, { fotos }));
    }
    writeRecords(next);
    return { ok: true, records: next, optimized: true };
  } catch (error) {
    return { ok: false, error };
  }
}

/* ---------- 9. Diálogos y confirmación ---------- */
function syncModalState() {
  const anyOpen = $$("dialog").some((dialog) => dialog.open);
  document.body.classList.toggle("modal-open", anyOpen);
}

function openDialog(dialog) {
  if (!dialog || dialog.open) return;
  dialog.showModal();
  syncModalState();
}

function closeDialog(dialog) {
  if (dialog && dialog.open) dialog.close();
}

/* Confirmación con promesa: true si se acepta, false si se cancela.
   El resultado se resuelve en los propios clics; el evento "close" queda
   como red de seguridad (p. ej. cerra con Escape o clic en el fondo). */
function askConfirmation(options) {
  const dialog = $("#confirm-dialog");
  const acceptButton = $("#confirm-accept");
  const cancelButton = $("#confirm-cancel");

  $("#confirm-title").textContent = options.title || "¿Seguro?";
  $("#confirm-text").textContent = options.message || "";
  acceptButton.textContent = options.confirmLabel || "Confirmar";
  dialog.returnValue = "cancel";

  return new Promise((resolve) => {
    let settled = false;
    const settle = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    acceptButton.onclick = () => {
      dialog.returnValue = "confirm";
      dialog.close();
      settle(true);
    };
    cancelButton.onclick = () => {
      dialog.returnValue = "cancel";
      dialog.close();
      settle(false);
    };

    dialog.addEventListener(
      "close",
      () => settle(dialog.returnValue === "confirm"),
      { once: true }
    );

    openDialog(dialog);
    window.setTimeout(() => acceptButton.focus(), 60);
  });
}

/* ---------- 10. Orden y datos derivados ---------- */
function sortRecords(list) {
  return list.slice().sort((a, b) => {
    const byDate = String(b.fecha).localeCompare(String(a.fecha));
    if (byDate !== 0) return byDate;
    return (b.creado || 0) - (a.creado || 0);
  });
}

function recordMetaText(record) {
  const parts = [];
  if (record.distancia !== null && record.distancia !== undefined) {
    parts.push(formatNumber(record.distancia) + " km");
  }
  if (record.duracion) parts.push(record.duracion);
  if (record.desnivel !== null && record.desnivel !== undefined) {
    parts.push("+" + formatNumber(record.desnivel) + " m");
  }
  return parts.join(" · ");
}

function countByDate() {
  const map = new Map();
  records.forEach((record) => {
    map.set(record.fecha, (map.get(record.fecha) || 0) + 1);
  });
  return map;
}

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* ---------- 11. Tarjetas de recuerdo ---------- */
function createPlaceholderArt(sportKey) {
  const art = el("span", "placeholder-art");
  const sport = DEPORTES[sportKey] || DEPORTES.otro;
  art.append(icon(sport.icon, "icon icon--xl"));
  return art;
}

function buildStatsLine(record) {
  const parts = [];
  if (record.distancia !== null && record.distancia !== undefined) {
    parts.push(formatNumber(record.distancia) + " km");
  }
  if (record.duracion) parts.push(record.duracion);
  if (record.desnivel !== null && record.desnivel !== undefined) {
    parts.push("+" + formatNumber(record.desnivel) + " m");
  }
  if (!parts.length) return null;

  const line = el("span", "card-stats");
  parts.forEach((part, index) => {
    if (index > 0) line.append(el("span", "dot-sep", "·"));
    line.append(el("span", "", part));
  });
  return line;
}

function createRecordCard(record, variant) {
  const sport = DEPORTES[record.deporte] || DEPORTES.otro;
  const card = el("button", "record-card" + (variant === "gallery" ? " record-card--gallery" : ""));
  card.type = "button";
  card.dataset.id = record.id;
  card.setAttribute(
    "aria-label",
    "Abrir recuerdo: " + record.titulo + ", " + formatShortDate(record.fecha)
  );
  card.addEventListener("click", () => openDetail(record.id));

  const media = el("span", "card-media sport-" + record.deporte);

  if (record.fotos.length) {
    const image = document.createElement("img");
    image.className = "card-media__img";
    image.src = record.fotos[0];
    image.alt = "Fotografía de " + record.titulo;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      image.remove();
      media.classList.add("is-placeholder");
      media.prepend(createPlaceholderArt(record.deporte));
    });
    media.append(image);
  } else {
    media.classList.add("is-placeholder");
    media.append(createPlaceholderArt(record.deporte));
  }

  const chip = el("span", "chip chip--" + record.deporte);
  chip.append(icon(sport.icon, "icon icon--xs"), el("span", "", sport.label));
  media.append(chip);
  media.append(el("span", "card-media__date", formatShortDate(record.fecha)));

  const body = el("span", "card-body");
  body.append(el("span", "card-title", record.titulo));

  const stats = buildStatsLine(record);
  if (stats) body.append(stats);

  if (variant === "gallery" && record.descripcion) {
    body.append(el("span", "card-excerpt", record.descripcion));
  }

  card.append(media, body);
  return card;
}

/* ---------- 12. Inicio ---------- */
function renderHome() {
  const sorted = sortRecords(records);
  const grid = $("#latest-grid");
  const empty = $("#home-empty");
  const hasRecords = sorted.length > 0;

  grid.replaceChildren();
  grid.hidden = !hasRecords;
  empty.hidden = hasRecords;
  $("#latest-link").hidden = !hasRecords;

  sorted.slice(0, 6).forEach((record) => {
    grid.append(createRecordCard(record, "home"));
  });
  staggerItems(grid, ".record-card", { maxIndex: 5 });

  const totalKm = records.reduce((sum, record) => sum + (record.distancia || 0), 0);
  const totalElevation = records.reduce((sum, record) => sum + (record.desnivel || 0), 0);

  animateNumber($("#stat-records"), records.length);
  animateNumber($("#stat-km"), totalKm);
  animateNumber($("#stat-elev"), totalElevation);
}

/* ---------- 13. Calendario ---------- */
function renderCalendar() {
  const grid = $("#calendar-grid");
  const counts = countByDate();
  const today = todayISO();

  $("#calendar-title").textContent = formatMonthTitle(calendarYear, calendarMonth);
  grid.replaceChildren();
  grid.dataset.enter = calendarEnterDirection;
  calendarEnterDirection = "";

  const firstOfMonth = new Date(calendarYear, calendarMonth, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // lunes primero
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  for (let index = 0; index < totalCells; index += 1) {
    const dayNumber = index - startOffset + 1;
    const cellDate = new Date(calendarYear, calendarMonth, dayNumber);
    const iso = dateToISO(cellDate);
    const isOutside = cellDate.getMonth() !== calendarMonth;
    const count = counts.get(iso) || 0;

    const button = el("button", "calendar-day");
    button.type = "button";
    button.dataset.date = iso;

    if (isOutside) button.classList.add("is-outside");
    if (iso === today) button.classList.add("is-today");
    if (iso === selectedDate) button.classList.add("is-selected");
    if (count > 0) button.classList.add("has-records");

    button.setAttribute("aria-pressed", iso === selectedDate ? "true" : "false");
    button.setAttribute(
      "aria-label",
      formatLongDate(iso) + (count
        ? ", " + count + (count === 1 ? " recuerdo" : " recuerdos")
        : ", sin recuerdos")
    );

    button.append(el("span", "calendar-day__number", String(cellDate.getDate())));

    if (count > 0) {
      const dots = el("span", "calendar-day__dots");
      for (let dot = 0; dot < Math.min(count, 3); dot += 1) {
        dots.append(el("span", "calendar-day__dot"));
      }
      button.append(dots);
    }

    button.addEventListener("click", () => {
      if (isOutside) {
        // Día de otro mes: se cambia de mes con un deslizamiento en la dirección correcta.
        calendarYear = cellDate.getFullYear();
        calendarMonth = cellDate.getMonth();
        calendarEnterDirection = cellDate < firstOfMonth ? "prev" : "next";
        selectedDate = iso;
        withEnterAnimation(() => {
          renderCalendar();
          renderDayPanel();
        });
        return;
      }

      selectedDate = iso;
      $$(".calendar-day.is-selected", grid).forEach((day) => {
        day.classList.remove("is-selected");
        day.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-selected");
      button.setAttribute("aria-pressed", "true");
      withEnterAnimation(renderDayPanel);
    });

    grid.append(button);
  }

  staggerItems(grid, ".calendar-day", { step: 13, maxIndex: 16 });
}

function renderDayPanel() {
  const eyebrow = $("#day-eyebrow");
  const title = $("#day-title");
  const list = $("#day-list");
  list.replaceChildren();

  if (!selectedDate) {
    eyebrow.textContent = "Resumen del mes";
    title.textContent = formatMonthTitle(calendarYear, calendarMonth);

    const monthRecords = records.filter((record) =>
      record.fecha.startsWith(monthKey(calendarYear, calendarMonth))
    );

    const summary = el("div", "day-summary");
    if (monthRecords.length) {
      summary.append(document.createTextNode("En este mes tienes "));
      summary.append(
        el(
          "strong",
          "",
          monthRecords.length + (monthRecords.length === 1 ? " recuerdo" : " recuerdos")
        )
      );
      summary.append(document.createTextNode(". Selecciona un día para ver el detalle."));
    } else {
      summary.textContent =
        "No hay recuerdos guardados este mes. Selecciona un día para añadir uno.";
    }
    list.append(summary);
    staggerItems(list, ".day-summary", { step: 0 });
    $("#day-add").setAttribute("aria-label", "Añadir un recuerdo");
    return;
  }

  eyebrow.textContent = "Día seleccionado";
  title.textContent = formatLongDate(selectedDate);
  $("#day-add").setAttribute(
    "aria-label",
    "Añadir un recuerdo el " + formatLongDate(selectedDate)
  );

  const dayRecords = sortRecords(records.filter((record) => record.fecha === selectedDate));

  if (!dayRecords.length) {
    const empty = el("div", "day-empty");
    empty.append(el("strong", "", "Sin recuerdos este día"));
    empty.append(el("span", "", "Toca el botón + para añadir una actividad con esta fecha."));
    const addButton = el("button", "btn btn--ghost btn--sm", "Añadir recuerdo");
    addButton.type = "button";
    addButton.addEventListener("click", () => openRecordForm({ date: selectedDate }));
    empty.append(addButton);
    list.append(empty);
    staggerItems(list, ".day-empty", { step: 0 });
    return;
  }

  dayRecords.forEach((record) => {
    const sport = DEPORTES[record.deporte] || DEPORTES.otro;
    const item = el("button", "day-item");
    item.type = "button";
    item.setAttribute("aria-label", "Abrir recuerdo: " + record.titulo);

    let thumb;
    if (record.fotos.length) {
      thumb = document.createElement("img");
      thumb.className = "day-item__thumb";
      thumb.src = record.fotos[0];
      thumb.alt = "";
      thumb.loading = "lazy";
      thumb.addEventListener("error", () => {
        const replacement = el("span", "day-item__thumb is-placeholder");
        replacement.append(icon(sport.icon, "icon"));
        thumb.replaceWith(replacement);
      });
    } else {
      thumb = el("span", "day-item__thumb is-placeholder");
      thumb.append(icon(sport.icon, "icon"));
    }

    const info = el("span", "day-item__info");
    info.append(el("span", "day-item__sport", sport.label));
    info.append(el("span", "day-item__title", record.titulo));
    const meta = recordMetaText(record);
    if (meta) info.append(el("span", "day-item__meta", meta));

    item.append(thumb, info, icon("chevronRight", "day-item__chev"));
    item.addEventListener("click", () => openDetail(record.id));
    list.append(item);
  });

  staggerItems(list, ".day-item", { step: 60, maxIndex: 6 });
}

function changeMonth(delta) {
  const target = new Date(calendarYear, calendarMonth + delta, 1);
  calendarYear = target.getFullYear();
  calendarMonth = target.getMonth();
  selectedDate = null;
  calendarEnterDirection = delta > 0 ? "next" : "prev";
  withEnterAnimation(() => {
    renderCalendar();
    renderDayPanel();
  });
}

function goToToday() {
  const today = new Date();
  const forward =
    today.getFullYear() > calendarYear ||
    (today.getFullYear() === calendarYear && today.getMonth() >= calendarMonth);

  calendarYear = today.getFullYear();
  calendarMonth = today.getMonth();
  selectedDate = todayISO();
  calendarEnterDirection = forward ? "next" : "prev";
  withEnterAnimation(() => {
    renderCalendar();
    renderDayPanel();
  });
}

/* ---------- 14. Galería y filtros ---------- */
function buildSportFilters() {
  const wrap = $("#sport-filters");
  wrap.replaceChildren();

  const options = [{ key: "all", label: "Todos" }].concat(
    Object.keys(DEPORTES).map((key) => ({ key, label: DEPORTES[key].label }))
  );

  options.forEach((option) => {
    const button = el("button", "filter-chip");
    button.type = "button";
    button.dataset.sport = option.key;
    button.setAttribute("aria-pressed", option.key === activeSport ? "true" : "false");
    button.append(
      el("span", "filter-chip__label", option.label),
      el("span", "filter-chip__count", "0")
    );
    wrap.append(button);
  });
}

function updateSportFilters() {
  $$("#sport-filters [data-sport]").forEach((button) => {
    const key = button.dataset.sport;
    const isActive = key === activeSport;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");

    const count = key === "all"
      ? records.length
      : records.filter((record) => record.deporte === key).length;
    const countNode = button.querySelector(".filter-chip__count");
    if (countNode) countNode.textContent = String(count);
  });
}

function renderGallery() {
  const grid = $("#gallery-grid");
  const empty = $("#gallery-empty");
  const emptyTitle = $("#gallery-empty-title");
  const emptyText = $("#gallery-empty-text");
  const emptyAction = $("#clear-filters");
  const query = normalizeText($("#search-input").value.trim());

  updateSportFilters();

  const filtered = sortRecords(records).filter((record) => {
    const matchesSport = activeSport === "all" || record.deporte === activeSport;
    const matchesQuery =
      !query ||
      normalizeText(record.titulo).includes(query) ||
      normalizeText(record.descripcion).includes(query);
    return matchesSport && matchesQuery;
  });

  grid.replaceChildren();
  filtered.forEach((record) => grid.append(createRecordCard(record, "gallery")));
  staggerItems(grid, ".record-card", { step: 42, maxIndex: 9 });

  const noRecords = records.length === 0;
  grid.hidden = filtered.length === 0;
  empty.hidden = filtered.length > 0;

  if (filtered.length === 0) {
    if (noRecords) {
      emptyTitle.textContent = "Tu galería está esperando su primera foto";
      emptyText.textContent =
        "Cuando guardes tu primera ruta, entreno o escapada, aparecerá aquí junto a sus fotografías.";
      emptyAction.textContent = "Añadir mi primer recuerdo";
    } else {
      emptyTitle.textContent = "No encontramos recuerdos";
      emptyText.textContent = "Prueba con otro deporte o cambia el texto de búsqueda.";
      emptyAction.textContent = "Limpiar filtros";
    }
  }

  const total = records.length;
  const shown = filtered.length;
  const countLabel = $("#gallery-count");
  if (total === 0) {
    countLabel.textContent = "0 recuerdos guardados";
  } else if (shown === total) {
    countLabel.textContent = total + (total === 1 ? " recuerdo guardado" : " recuerdos guardados");
  } else {
    countLabel.textContent = "Mostrando " + shown + " de " + total + " recuerdos";
  }
}

function renderAll() {
  renderHome();
  renderCalendar();
  renderDayPanel();
  renderGallery();
}

/* ---------- 15. Detalle del recuerdo ---------- */
function openDetail(id) {
  const record = records.find((item) => item.id === id);
  if (!record) {
    showToast("Ese recuerdo ya no existe.", "error");
    return;
  }

  detailId = id;
  detailPhotoIndex = 0;
  renderDetail(record);
  openDialog($("#detail-dialog"));
  window.setTimeout(() => $("#detail-title").focus(), 80);
}

function renderDetail(record) {
  const sport = DEPORTES[record.deporte] || DEPORTES.otro;
  const media = $("#detail-media");
  const meta = $("#detail-meta");
  const stats = $("#detail-stats");
  const notes = $("#detail-notes");
  const description = $("#detail-description");

  media.replaceChildren();
  meta.replaceChildren();
  stats.replaceChildren();

  /* Fotografías */
  if (record.fotos.length) {
    const mainButton = el("button", "detail__main-btn");
    mainButton.type = "button";
    mainButton.setAttribute("aria-label", "Ampliar fotografía de " + record.titulo);

    const mainImage = document.createElement("img");
    mainImage.className = "detail__main-img";
    mainImage.src = record.fotos[0];
    mainImage.alt = "Fotografía de " + record.titulo;
    mainButton.append(mainImage);
    mainButton.addEventListener("click", () => openLightbox(record.id, detailPhotoIndex));
    media.append(mainButton);

    if (record.fotos.length > 1) {
      const thumbs = el("div", "detail__thumbs");
      record.fotos.forEach((photo, index) => {
        const thumb = el("button", "detail__thumb" + (index === 0 ? " is-active" : ""));
        thumb.type = "button";
        thumb.setAttribute("aria-label", "Ver foto " + (index + 1) + " de " + record.fotos.length);
        thumb.setAttribute("aria-pressed", index === 0 ? "true" : "false");

        const thumbImage = document.createElement("img");
        thumbImage.src = photo;
        thumbImage.alt = "";
        thumbImage.loading = "lazy";
        thumb.append(thumbImage);

        thumb.addEventListener("click", () => {
          detailPhotoIndex = index;
          mainImage.src = photo;
          $$(".detail__thumb", media).forEach((node, nodeIndex) => {
            const active = nodeIndex === index;
            node.classList.toggle("is-active", active);
            node.setAttribute("aria-pressed", active ? "true" : "false");
          });
        });

        thumbs.append(thumb);
      });
      media.append(thumbs);
    }
  } else {
    const placeholder = el("div", "detail__placeholder placeholder-art");
    placeholder.append(icon(sport.icon, "icon icon--xl"));
    media.append(placeholder);
  }

  /* Cabecera del detalle */
  const sportChip = el("span", "chip chip--" + record.deporte);
  sportChip.append(icon(sport.icon, "icon icon--xs"), el("span", "", sport.label));

  const dateChip = el("span", "detail__date-chip");
  dateChip.append(icon("calendar"), el("span", "", formatShortDate(record.fecha)));

  meta.append(sportChip, dateChip);

  $("#detail-title").textContent = record.titulo;
  $("#detail-date").textContent = formatLongDate(record.fecha);

  description.textContent = record.descripcion || "";
  description.hidden = !record.descripcion;

  /* Datos principales */
  const statDefinitions = [];
  if (record.distancia !== null && record.distancia !== undefined) {
    statDefinitions.push({
      label: "Distancia",
      value: formatNumber(record.distancia) + " km",
      icon: "route",
    });
  }
  if (record.duracion) {
    statDefinitions.push({
      label: "Duración",
      value: record.duracion,
      icon: "clock",
    });
  }
  if (record.desnivel !== null && record.desnivel !== undefined) {
    statDefinitions.push({
      label: "Desnivel +",
      value: formatNumber(record.desnivel) + " m",
      icon: "mountain",
    });
  }

  stats.hidden = statDefinitions.length === 0;
  statDefinitions.forEach((definition) => {
    const stat = el("div", "detail__stat");
    const term = el("dt");
    term.append(icon(definition.icon), el("span", "", definition.label));
    stat.append(term, el("dd", "", definition.value));
    stats.append(stat);
  });

  /* Notas */
  if (record.notas) {
    notes.hidden = false;
    notes.textContent = record.notas;
  } else {
    notes.hidden = true;
    notes.textContent = "";
  }
}

/* ---------- 16. Visor de fotografías ---------- */
function openLightbox(recordId, index) {
  const record = records.find((item) => item.id === recordId);
  if (!record || !record.fotos.length) return;

  lightboxPhotos = record.fotos.slice();
  lightboxIndex = Math.max(0, Math.min(index, lightboxPhotos.length - 1));
  updateLightbox();
  openDialog($("#lightbox"));
}

function updateLightbox() {
  if (!lightboxPhotos.length) return;

  const image = $("#lightbox-img");
  image.src = lightboxPhotos[lightboxIndex];
  image.alt = "Fotografía ampliada " + (lightboxIndex + 1) + " de " + lightboxPhotos.length;

  $("#lightbox-counter").textContent = lightboxIndex + 1 + " / " + lightboxPhotos.length;

  const multiple = lightboxPhotos.length > 1;
  $("#lightbox-prev").hidden = !multiple;
  $("#lightbox-next").hidden = !multiple;
}

function stepLightbox(delta) {
  if (lightboxPhotos.length < 2) return;
  lightboxIndex = (lightboxIndex + delta + lightboxPhotos.length) % lightboxPhotos.length;
  updateLightbox();
}

/* ---------- 17. Eliminar recuerdo ---------- */
async function deleteRecord(id) {
  const record = records.find((item) => item.id === id);
  if (!record) return;

  const confirmed = await askConfirmation({
    title: "¿Eliminar este recuerdo?",
    message:
      "«" + record.titulo + "» y sus fotografías se borrarán de este navegador. Esta acción no se puede deshacer.",
    confirmLabel: "Sí, eliminar",
  });

  if (!confirmed) return;

  const next = records.filter((item) => item.id !== id);
  try {
    writeRecords(next);
  } catch (error) {
    console.error("Error al eliminar:", error);
    showToast(storageErrorMessage(error), "error", 6500);
    return;
  }

  records = next;
  detailId = null;
  closeDialog($("#detail-dialog"));
  withEnterAnimation(renderAll);
  showToast("Recuerdo eliminado.", "success");
}

/* ---------- 18. Formulario: deportes, errores y fotos ---------- */
function buildSportOptions() {
  const wrap = $("#sport-options");
  wrap.replaceChildren();

  Object.keys(DEPORTES).forEach((key) => {
    const sport = DEPORTES[key];
    const label = el("label", "sport-option");

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "deporte";
    input.value = key;

    const box = el("span", "sport-option__box");
    box.append(icon(sport.icon), el("span", "", sport.label));

    label.append(input, box);
    wrap.append(label);
  });
}

function setFieldError(fieldElement, errorElement, message) {
  if (!fieldElement || !errorElement) return;
  if (message) {
    fieldElement.classList.add("has-error");
    errorElement.textContent = message;
    errorElement.hidden = false;
  } else {
    fieldElement.classList.remove("has-error");
    errorElement.textContent = "";
    errorElement.hidden = true;
  }
}

function clearFormErrors() {
  $$("#record-form .field").forEach((field) => field.classList.remove("has-error"));
  $$("#record-form .field__error").forEach((error) => {
    error.hidden = true;
    error.textContent = "";
  });
}

function updatePhotoCounter() {
  $("#photo-counter").textContent = draftPhotos.length + " de " + MAX_PHOTOS + " fotos";
  $("#photo-pick").disabled = draftPhotos.length >= MAX_PHOTOS;
}

function renderPhotoPreviews() {
  const wrap = $("#photo-previews");
  wrap.replaceChildren();

  draftPhotos.forEach((photo) => {
    const figure = el("figure", "photo-preview");

    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = "Vista previa de la fotografía";
    image.addEventListener("error", () => {
      image.remove();
      figure.append(el("span", "photo-preview__error", "Imagen no disponible"));
    });

    const remove = el("button", "photo-preview__remove");
    remove.type = "button";
    remove.setAttribute("aria-label", "Quitar esta fotografía");
    remove.append(icon("close"));
    remove.addEventListener("click", () => {
      draftPhotos = draftPhotos.filter((item) => item.id !== photo.id);
      renderPhotoPreviews();
    });

    figure.append(image, remove);
    wrap.append(figure);
  });

  updatePhotoCounter();
}

async function handlePhotoFiles(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return;

  if (draftPhotos.length >= MAX_PHOTOS) {
    showToast("Ya has añadido el máximo de " + MAX_PHOTOS + " fotografías.", "info");
    return;
  }

  const images = files.filter((file) => file.type && file.type.startsWith("image/"));
  const ignored = files.length - images.length;
  if (ignored > 0) {
    showToast("Se han ignorado " + ignored + " archivo(s) que no son imágenes.", "info");
  }
  if (!images.length) return;

  const freeSlots = MAX_PHOTOS - draftPhotos.length;
  const accepted = images.slice(0, freeSlots);
  if (images.length > freeSlots) {
    showToast("Solo caben " + MAX_PHOTOS + " fotografías por recuerdo.", "info");
  }

  const status = $("#photo-status");
  const saveButton = $("#save-record");
  processingPhotos = true;
  saveButton.disabled = true;

  for (let index = 0; index < accepted.length; index += 1) {
    const file = accepted[index];
    status.textContent = "Optimizando " + (index + 1) + " de " + accepted.length + "…";
    try {
      const source = await compressImageFile(file);
      draftPhotos.push({ id: uid(), src: source });
      renderPhotoPreviews();
    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      showToast("No pudimos procesar «" + file.name + "»: " + error.message, "error", 6000);
    }
  }

  processingPhotos = false;
  saveButton.disabled = false;
  status.textContent = accepted.length ? "Fotografías listas." : "";
  updatePhotoCounter();

  window.setTimeout(() => {
    if (status.textContent === "Fotografías listas.") status.textContent = "";
  }, 2500);
}

/* ---------- 19. Abrir y rellenar el formulario ---------- */
function openRecordForm(options) {
  const settings = options || {};
  const record = settings.record || null;

  editingId = record ? record.id : null;
  draftPhotos = record ? record.fotos.map((src) => ({ id: uid(), src })) : [];
  processingPhotos = false;

  const form = $("#record-form");
  form.reset();
  clearFormErrors();
  $("#photo-status").textContent = "";

  const titleInput = $("#record-title");
  const dateInput = $("#record-date");

  if (record) {
    titleInput.value = record.titulo;

    const radio = form.querySelector('input[name="deporte"][value="' + record.deporte + '"]');
    if (radio) radio.checked = true;

    dateInput.value = record.fecha;
    $("#record-distance").value = record.distancia !== null && record.distancia !== undefined
      ? String(record.distancia)
      : "";
    $("#record-duration").value = record.duracion || "";
    $("#record-elevation").value = record.desnivel !== null && record.desnivel !== undefined
      ? String(record.desnivel)
      : "";
    $("#record-description").value = record.descripcion || "";
    $("#record-notes").value = record.notas || "";
  } else {
    dateInput.value = settings.date && isValidISODate(settings.date)
      ? settings.date
      : todayISO();
  }

  $("#record-dialog-eyebrow").textContent = record ? "Editar actividad" : "Nueva actividad";
  $("#record-dialog-title").textContent = record ? "Editar recuerdo" : "Añadir recuerdo";
  $("#save-record").textContent = record ? "Guardar cambios" : "Guardar recuerdo";

  renderPhotoPreviews();
  openDialog($("#record-dialog"));
  window.setTimeout(() => titleInput.focus(), 80);
}

/* ---------- 20. Validación y guardado del formulario ---------- */
function readOptionalNumber(input) {
  const raw = input.value.trim();
  if (!raw) return { value: null, error: "" };
  const parsed = Number(raw.replace(",", "."));
  if (!Number.isFinite(parsed) || parsed < 0) {
    return { value: null, error: "Introduce un número válido (igual o mayor que 0)." };
  }
  return { value: Math.round(parsed * 10) / 10, error: "" };
}

function collectFormData() {
  const form = $("#record-form");
  let firstInvalid = null;

  const titleInput = $("#record-title");
  const title = clampText(titleInput.value, 100);
  setFieldError(
    titleInput.closest(".field"),
    $("#error-title"),
    title ? "" : "Escribe un título para la actividad."
  );
  if (!title) firstInvalid = firstInvalid || titleInput;

  const sportInput = form.querySelector('input[name="deporte"]:checked');
  setFieldError(
    $("#sport-options").closest(".field"),
    $("#error-sport"),
    sportInput ? "" : "Elige el tipo de deporte."
  );
  if (!sportInput) {
    firstInvalid = firstInvalid || form.querySelector('input[name="deporte"]');
  }

  const dateInput = $("#record-date");
  const dateValid = isValidISODate(dateInput.value);
  setFieldError(
    dateInput.closest(".field"),
    $("#error-date"),
    dateValid ? "" : "Selecciona una fecha válida."
  );
  if (!dateValid) firstInvalid = firstInvalid || dateInput;

  const distance = readOptionalNumber($("#record-distance"));
  setFieldError($("#record-distance").closest(".field"), $("#error-distance"), distance.error);
  if (distance.error) firstInvalid = firstInvalid || $("#record-distance");

  const elevation = readOptionalNumber($("#record-elevation"));
  setFieldError($("#record-elevation").closest(".field"), $("#error-elevation"), elevation.error);
  if (elevation.error) firstInvalid = firstInvalid || $("#record-elevation");

  const duration = clampText($("#record-duration").value, 30);
  setFieldError($("#record-duration").closest(".field"), $("#error-duration"), "");

  if (firstInvalid) {
    firstInvalid.focus();
    return null;
  }

  return {
    titulo: title,
    deporte: sportInput.value,
    fecha: dateInput.value,
    descripcion: clampText($("#record-description").value, 1200),
    distancia: distance.value,
    duracion: duration,
    desnivel: elevation.value,
    notas: clampText($("#record-notes").value, 1200),
  };
}

async function handleFormSubmit(event) {
  event.preventDefault();

  if (processingPhotos) {
    showToast("Espera un momento: estamos optimizando las fotografías.", "info");
    return;
  }

  const data = collectFormData();
  if (!data) {
    showToast("Revisa los campos marcados antes de guardar.", "error");
    return;
  }

  const existing = editingId ? records.find((item) => item.id === editingId) : null;

  const record = {
    id: existing ? existing.id : uid(),
    titulo: data.titulo,
    deporte: data.deporte,
    fecha: data.fecha,
    descripcion: data.descripcion,
    distancia: data.distancia,
    duracion: data.duracion,
    desnivel: data.desnivel,
    notas: data.notas,
    fotos: draftPhotos.map((photo) => photo.src),
    creado: existing ? existing.creado : Date.now(),
  };

  const next = existing
    ? records.map((item) => (item.id === record.id ? record : item))
    : [record].concat(records);

  const saveButton = $("#save-record");
  const originalLabel = saveButton.textContent;
  saveButton.disabled = true;
  saveButton.textContent = "Guardando…";

  let result;
  try {
    result = await persistWithFallback(next, record.id);
  } catch (error) {
    result = { ok: false, error };
  }

  saveButton.disabled = false;
  saveButton.textContent = originalLabel;

  if (!result.ok) {
    console.error("Error al guardar el recuerdo:", result.error);
    showToast(storageErrorMessage(result.error), "error", 7000);
    if (!storageOK) $("#storage-banner").hidden = false;
    return;
  }

  records = result.records;
  const wasEditing = Boolean(existing);
  editingId = null;
  draftPhotos = [];

  closeDialog($("#record-dialog"));
  withEnterAnimation(renderAll);

  if (result.optimized) {
    showToast(
      (wasEditing ? "Recuerdo actualizado. " : "Recuerdo guardado. ") +
        "Hemos reducido las fotos para que cupieran en el navegador.",
      "info",
      7000
    );
  } else {
    showToast(wasEditing ? "Recuerdo actualizado." : "¡Recuerdo guardado!", "success");
  }
}

/* ---------- 21. Navegación entre secciones ---------- */
const SECTIONS = ["inicio", "calendario", "recuerdos"];

function showSection(name, options) {
  const settings = options || {};
  const target = SECTIONS.indexOf(name) !== -1 ? name : "inicio";
  const previousIndex = SECTIONS.indexOf(currentSection);
  const targetIndex = SECTIONS.indexOf(target);
  const changed = target !== currentSection;
  const direction = targetIndex >= previousIndex ? "forward" : "back";
  currentSection = target;

  // Solo se muestra la sección pedida; el resto se oculta de inmediato.
  const incoming = $('.view[data-view="' + target + '"]');
  $$(".view").forEach((view) => {
    if (view === incoming) return;
    if (!view.hidden) view.hidden = true;
    view.classList.remove("is-entering");
  });

  if (incoming) {
    incoming.hidden = false;
    incoming.dataset.dir = direction;
    replayEnter(incoming);
  }

  $$("[data-nav]").forEach((link) => {
    const isActive = link.dataset.nav === target;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  // Detalles visuales ligados al cambio de sección.
  document.body.dataset.section = target;
  positionNavIndicator();
  updateMobileNavIndicator(target);

  if (settings.replay !== true) {
    withEnterAnimation(() => refreshSectionContent(target));
  }

  if (changed || settings.intro === true) {
    playPageWipe(direction);
  }

  if (settings.scroll !== false) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function handleHashChange() {
  const hash = window.location.hash.replace("#", "");
  showSection(hash || "inicio");
}

/* ---------- 22b. Información legal (creador, privacidad y derechos) ---------- */
const LEGAL_TABS = ["privacidad", "derechos", "contacto"];
function showLegalTab(name) {
  const target = LEGAL_TABS.indexOf(name) !== -1 ? name : "privacidad";

  $$("[data-legal-tab]").forEach((tab) => {
    const isActive = tab.dataset.legalTab === target;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
    tab.setAttribute("tabindex", isActive ? "0" : "-1");
  });

  LEGAL_TABS.forEach((key) => {
    const panel = $("#panel-" + key);
    if (panel) panel.hidden = key !== target;
  });
}

function bindLegal() {
  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-open-legal]");
    if (opener) {
      showLegalTab(opener.dataset.openLegal);
      openDialog($("#legal-dialog"));
      return;
    }

    const tab = event.target.closest("[data-legal-tab]");
    if (tab) showLegalTab(tab.dataset.legalTab);
  });

  const tabs = $(".legal__tabs");
  if (!tabs) return;

  tabs.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();

    const activeTab = tabs.querySelector("[data-legal-tab].is-active");
    const currentIndex = activeTab ? LEGAL_TABS.indexOf(activeTab.dataset.legalTab) : 0;
    const delta = event.key === "ArrowRight" ? 1 : LEGAL_TABS.length - 1;
    const nextName = LEGAL_TABS[(currentIndex + delta) % LEGAL_TABS.length];

    showLegalTab(nextName);
    const nextTab = tabs.querySelector('[data-legal-tab="' + nextName + '"]');
    if (nextTab) nextTab.focus();
  });
}

function setFooterYear() {
  const yearNode = $("#footer-year");
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
}

/* ---------- 22d. Tutorial de instalación como app (iOS y Android) ---------- */
const INSTALL_TABS = ["ios", "android"];

function showInstallTab(name) {
  const target = INSTALL_TABS.indexOf(name) !== -1 ? name : "ios";

  $$("[data-install-tab]").forEach((tab) => {
    const isActive = tab.dataset.installTab === target;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
    tab.setAttribute("tabindex", isActive ? "0" : "-1");
  });

  INSTALL_TABS.forEach((key) => {
    const panel = $("#panel-inst-" + key);
    if (panel) panel.hidden = key !== target;
  });
}

function bindInstall() {
  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-open-install]");
    if (opener) {
      showInstallTab(opener.dataset.openInstall || "ios");
      openDialog($("#install-dialog"));
      return;
    }

    const tab = event.target.closest("[data-install-tab]");
    if (tab) showInstallTab(tab.dataset.installTab);
  });

  const tabs = $(".install-tabs");
  if (!tabs) return;

  tabs.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();

    const activeTab = tabs.querySelector("[data-install-tab].is-active");
    const currentIndex = activeTab ? INSTALL_TABS.indexOf(activeTab.dataset.installTab) : 0;
    const delta = event.key === "ArrowRight" ? 1 : INSTALL_TABS.length - 1;
    const nextName = INSTALL_TABS[(currentIndex + delta) % INSTALL_TABS.length];

    showInstallTab(nextName);
    const nextTab = tabs.querySelector('[data-install-tab="' + nextName + '"]');
    if (nextTab) nextTab.focus();
  });
}

/* ---------- 23. Perfil local (identidad + bloqueo opcional) ---------- */
const PROFILE_KEY = "sportsMemories.profile.v1";
const PROFILE_UNLOCK_KEY = "sportsMemories.profile.unlocked";
let profile = null;

function profileUnlocked() {
  try {
    return window.sessionStorage.getItem(PROFILE_UNLOCK_KEY) === "1";
  } catch (error) {
    return false;
  }
}

function loadProfile() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PROFILE_KEY) || "null");
    if (!parsed || typeof parsed !== "object" || typeof parsed.nombre !== "string") return null;
    return {
      nombre: clampText(parsed.nombre, 60),
      pinHash: typeof parsed.pinHash === "string" && parsed.pinHash ? parsed.pinHash : null,
      creado: Number.isFinite(parsed.creado) ? parsed.creado : Date.now(),
    };
  } catch (error) {
    return null;
  }
}

function saveProfileToStorage() {
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    showToast(storageErrorMessage(error), "error", 6000);
  }
}

/* Huella del código: SHA-256 cuando está disponible; fallback simple si no.
   Nota: es un disuasorio local, no una seguridad de servidor. */
async function hashPin(pin) {
  try {
    if (window.crypto && window.crypto.subtle && typeof window.TextEncoder === "function") {
      const data = new TextEncoder().encode("sportsMemories::" + pin);
      const digest = await window.crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    }
  } catch (error) {
    // continúa con el fallback
  }
  let hash = 5381;
  const source = "sportsMemories::" + pin;
  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash << 5) + hash + source.charCodeAt(index)) >>> 0;
  }
  return "simple:" + hash.toString(16);
}

function isValidPinDraft(value) {
  return /^\d{4,6}$/.test(value);
}

function refreshProfileUI() {
  const hero = $("#hero-profile");
  if (hero) {
    hero.hidden = !profile;
    const nameNode = $("#hero-profile-name");
    if (nameNode) nameNode.textContent = profile ? profile.nombre : "";
  }
}

function openProfileDialog() {
  const form = $("#profile-form");
  form.reset();
  clearProfileFormErrors();
  $("#profile-pin-fields").hidden = true;
  $("#profile-pin").checked = profile ? Boolean(profile.pinHash) : false;

  const intro = $("#profile-intro");
  const title = $("#profile-dialog-title");
  const saveButton = $("#profile-save");
  const deleteButton = $("#profile-delete");
  const lockButton = $("#profile-lock-now");
  const meta = $("#profile-meta");

  if (profile) {
    title.textContent = "Mi perfil local";
    intro.textContent =
      "Este es tu perfil en este dispositivo. Puedes cambiar el nombre, ajustar el código o eliminar el perfil.";
    $("#profile-name").value = profile.nombre;
    saveButton.textContent = "Guardar cambios";
    deleteButton.hidden = false;
    lockButton.hidden = !profile.pinHash;

    meta.hidden = false;
    $("#profile-meta-name").textContent = profile.nombre;
    $("#profile-meta-details").textContent =
      "Creado el " + formatLongDate(dateToISO(new Date(profile.creado))) +
      " · Bloqueo con código: " + (profile.pinHash ? "activo" : "sin código");
  } else {
    title.textContent = "Crea tu perfil local";
    intro.textContent =
      "Crea tu identidad en esta app: un nombre para tu diario y, si quieres, un código para " +
      "bloquear su apertura en este dispositivo. Todo se queda en este navegador.";
    saveButton.textContent = "Crear perfil";
    deleteButton.hidden = true;
    lockButton.hidden = true;
    meta.hidden = true;
  }

  openDialog($("#profile-dialog"));
  window.setTimeout(() => $("#profile-name").focus(), 80);
}

function clearProfileFormErrors() {
  $("#err-profile-name").hidden = true;
  $("#err-profile-name").textContent = "";
  $("#err-profile-pin").hidden = true;
  $("#err-profile-pin").textContent = "";
  $("#err-lock-pin").hidden = true;
  $("#err-lock-pin").textContent = "";
}

function setProfileError(node, message) {
  node.hidden = !message;
  node.textContent = message || "";
}

async function handleProfileSubmit(event) {
  event.preventDefault();

  const name = clampText($("#profile-name").value, 60);
  if (name.length < 2) {
    setProfileError($("#err-profile-name"), "Escribe un nombre (al menos 2 letras).");
    $("#profile-name").focus();
    return;
  }

  const pinWanted = $("#profile-pin").checked;
  const pinInput = $("#profile-pin-input").value.trim();
  const pinRepeat = $("#profile-pin-repeat").value.trim();
  const pinError = $("#err-profile-pin");

  let nextPinHash = profile ? profile.pinHash : null;

  if (pinWanted) {
    const fieldsFilled = pinInput !== "" || pinRepeat !== "";
    if (fieldsFilled) {
      if (!isValidPinDraft(pinInput)) {
        setProfileError(pinError, "El código debe tener entre 4 y 6 números.");
        $("#profile-pin-input").focus();
        return;
      }
      if (pinInput !== pinRepeat) {
        setProfileError(pinError, "Los dos códigos no coinciden.");
        $("#profile-pin-repeat").focus();
        return;
      }
      nextPinHash = await hashPin(pinInput);
    } else if (!profile || !profile.pinHash) {
      setProfileError(pinError, "Escribe el código o desmarca la casilla.");
      $("#profile-pin-input").focus();
      return;
    }
    /* Con la casilla marcada y campos vacíos sobre un perfil que ya tenía
       código, se conserva el código actual (no se toca). */
  } else {
    nextPinHash = null;
  }

  const wasNew = !profile;
  profile = {
    nombre: name,
    pinHash: nextPinHash,
    creado: profile ? profile.creado : Date.now(),
  };
  saveProfileToStorage();
  setProfileError(pinError, "");
  setProfileError($("#err-profile-name"), "");
  closeDialog($("#profile-dialog"));
  refreshProfileUI();

  if (!nextPinHash) {
    try { window.sessionStorage.removeItem(PROFILE_UNLOCK_KEY); } catch (error) { /* sin sesión */ }
  } else {
    try { window.sessionStorage.setItem(PROFILE_UNLOCK_KEY, "1"); } catch (error) { /* sin sesión */ }
  }

  showToast(
    wasNew
      ? "Perfil " + (profile.pinHash ? "creado con bloqueo" : "creado") + ". ¡Tu diario ya tiene nombre!"
      : "Perfil actualizado.",
    "success"
  );
}

function handleProfileDelete() {
  if (!profile) return;
  askConfirmation({
    title: "¿Eliminar tu perfil?",
    message:
      "Se borra el nombre y el código de este dispositivo, pero tus recuerdos y fotos NO se tocan. Esta acción no se puede deshacer.",
    confirmLabel: "Sí, eliminar perfil",
  }).then((confirmed) => {
    if (!confirmed) return;
    profile = null;
    try {
      window.localStorage.removeItem(PROFILE_KEY);
      window.sessionStorage.removeItem(PROFILE_UNLOCK_KEY);
    } catch (error) {
      // seguimos igualmente
    }
    clearProfileFormErrors();
    closeDialog($("#profile-dialog"));
    refreshProfileUI();
    showToast("Perfil eliminado. Tus recuerdos siguen en este navegador.", "success");
  });
}

function bindProfile() {
  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-open-profile]");
    if (opener) {
      openProfileDialog();
      return;
    }
  });

  $("#profile-form").addEventListener("submit", handleProfileSubmit);
  $("#profile-delete").addEventListener("click", handleProfileDelete);
  $("#profile-pin").addEventListener("change", () => {
    $("#profile-pin-fields").hidden = !$("#profile-pin").checked;
    if (!$("#profile-pin").checked) setProfileError($("#err-profile-pin"), "");
  });
  $("#profile-lock-now").addEventListener("click", () => {
    if (!profile || !profile.pinHash) return;
    closeDialog($("#profile-dialog"));
    try { window.sessionStorage.removeItem(PROFILE_UNLOCK_KEY); } catch (error) { /* sin sesión */ }
    openLockDialog();
  });

  $("#lock-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const pinInput = $("#lock-pin");
    const errorNode = $("#err-lock-pin");
    const value = pinInput.value.trim();

    if (!isValidPinDraft(value)) {
      setProfileError(errorNode, "El código debe tener entre 4 y 6 números.");
      return;
    }

    const hash = await hashPin(value);
    if (profile && hash === profile.pinHash) {
      setProfileError(errorNode, "");
      try { window.sessionStorage.setItem(PROFILE_UNLOCK_KEY, "1"); } catch (error) { /* sin sesión */ }
      closeDialog($("#lock-dialog"));
      showToast("Perfil desbloqueado. Bienvenido de nuevo, " + profile.nombre + ".", "success");
    } else {
      setProfileError(errorNode, "El código no es correcto. Inténtalo de nuevo.");
      pinInput.select();
    }
  });

  $("#lock-forgot").addEventListener("click", () => {
    askConfirmation({
      title: "¿Quitar el bloqueo del perfil?",
      message:
        "Si no recuerdas el código, puedes quitarlo y entrar de normal. Los recuerdos no se pierden, pero el bloqueo desaparece hasta que lo vuelvas a configurar.",
      confirmLabel: "Quitar el bloqueo",
    }).then((confirmed) => {
      if (!confirmed) return;
      if (profile) {
        profile = Object.assign({}, profile, { pinHash: null });
        saveProfileToStorage();
      }
      try { window.sessionStorage.removeItem(PROFILE_UNLOCK_KEY); } catch (error) { /* sin sesión */ }
      closeDialog($("#lock-dialog"));
      showToast("Bloqueo retirado. Puedes crear un nuevo código en Mi perfil.", "info");
    });
  });
}

function openLockDialog() {
  if (!profile || !profile.pinHash) return;
  $("#lock-name").textContent = profile.nombre;
  openDialog($("#lock-dialog"));
  window.setTimeout(() => {
    const pinInput = $("#lock-pin");
    pinInput.value = "";
    pinInput.focus();
  }, 80);
}

/* ---------- 23b. Bienvenida (solo la primera visita) ---------- */
const WELCOME_KEY = "sportsMemories.welcome.v1";

function welcomeSeen() {
  try {
    return window.localStorage.getItem(WELCOME_KEY) === "1";
  } catch (error) {
    return false;
  }
}

function markWelcomeSeen() {
  try {
    window.localStorage.setItem(WELCOME_KEY, "1");
  } catch (error) {
    /* si falla, la bienvenida volverá a salir; sin mayor daño */
  }
}

function maybeShowWelcome() {
  if (welcomeSeen() || profile) return;
  const dialog = $("#welcome-dialog");
  if (!dialog) return;
  openDialog(dialog);
}

function bindWelcome() {
  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-welcome-action]");
    if (!action || !$("#welcome-dialog").open) return;

    // Al tocar cualquier opción se considera vista (no depende del evento close).
    markWelcomeSeen();

    const type = action.dataset.welcomeAction;
    if (type === "profile") {
      closeDialog($("#welcome-dialog")); // al cerrar queda marcada como vista
      openProfileDialog();
    } else if (type === "install") {
      // se abre encima de la bienvenida; al cerrarla, esta sigue visible
      openDialog($("#install-dialog"));
    } else {
      closeDialog($("#welcome-dialog"));
    }
  });

  // Red de seguridad: cualquier cierre (ESC, fondo) también la cuenta como vista.
  $("#welcome-dialog").addEventListener("close", markWelcomeSeen);
}

/* ---------- 22c. Animaciones, transiciones y efectos visuales ---------- */
const ENTER_STAGGER = 55;
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const numberFrames = new WeakMap();
let animateRenders = false;
let pageWipeTimer = null;

function prefersReducedMotion() {
  return motionQuery.matches;
}

// Activa la animación de entrada solo para las listas que se van a crear ahora.
function withEnterAnimation(callback) {
  animateRenders = true;
  try {
    callback();
  } finally {
    animateRenders = false;
  }
}

// Al terminar la animación se quita la clase: así los efectos de hover vuelven a mandar.
// El temporizador es una red de seguridad por si el evento no llega.
function armEnterCleanup(item) {
  const clear = () => item.classList.remove("is-entering");

  if (item.enterTimer) window.clearTimeout(item.enterTimer);
  item.enterTimer = window.setTimeout(clear, 1900);
  item.addEventListener("animationend", clear, { once: true });
}

// Escalona la entrada de los elementos recién creados de una lista.
function staggerItems(container, selector, options) {
  if (!container || !animateRenders) return;

  const settings = options || {};
  const items = $$(selector, container);
  const step = settings.step || ENTER_STAGGER;
  const maxIndex = settings.maxIndex === undefined ? 10 : settings.maxIndex;

  items.forEach((item, index) => {
    item.style.setProperty("--enter-delay", Math.min(index, maxIndex) * step + "ms");
    item.classList.add("is-entering");
    armEnterCleanup(item);
  });
}

// Reejecuta la entrada de los bloques fijos de una sección.
function replayEnter(scope) {
  if (!scope || prefersReducedMotion()) return;

  const items = $$("[data-animate]", scope);
  if (!items.length) return;

  items.forEach((item) => item.classList.remove("is-entering"));
  void scope.offsetWidth; // fuerza el reinicio de las animaciones

  items.forEach((item, index) => {
    item.style.setProperty("--enter-delay", Math.min(index, 8) * ENTER_STAGGER + "ms");
    item.classList.add("is-entering");
    armEnterCleanup(item);
  });
}

// Barrido de luz que cruza la pantalla al cambiar de sección.
function playPageWipe(direction) {
  const wipe = $("#page-wipe");
  if (!wipe || prefersReducedMotion()) return;

  wipe.dataset.dir = direction === "back" ? "back" : "forward";
  wipe.classList.remove("is-active");
  void wipe.offsetWidth;
  wipe.classList.add("is-active");

  window.clearTimeout(pageWipeTimer);
  pageWipeTimer = window.setTimeout(() => wipe.classList.remove("is-active"), 800);
}

// Píldora de la navegación de escritorio: se desliza hasta la sección activa.
function positionNavIndicator() {
  const indicator = $("#nav-indicator");
  const nav = $(".main-nav");
  if (!indicator || !nav) return;

  const active = nav.querySelector(".nav-link.is-active");
  if (!active || !active.offsetWidth) {
    indicator.style.opacity = "0";
    return;
  }

  indicator.style.opacity = "1";
  indicator.style.width = active.offsetWidth + "px";
  indicator.style.transform = "translateX(" + active.offsetLeft + "px)";
}

// Barra de la navegación móvil.
function updateMobileNavIndicator(target) {
  const nav = $(".mobile-nav");
  if (!nav) return;

  const index = SECTIONS.indexOf(target);
  nav.style.setProperty("--nav-index", String(index < 0 ? 0 : index));
}

// Los contadores del resumen suben hasta su valor.
function animateNumber(node, value) {
  if (!node || node.dataset.animatedValue === String(value)) return;

  const previous = Number(node.dataset.animatedValue || 0);
  node.dataset.animatedValue = String(value);

  const running = numberFrames.get(node);
  if (running) window.cancelAnimationFrame(running);

  if (prefersReducedMotion() || previous === value) {
    node.textContent = formatNumber(value);
    return;
  }

  const start = performance.now();
  const duration = 820;

  // El valor final queda escrito desde el principio: si no hay frames disponibles
  // (por ejemplo, con la pestaña en segundo plano) el dato nunca se queda en 0.
  node.textContent = formatNumber(value);

  function stop() {
    const running = numberFrames.get(node);
    if (running) window.cancelAnimationFrame(running);
    numberFrames.delete(node);
    node.textContent = formatNumber(value);
  }

  function frame(now) {
    const progress = Math.max(0, Math.min((now - start) / duration, 1));
    const eased = 1 - Math.pow(1 - progress, 3);

    if (progress >= 1) {
      stop();
      return;
    }

    node.textContent = formatNumber(previous + (value - previous) * eased);
    numberFrames.set(node, window.requestAnimationFrame(frame));
  }

  numberFrames.set(node, window.requestAnimationFrame(frame));

  // Red de seguridad: el valor final siempre acaba escrito.
  window.setTimeout(stop, duration + 320);
}

// Cabecera compacta al bajar, indicador al redimensionar y avisos de scroll.
function bindScrollEffects() {
  const header = $(".site-header");
  let ticking = false;
  let resizing = false;

  function update() {
    ticking = false;
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 14);
  }

  update();
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    if (resizing) return;
    resizing = true;
    window.requestAnimationFrame(() => {
      resizing = false;
      positionNavIndicator();
    });
  });

  window.addEventListener("load", positionNavIndicator);
}

// Bloques que aparecen suavemente al llegar hasta ellos.
function bindScrollReveals() {
  const targets = $$("[data-scroll-reveal]");
  if (!targets.length) return;

  targets.forEach((target, index) => {
    target.style.setProperty("--reveal-delay", Math.min(index, 6) * 70 + "ms");
  });

  if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
  );

  targets.forEach((target) => {
    // Lo que ya se ve al cargar no se oculta: solo se anima lo que queda más abajo.
    if (target.getBoundingClientRect().top <= window.innerHeight * 0.85) {
      target.classList.add("is-visible");
      return;
    }
    target.classList.add("is-reveal-pending");
    observer.observe(target);
  });

  // Red de seguridad: pasado un tiempo, ningún bloque se queda oculto.
  window.setTimeout(() => {
    targets.forEach((target) => target.classList.add("is-visible"));
  }, 5000);
}

// Vuelve a dibujar el contenido de la sección que acaba de entrar.
function refreshSectionContent(target) {
  if (target === "inicio") {
    renderHome();
  } else if (target === "calendario") {
    renderCalendar();
    renderDayPanel();
  } else if (target === "recuerdos") {
    renderGallery();
  }
}

/* ---------- 22. Inicialización y eventos ---------- */
function bindDialogs() {
  function tryClose(dialog) {
    if (!dialog || !dialog.open) return;
    if (dialog.id === "record-dialog" && processingPhotos) {
      showToast("Espera un momento: estamos optimizando las fotografías.", "info");
      return;
    }
    dialog.close();
  }

  $$("dialog").forEach((dialog) => {
    dialog.addEventListener("close", syncModalState);
    dialog.addEventListener("cancel", (event) => {
      if (dialog.id === "confirm-dialog") dialog.returnValue = "cancel";
      if (dialog.id === "lock-dialog" && !profileUnlocked()) {
        event.preventDefault(); // no se puede cerrar sin escribir el código
        return;
      }
      if (dialog.id === "record-dialog" && processingPhotos) {
        event.preventDefault();
        showToast("Espera un momento: estamos optimizando las fotografías.", "info");
      }
    });
    dialog.addEventListener("click", (event) => {
      // Un clic en el fondo (fuera del panel) cierra el diálogo.
      if (event.target !== dialog) return;
      if (dialog.id === "lock-dialog" && !profileUnlocked()) return; // cerrar con fondo desactivado
      if (dialog.id === "confirm-dialog") dialog.returnValue = "cancel";
      tryClose(dialog);
    });
  });

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-close-dialog]");
    if (trigger) {
      const dialog = trigger.closest("dialog");
      tryClose(dialog);
    }
  });
}

function bindNavigation() {
  window.addEventListener("hashchange", handleHashChange);
}

function bindGlobalActions() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest('[data-action="add"]');
    if (!trigger) return;
    event.preventDefault();
    const prefillDate = currentSection === "calendario" && selectedDate ? selectedDate : null;
    openRecordForm(prefillDate ? { date: prefillDate } : {});
  });
}

function bindCalendar() {
  $("#calendar-prev").addEventListener("click", () => changeMonth(-1));
  $("#calendar-next").addEventListener("click", () => changeMonth(1));
  $("#calendar-today").addEventListener("click", goToToday);
  $("#day-add").addEventListener("click", () => {
    openRecordForm(selectedDate ? { date: selectedDate } : {});
  });
}

function bindGallery() {
  $("#sport-filters").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-sport]");
    if (!button) return;
    activeSport = button.dataset.sport;
    renderGallery();
  });

  let searchTimer = null;
  $("#search-input").addEventListener("input", () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(renderGallery, 140);
  });

  $("#clear-filters").addEventListener("click", () => {
    if (!records.length) {
      openRecordForm({});
      return;
    }
    activeSport = "all";
    $("#search-input").value = "";
    renderGallery();
  });
}

function bindForm() {
  $("#record-form").addEventListener("submit", handleFormSubmit);

  const photoInput = $("#photo-input");
  $("#photo-pick").addEventListener("click", () => photoInput.click());

  photoInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    handlePhotoFiles(files);
  });

  const dropzone = $("#dropzone");
  ["dragenter", "dragover"].forEach((type) => {
    dropzone.addEventListener(type, (event) => {
      event.preventDefault();
      dropzone.classList.add("is-dragover");
    });
  });
  ["dragleave", "dragend"].forEach((type) => {
    dropzone.addEventListener(type, () => dropzone.classList.remove("is-dragover"));
  });
  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("is-dragover");
    if (event.dataTransfer && event.dataTransfer.files) {
      handlePhotoFiles(event.dataTransfer.files);
    }
  });

  // Evita que el navegador abra las imágenes soltadas fuera de la zona
  window.addEventListener("dragover", (event) => event.preventDefault());
  window.addEventListener("drop", (event) => event.preventDefault());
}

function bindDetailAndLightbox() {
  $("#edit-record").addEventListener("click", () => {
    const record = records.find((item) => item.id === detailId);
    if (!record) return;
    closeDialog($("#detail-dialog"));
    openRecordForm({ record });
  });

  $("#delete-record").addEventListener("click", () => {
    if (detailId) deleteRecord(detailId);
  });

  $("#lightbox-prev").addEventListener("click", () => stepLightbox(-1));
  $("#lightbox-next").addEventListener("click", () => stepLightbox(1));

  $("#lightbox-img").addEventListener("error", () => {
    showToast("No pudimos mostrar esta fotografía.", "error");
  });

  document.addEventListener("keydown", (event) => {
    const lightbox = $("#lightbox");
    if (!lightbox.open) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepLightbox(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      stepLightbox(1);
    }
  });
}

function init() {
  records = loadRecords();
  profile = loadProfile();

  buildSportOptions();
  buildSportFilters();
  withEnterAnimation(renderAll);
  refreshProfileUI();

  if (!storageOK) $("#storage-banner").hidden = false;

  bindNavigation();
  bindDialogs();
  bindGlobalActions();
  bindCalendar();
  bindGallery();
  bindForm();
  bindDetailAndLightbox();
  bindLegal();
  bindInstall();
  bindProfile();
  bindWelcome();
  bindScrollEffects();
  bindScrollReveals();
  setFooterYear();

  const initialHash = window.location.hash.replace("#", "");
  showSection(SECTIONS.indexOf(initialHash) !== -1 ? initialHash : "inicio", {
    scroll: false,
    intro: true,
  });

  // Bloqueo del perfil: si hay código y no se ha desbloqueado la pestaña, lo primero es entrar.
  if (profile && profile.pinHash && !profileUnlocked()) {
    openLockDialog();
  }

  // Primera visita sin perfil: bienvenida única con los dos pasos (perfil e instalación).
  maybeShowWelcome();
}

document.addEventListener("DOMContentLoaded", init);





