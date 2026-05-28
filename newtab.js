
let state = null;
let editPageId = null;
let editBoardId = null;
let pendingWallpaperDataUrl = null;
let selectedWallpaperId = null;
let selectedTheme = "dark";
let isAddingBoardInline = false;
let editBookmarkContext = null;
let draggedLinkContext = null;
let linkSortIndicator = null;
let draggedBoardId = null;
const expandedBoardsRuntime = new Set();
let boardStyleApplyTimer = null;
let wallpaperSelectionChanged = false;
let wallpaperUrlChanged = false;
let pendingDeletePageId = null;
let boardLayoutResizeTimer = null;
let activeMenuTrigger = null;

const el = {
  bgLayer: document.getElementById("bgLayer"),
  pagesNav: document.getElementById("pagesNav"),
  boardsGrid: document.getElementById("boardsGrid"),
  searchInput: document.getElementById("searchInput"),
  toast: document.getElementById("toast"),
  menuLayer: document.getElementById("menuLayer"),

  pageDialog: document.getElementById("pageDialog"),
  pageDialogTitle: document.getElementById("pageDialogTitle"),
  pageTitleField: document.getElementById("pageTitleField"),

  boardDialog: document.getElementById("boardDialog"),
  boardDialogTitle: document.getElementById("boardDialogTitle"),
  boardTitleField: document.getElementById("boardTitleField"),

  tabsDialog: document.getElementById("tabsDialog"),
  tabsList: document.getElementById("tabsList"),

  generalSettingsDialog: document.getElementById("generalSettingsDialog"),
  compactModeField: document.getElementById("compactModeField"),
  groupToolsField: document.getElementById("groupToolsField"),
  hideExtraField: document.getElementById("hideExtraField"),
  visibleBookmarksField: document.getElementById("visibleBookmarksField"),
  shortenTitlesField: document.getElementById("shortenTitlesField"),

  settingsDialog: document.getElementById("settingsDialog"),
  wallpapersGrid: document.getElementById("wallpapersGrid"),
  userWallpapersSection: document.getElementById("userWallpapersSection"),
  userWallpapersGrid: document.getElementById("userWallpapersGrid"),
  userWallpaperCount: document.getElementById("userWallpaperCount"),
  userWallpapersToggle: document.getElementById("userWallpapersToggle"),
  wallpaperField: document.getElementById("wallpaperField"),
  wallpaperFileField: document.getElementById("wallpaperFileField"),
  wallpaperAdjustDialog: document.getElementById("wallpaperAdjustDialog"),
  primaryColorField: document.getElementById("primaryColorField"),
  primaryColorText: document.getElementById("primaryColorText"),
  boardColorField: document.getElementById("boardColorField"),
  boardColorText: document.getElementById("boardColorText"),
  boardOpacityField: document.getElementById("boardOpacityField"),
  boardOpacityText: document.getElementById("boardOpacityText"),
  boardBlurField: document.getElementById("boardBlurField"),
  boardBlurText: document.getElementById("boardBlurText"),
  pickPrimaryColorBtn: document.getElementById("pickPrimaryColorBtn"),
  pickBoardColorBtn: document.getElementById("pickBoardColorBtn"),
  accentField: document.getElementById("accentField"),
  densityField: document.getElementById("densityField"),
  languageField: document.getElementById("languageField"),
  overlayField: document.getElementById("overlayField"),
  darkThemeBtn: document.getElementById("darkThemeBtn"),
  lightThemeBtn: document.getElementById("lightThemeBtn"),

  importBookmarksDialog: document.getElementById("importBookmarksDialog"),
  importFoldersList: document.getElementById("importFoldersList"),
  deletePageDialog: document.getElementById("deletePageDialog"),
  deletePageDialogTitle: document.getElementById("deletePageDialogTitle"),
  deletePageDialogText: document.getElementById("deletePageDialogText"),

  bookmarkEditDialog: document.getElementById("bookmarkEditDialog"),
  bookmarkUrlField: document.getElementById("bookmarkUrlField"),
  bookmarkTitleField: document.getElementById("bookmarkTitleField"),
  bookmarkDescriptionField: document.getElementById("bookmarkDescriptionField"),
  fetchBookmarkTitleBtn: document.getElementById("fetchBookmarkTitleBtn"),
  saveBookmarkEditBtn: document.getElementById("saveBookmarkEditBtn"),

  trashDialog: document.getElementById("trashDialog"),
  trashLinksList: document.getElementById("trashLinksList"),
  trashBoardsList: document.getElementById("trashBoardsList"),
  trashPagesList: document.getElementById("trashPagesList")
};


const ICONS = {
  open: `<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M320 128h64v64"/><path d="M216 296L384 128"/><path d="M368 280v72a48 48 0 0 1-48 48H160a48 48 0 0 1-48-48V192a48 48 0 0 1 48-48h72"/></svg>`,
  refresh: `<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M96 256a160 160 0 0 1 272-113"/><path d="M368 96v80h-80"/><path d="M416 256A160 160 0 0 1 144 369"/><path d="M144 416v-80h80"/></svg>`,
  edit: `<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M80 432l32-112L320 112a56 56 0 0 1 80 80L192 400 80 432z"/><path d="M288 144l80 80"/></svg>`,
  share: `<svg viewBox="0 0 512 512" aria-hidden="true"><circle cx="384" cy="128" r="48"/><circle cx="128" cy="256" r="48"/><circle cx="384" cy="384" r="48"/><path d="M171 235l170-86"/><path d="M171 277l170 86"/></svg>`,
  trash: `<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M112 144h288"/><path d="M192 144V96h128v48"/><path d="M368 144l-24 288H168l-24-288"/><path d="M224 208v160"/><path d="M288 208v160"/></svg>`,
  close: `<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M128 128l256 256"/><path d="M384 128L128 384"/></svg>`,
  add: `<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M256 112v288"/><path d="M112 256h288"/></svg>`,
  image: `<svg viewBox="0 0 512 512" aria-hidden="true"><rect x="80" y="112" width="352" height="288" rx="32"/><circle cx="176" cy="192" r="32"/><path d="M432 336l-96-96-80 80-48-48-128 128"/></svg>`,
  archive: `<svg viewBox="0 0 512 512" aria-hidden="true"><rect x="80" y="112" width="352" height="80" rx="16"/><path d="M112 192v208h288V192"/><path d="M208 272h96"/></svg>`,
  use: `<svg viewBox="0 0 512 512" aria-hidden="true"><rect x="96" y="96" width="320" height="320" rx="32"/><path d="M176 264l56 56 112-128"/></svg>`,
  chevron: `<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M128 192l128 128 128-128"/></svg>`,
  settings: `<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M256 176a80 80 0 1 0 0 160 80 80 0 0 0 0-160z"/><path d="M384 256a133 133 0 0 0-2-24l48-37-48-83-56 23a137 137 0 0 0-42-24L276 48h-96l-8 63a137 137 0 0 0-42 24l-56-23-48 83 48 37a133 133 0 0 0 0 48l-48 37 48 83 56-23a137 137 0 0 0 42 24l8 63h96l8-63a137 137 0 0 0 42-24l56 23 48-83-48-37a133 133 0 0 0 2-24z"/></svg>`,
  import: `<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M256 80v240"/><path d="M168 232l88 88 88-88"/><path d="M96 368v32a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32v-32"/></svg>`,
  menu: `<svg viewBox="0 0 512 512" aria-hidden="true"><circle cx="256" cy="128" r="24"/><circle cx="256" cy="256" r="24"/><circle cx="256" cy="384" r="24"/></svg>`
};

function icon(name) {
  return `<span class="ion-icon" aria-hidden="true">${ICONS[name] || ""}</span>`;
}

const I18N = {
  ru: {
    style: "Стиль",
    adjustWallpaperStyle: "Настройка стиля фона",
    adjustWallpaperDesc: "Цвета подобраны по текущему изображению.",
    primaryColor: "Основной цвет",
    boardColor: "Цвет досок",
    boardOpacity: "Прозрачность досок",
    boardBlur: "Блюр досок",
    reset: "Сбросить",
    styleAutosave: "Изменения применяются автоматически",
    generalSettings: "Основные настройки",
    appearance: "Внешний вид",
    compactMode: "Компактный режим",
    compactModeDesc: "Уменьшает отступы, чтобы помещалось больше закладок",
    groupTools: "Группировать правые инструменты",
    groupToolsDesc: "Оставляет поиск и настройки видимыми, остальные кнопки группирует",
    hideExtraBookmarks: "Скрывать лишние закладки в длинных досках",
    hideExtraBookmarksDesc: "Автоматически прячет лишние элементы в длинных досках",
    visibleBookmarks: "Видимых закладок до скрытия",
    visibleBookmarksDesc: "Сколько закладок показывать перед скрытием остальных",
    shortenTitles: "Сокращать длинные названия",
    shortenTitlesDesc: "Показывает длинные названия в одну строку с многоточием",
    dark: "Тёмная",
    light: "Светлая",
    starterWallpapers: "Фоны",
    uploadWallpaper: "Загрузить фон",
    moreWallpapers: "Больше фонов",
    wallpaperUrl: "Ссылка на фон",
    overlay: "Затемнение фона",
    accent: "Акцентный цвет",
    density: "Плотность",
    densityComfortable: "Обычная",
    densityCompact: "Компактная",
    language: "Язык",
    clear: "Очистить",
    cancel: "Отмена",
    save: "Сохранить",
    close: "Закрыть",
    addBoard: "＋ Добавить доску",
    addLink: "Добавить ссылку",
    search: "поиск по закладкам, доскам и страницам...",
    importChromeBookmarks: "Импорт закладок Chrome",
    importChromeBookmarksDesc: "Выбери папки, которые нужно импортировать как доски на текущую страницу:",
    importSelected: "Импортировать выбранное",
    skip: "Пропустить",
    bookmarksCount: "закладок",
    editBookmark: "Редактировать закладку",
    saveChanges: "Сохранить",
    openAllLinks: "Открыть все ссылки",
    fetchAllTitles: "Получить все названия",
    editBoard: "Редактировать доску",
    shareBoard: "Поделиться доской",
    deleteBoard: "Удалить доску",
    addLink: "Добавить ссылку",
    cancel: "Отмена",
    newPage: "Новая страница",
    renamePage: "Переименовать страницу",
    newBoard: "Новая доска",
    editBoardTitle: "Редактировать доску"
  },
  en: {
    style: "Style",
    adjustWallpaperStyle: "Adjust Wallpaper Style",
    adjustWallpaperDesc: "Colors are detected from the current image.",
    primaryColor: "Primary Color",
    boardColor: "Board Color",
    boardOpacity: "Board Opacity",
    boardBlur: "Board Blur",
    reset: "Reset",
    styleAutosave: "Changes are applied automatically",
    generalSettings: "General Settings",
    appearance: "Appearance",
    compactMode: "Compact mode",
    compactModeDesc: "Reduce spacing to show more bookmarks",
    groupTools: "Group right-side tools",
    groupToolsDesc: "Keep Search and Settings visible, group the other right-side buttons",
    hideExtraBookmarks: "Hide extra bookmarks in long boards",
    hideExtraBookmarksDesc: "Automatically hides extra bookmarks in long boards",
    visibleBookmarks: "Visible bookmarks before hide",
    visibleBookmarksDesc: "Choose how many bookmarks are shown before hiding the rest",
    shortenTitles: "Shorten long titles",
    shortenTitlesDesc: "Show titles on one line with ellipsis",
    dark: "Dark",
    light: "Light",
    starterWallpapers: "Starter wallpapers",
    darkWallpapers: "Dark theme",
    lightWallpapers: "Light theme",
    yourWallpapers: "Your wallpapers",
    uploadWallpaper: "Upload wallpaper",
    moreWallpapers: "More wallpapers",
    wallpaperUrl: "Wallpaper URL",
    overlay: "Background dim",
    accent: "Accent color",
    density: "Density",
    densityComfortable: "Comfortable",
    densityCompact: "Compact",
    language: "Language",
    clear: "Clear",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    addBoard: "＋ Add Board",
    addLink: "Add Link",
    search: "search bookmarks, boards and pages...",
    importChromeBookmarks: "Import Chrome Bookmarks",
    importChromeBookmarksDesc: "Select folders to import as boards on the current page:",
    importSelected: "Import selected",
    skip: "Skip",
    bookmarksCount: "bookmarks",
    editBookmark: "Edit Bookmark",
    saveChanges: "Save Changes",
    openAllLinks: "Open All Links",
    fetchAllTitles: "Fetch All Titles",
    editBoard: "Edit Board",
    shareBoard: "Share Board",
    deleteBoard: "Delete Board",
    addLink: "Add Link",
    cancel: "Cancel",
    newPage: "New Page",
    renamePage: "Rename Page",
    newBoard: "New Board",
    editBoardTitle: "Edit Board"
  }
};

function t(key) {
  const lang = state?.settings?.language || "ru";
  return I18N[lang]?.[key] || I18N.ru[key] || key;
}

function applyI18n() {
  document.documentElement.lang = state.settings.language || "ru";
  document.querySelectorAll("[data-i18n]").forEach(node => {
    const key = node.dataset.i18n;
    node.textContent = t(key);
  });
  if (el.searchInput) el.searchInput.placeholder = t("search");
}

queueMicrotask(() => safeInit());

// Убиваем браузерный автокомплит на поле поиска
document.addEventListener("DOMContentLoaded", () => {
  const si = document.getElementById("searchInput");
  if (si) {
    si.setAttribute("autocomplete", "new-password");
    si.setAttribute("autocomplete", "off");
    si.form && si.form.setAttribute("autocomplete", "off");
  }
});


async function safeInit() {
  try {
    await init();
  } catch (error) {
    console.error("Daniil Start failed to initialize", error);
    showFatalScreen(error);
  }
}

function showFatalScreen(error) {
  const message = String(error?.stack || error?.message || error || "Unknown error")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  const root = document.createElement("div");
  root.className = "fatal-screen";
  root.innerHTML = `
    <h1>Расширение не смогло запуститься</h1>
    <p>Это защитный экран вместо пустой вкладки. Нажми сброс, чтобы очистить данные прошлых версий.</p>
    <button id="fatalResetBtn" type="button">Сбросить данные расширения</button>
    <pre>${message}</pre>
  `;
  document.body.appendChild(root);

  root.querySelector("#fatalResetBtn").addEventListener("click", () => {
    try {
      chrome.storage.sync.clear(() => {
        chrome.storage.local.clear(() => {
          location.reload();
        });
      });
    } catch (error) {
      console.error("Reset failed", error);
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {}
      location.reload();
    }
  });
}


function hydrateStaticIcons() {
  const set = (id, name) => {
    const node = document.getElementById(id);
    if (node) node.innerHTML = icon(name);
  };

  set("addPageBtn", "add");
  set("trashBtn", "trash");
  set("importBookmarksBtn", "import");
  set("settingsBtn", "settings");
  set("wallpaperQuickBtn", "image");
}

async function init() {
  hydrateStaticIcons();
  state = await loadState();
  if (!state || !Array.isArray(state.pages)) {
    state = defaultState();
    await syncStore.set(state);
  }
  state.onboarding = { importAsked: false, ...(state.onboarding || {}) };
  ensureActivePage();
  ensureValidWallpaper();
  await applySettings();
  applyI18n();
  bindEvents();
  preloadFaviconsOnce();
  renderAll();
  await maybeOpenImportOnboarding();
}

function bindEvents() {
  document.getElementById("addPageBtn").addEventListener("click", () => openPageDialog(null, false));
  document.getElementById("focusSearchBtn").addEventListener("click", () => el.searchInput.focus());
  document.getElementById("importBookmarksBtn").addEventListener("click", () => openImportDialog(false));
  document.getElementById("saveTabsBtn").addEventListener("click", saveCurrentWindowAsBoard);
  document.getElementById("tabsBtn").addEventListener("click", openTabsDialog);
  document.getElementById("trashBtn").addEventListener("click", openTrashDialog);
  document.getElementById("exportBtn").addEventListener("click", exportData);
  document.getElementById("importFile").addEventListener("change", importJson);
  document.getElementById("settingsBtn").addEventListener("click", openGeneralSettings);
  document.getElementById("wallpaperQuickBtn").addEventListener("click", openSettings);

  document.getElementById("savePageDialogBtn").addEventListener("click", savePageDialog);
  document.getElementById("saveBoardDialogBtn").addEventListener("click", saveBoardDialog);

  document.getElementById("refreshTabsBtn").addEventListener("click", renderTabs);
  document.getElementById("saveTabsFromDialogBtn").addEventListener("click", async event => {
    event.preventDefault();
    await saveCurrentWindowAsBoard();
    el.tabsDialog.close();
  });

  document.getElementById("saveSettingsBtn")?.addEventListener("click", saveSettings);
  document.getElementById("saveGeneralSettingsBtn").addEventListener("click", saveGeneralSettings);
  document.getElementById("importSelectedBtn").addEventListener("click", importSelectedBookmarkFolders);
  document.getElementById("skipImportBtn").addEventListener("click", skipBookmarkImport);
  el.fetchBookmarkTitleBtn.addEventListener("click", fetchTitleForBookmarkEdit);
  el.saveBookmarkEditBtn.addEventListener("click", saveBookmarkEdit);
  el.bookmarkDescriptionField.addEventListener("input", updateBookmarkDescriptionCounter);
  document.getElementById("moreWallpapersBtn")?.addEventListener("click", () => {
    window.open("https://wallhaven.cc/", "_blank", "noopener,noreferrer");
  });

  el.userWallpapersToggle?.addEventListener("click", () => {
    el.userWallpapersGrid.classList.toggle("hidden");
  });
  document.getElementById("clearWallpaperBtn")?.addEventListener("click", clearWallpaper);
  document.getElementById("emptyTrashBtn").addEventListener("click", emptyTrash);
  document.getElementById("confirmDeletePageBtn")?.addEventListener("click", confirmDeletePage);

  el.searchInput.addEventListener("input", renderBoards);
  window.addEventListener("resize", () => {
    clearTimeout(boardLayoutResizeTimer);
    boardLayoutResizeTimer = setTimeout(renderBoards, 120);
  });
  bindLinkDragDelegation();
  el.menuLayer.addEventListener("click", event => {
    if (event.target === el.menuLayer) closeMenu();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".context-menu") && !event.target.closest("[data-menu-trigger]")) {
      closeMenu();
    }
  }, true);

    el.wallpaperField.addEventListener("input", () => {
    wallpaperUrlChanged = true;
    if (el.wallpaperField.value.trim()) {
      pendingWallpaperDataUrl = null;
      wallpaperSelectionChanged = false;
    }
  });

  bindWallpaperStyleEvents();

  el.wallpaperFileField.addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast("Нужна картинка, не философский трактат.");
    pendingWallpaperDataUrl = await fileToDataUrl(file);
    selectedWallpaperId = "";
    wallpaperSelectionChanged = false;
    wallpaperUrlChanged = false;
    el.wallpaperField.value = "";

    const userWallpaperId = uid("wallpaper");
    await addUserWallpaper({
      id: userWallpaperId,
      title: file.name || "Uploaded wallpaper",
      dataUrl: pendingWallpaperDataUrl,
      archived: false,
      createdAt: Date.now(),
      palette: null
    });

    await setLocalWallpaper(pendingWallpaperDataUrl);
    state.settings.wallpaper = "";
    state.settings.wallpaperType = "local";
    state.settings.wallpaperId = "";
    state.settings.activeUserWallpaperId = userWallpaperId;

    const palette = await extractPaletteFromImage(pendingWallpaperDataUrl);
    applyDetectedPalette(palette);

    const uploadedList = await getUserWallpapers();
    const uploadedItem = uploadedList.find(item => item.id === state.settings.activeUserWallpaperId);
    if (uploadedItem) {
      uploadedItem.palette = palette;
      await setUserWallpapers(uploadedList);
    }

    await persist();
    await applySettings();
    await renderWallpaperCards();
    if (el.settingsDialog?.open) el.settingsDialog.close();
    openWallpaperAdjustDialog();
    toast("Фон загружен.");
  });
}

function ensureValidWallpaper() {
  const currentId = state.settings.wallpaperId;
  if (state.settings.wallpaperType === "starter" && !STARTER_WALLPAPERS.some(item => item.id === currentId)) {
    const first = STARTER_WALLPAPERS.find(item => item.theme === (state.settings.theme || "dark")) || STARTER_WALLPAPERS[0];
    state.settings.wallpaperId = first.id;
    state.settings.wallpaper = "";
    state.settings.wallpaperType = "starter";
    state.settings.activeUserWallpaperId = "";
    applyDetectedPalette(first.palette);
    if (typeof first.palette?.overlay === "number") state.settings.overlay = first.palette.overlay;
  }
}

function ensureActivePage() {
  if (!state.pages.length) {
    const fresh = defaultState();
    state.pages = fresh.pages;
    state.activePageId = fresh.activePageId;
  }
  if (!state.pages.some(page => page.id === state.activePageId)) {
    state.activePageId = state.pages[0].id;
  }
}

function activePage() {
  ensureActivePage();
  return state.pages.find(page => page.id === state.activePageId);
}

function hexLuminance(hex) {
  const clean = String(hex || "#000000").replace("#", "");
  const full = clean.length === 3 ? clean.split("").map(ch => ch + ch).join("") : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return 0;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return (r * 299 + g * 587 + b * 114) / 1000;
}

function effectiveBoardColorForTheme(hex, isLight) {
  // Все темы: доски не берут оттенок картинки/акцента.
  return isLight ? "#F3F0EA" : "#050807";
}


function preloadFaviconsOnce() {
  try {
    const urls = [];

    (state.pages || []).forEach(page => {
      (page.boards || []).forEach(board => {
        (board.links || []).forEach(link => {
          if (link.url) urls.push(link.url);
        });
      });
    });

    [...new Set(urls)].slice(0, 250).forEach(url => {
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.src = googleFaviconUrl(url, 32);
    });
  } catch (error) {
    console.warn("preloadFaviconsOnce failed", error);
  }
}

async function applySettings() {
  const settings = state.settings || {};
  const isLight = settings.theme === "light";

  document.body.classList.toggle("light", isLight);
  document.body.classList.toggle("hide-extra-bookmarks", state.settings.hideExtraBookmarks === true);
  document.body.dataset.visibleBookmarks = String(state.settings.visibleBookmarks || 10);
  document.body.classList.toggle("dark", !isLight);
  document.body.classList.toggle("compact", settings.density === "compact" || settings.compactMode === true);
  document.body.classList.toggle("group-tools", settings.groupTools === true);
  document.body.classList.toggle("shorten-titles", settings.shortenTitles !== false);

  const accent = settings.primaryColor || settings.accent || (isLight ? "#7E8584" : "#D49A57");
  const accentText = hexLuminance(accent) > 155 ? "#151815" : "#ffffff";
  const boardColor = settings.boardColor || effectiveBoardColorForTheme(null, isLight);
  const secondary = boardColor;
  const secondaryText = hexLuminance(secondary) > 155 ? "#151815" : "#ffffff";

  document.documentElement.style.setProperty("--accent", accent);
  document.documentElement.style.setProperty("--style-accent", accent);
  document.documentElement.style.setProperty("--accent-text", accentText);
  document.documentElement.style.setProperty("--secondary", secondary);
  document.documentElement.style.setProperty("--secondary-text", secondaryText);
  document.documentElement.style.setProperty("--board-rgb", hexToRgbString(boardColor));
  const isStarterWallpaper = settings.wallpaperType === "starter" || (!settings.wallpaperType && !settings.wallpaper && !settings.activeUserWallpaperId);
  const effectiveBoardOpacity = isStarterWallpaper ? 10 : (settings.boardOpacity ?? 10);
  document.documentElement.style.setProperty("--board-opacity", String(effectiveBoardOpacity / 100));
  document.documentElement.style.setProperty("--board-blur", `${settings.boardBlur ?? (isLight ? 12 : 16)}px`);
  document.documentElement.style.setProperty("--overlay", String((settings.overlay ?? (isLight ? 20 : 58)) / 100));

  let backgroundImage = "";

  try {
    const localWallpaper = await getLocalWallpaper();

    if (localWallpaper) {
      backgroundImage = `url("${localWallpaper}")`;
    } else if (settings.wallpaper) {
      backgroundImage = `url("${settings.wallpaper}")`;
    } else {
      const starter =
        STARTER_WALLPAPERS.find(item => item.id === settings.wallpaperId) ||
        STARTER_WALLPAPERS.find(item => item.theme === (settings.theme || "dark")) ||
        STARTER_WALLPAPERS[0];

      backgroundImage = wallpaperCss(starter);
    }
  } catch (error) {
    console.warn("Wallpaper apply failed", error);
    const fallback =
      STARTER_WALLPAPERS.find(item => item.theme === (settings.theme || "dark")) ||
      STARTER_WALLPAPERS[0];
    backgroundImage = wallpaperCss(fallback);
  }

  if (el.bgLayer) {
    el.bgLayer.style.backgroundImage = backgroundImage;
    el.bgLayer.style.backgroundSize = "cover";
    el.bgLayer.style.backgroundPosition = "center";
    el.bgLayer.style.backgroundRepeat = "no-repeat";
  }

  document.body.style.backgroundColor = isLight ? "#f4f1eb" : "#050807";
}

function renderAll() {
  applyI18n();
  renderPages();
  renderBoards();
}

function renderPages() {
  el.pagesNav.innerHTML = "";

  state.pages.forEach(page => {
    const isActive = page.id === state.activePageId;
    const wrap = document.createElement("div");
    wrap.className = `page-pill-wrap ${isActive ? "active" : ""}`;
    wrap.dataset.pageId = page.id;

    const titleLength = Array.from(String(page.title || "")).length;
    const pillWidth = Math.max(96, Math.min(210, 64 + titleLength * 9));
    wrap.style.setProperty("--page-pill-width", `${pillWidth}px`);

    wrap.innerHTML = `
      <button type="button" class="page-pill ${isActive ? "active" : ""}" data-page-id="${escapeAttr(page.id)}" title="${escapeAttr(page.title)}">
        <span class="page-title">${escapeHtml(page.title)}</span>
      </button>
      <button type="button" class="page-menu-btn" data-menu-trigger data-page-menu="${escapeAttr(page.id)}" aria-label="Редактировать страницу" aria-haspopup="menu">${icon("edit")}</button>
    `;

    wrap.querySelector(".page-pill").addEventListener("click", async event => {
      event.preventDefault();
      if (state.activePageId === page.id) return;
      state.activePageId = page.id;
      renderPages();
      renderBoards();
      await persist();
    });

    wrap.querySelector(".page-menu-btn").addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      showPageMenu(page.id, event.currentTarget);
    });

    el.pagesNav.appendChild(wrap);
  });
}

function createAddBoardZone(alwaysVisible = false) {
  // Нейтрализовано: используем col-add-board-btn в каждой колонке
  // Возвращаем невидимый пустышка-div чтобы не сломать appendBoardLayoutItem
  const empty = document.createElement("div");
  empty.style.display = "none";
  return empty;
  // ---- оригинальный код ниже (не выполняется) ----
  const addCard = document.createElement(isAddingBoardInline ? "article" : "button");
  addCard.className = `add-board-card ${isAddingBoardInline ? "is-editing" : ""}`;

  if (isAddingBoardInline) {
    addCard.innerHTML = `
      <div class="inline-board-form">
        <input class="inline-board-input" type="text" placeholder="${state.settings.language === "en" ? "Enter board name..." : "Введите название доски..."}" />
        <button class="inline-board-add" type="button">${state.settings.language === "en" ? "Add" : "Добавить"}</button>
        <button class="inline-board-cancel" type="button" aria-label="Cancel">${icon("close")}</button>
      </div>
    `;

    const input = addCard.querySelector(".inline-board-input");
    const addButton = addCard.querySelector(".inline-board-add");
    const cancelButton = addCard.querySelector(".inline-board-cancel");

    const submitInlineBoard = async () => {
      const title = input.value.trim();
      if (!title) {
        input.focus();
        return;
      }

      activePage().boards.push({ id: uid("board"), title, links: [] });
      isAddingBoardInline = false;
      await persist();
      renderBoards();
      toast(state.settings.language === "en" ? "Board added." : "Доска добавлена.");
    };

    addButton.addEventListener("click", submitInlineBoard);
    cancelButton.addEventListener("click", () => {
      isAddingBoardInline = false;
      renderBoards();
    });

    input.addEventListener("keydown", event => {
      if (event.key === "Enter") submitInlineBoard();
      if (event.key === "Escape") {
        isAddingBoardInline = false;
        renderBoards();
      }
    });
  } else {
    addCard.type = "button";
    addCard.innerHTML = `<span>${t("addBoard")}</span>`;
    addCard.addEventListener("click", () => openBoardDialog());
  }

  const addZone = document.createElement("div");
  addZone.className = `add-board-zone ${alwaysVisible ? "always-visible" : ""}`.trim();
  addZone.appendChild(addCard);
  return addZone;
}


function getBoardLayoutColumnCount(totalItems = 1) {
  const itemCount = Math.max(1, Number(totalItems) || 1);

  // v2.9.47: no viewport heuristics here. Daniil asked for four columns on desktop,
  // and old breakpoint/container logic kept collapsing to three.
  // CSS will handle shrinking without horizontal scroll.
  if (itemCount >= 4) return 4;
  return itemCount;
}

function createStableBoardColumns(totalItems = 1) {
  const count = getBoardLayoutColumnCount(totalItems);
  const perColumn = Math.max(1, Math.ceil(Math.max(1, totalItems) / count));
  const columns = [];

  el.boardsGrid.innerHTML = "";
  el.boardsGrid.dataset.columns = String(count);
  el.boardsGrid.style.setProperty("--actual-board-columns", String(count));

  for (let index = 0; index < count; index += 1) {
    const column = document.createElement("div");
    column.className = "board-column";
    column.dataset.columnIndex = String(index);
    column.style.setProperty("--column-index", String(index));
    el.boardsGrid.appendChild(column);
    columns.push(column);
  }

  return { columns, perColumn };
}

function appendBoardLayoutItem(layout, node, index) {
  // Column-priority: заполняем колонку за колонкой.
  // Это делает drag-and-drop предсказуемым:
  // вставка "после board X" в flat-массиве = визуально под board X.
  const columnIndex = Math.min(layout.columns.length - 1, Math.floor(index / layout.perColumn));
  layout.columns[columnIndex].appendChild(node);
}

function renderBoards() {
  const query = el.searchInput.value.trim().toLowerCase();
  const page = activePage();

  const filtered = page.boards
    .map(board => {
      const boardMatches = board.title.toLowerCase().includes(query) || page.title.toLowerCase().includes(query);
      const links = query
        ? board.links.filter(link =>
            boardMatches ||
            link.title.toLowerCase().includes(query) ||
            link.url.toLowerCase().includes(query)
          )
        : board.links;
      return { ...board, links };
    })
    .filter(board => !query || board.title.toLowerCase().includes(query) || page.title.toLowerCase().includes(query) || board.links.length);

  const totalLayoutItems = (!filtered.length && query) ? 1 : filtered.length + (!query ? 1 : 0);
  const layout = createStableBoardColumns(totalLayoutItems);
  let layoutIndex = 0;

  if (!filtered.length && query) {
    const empty = document.createElement("article");
    empty.className = "board board-empty-search";
    empty.innerHTML = `<div class="empty">Ничего не найдено. Интернет огромный, а толку ноль.</div>`;
    appendBoardLayoutItem(layout, empty, layoutIndex);
    return;
  }

  filtered.forEach(board => {
    const node = document.createElement("article");
    node.className = "board";
    node.dataset.boardId = board.id;
    node.draggable = true;
    node.innerHTML = `
      <div class="board-head">
        <div class="board-title" title="${escapeHtml(board.title)}">${escapeHtml(board.title)}</div>
        <div class="board-actions">
          <button class="icon-btn link-add" data-action="quick-add" title="Добавить ссылку">${icon("add")}</button>
          <button class="icon-btn" data-menu-trigger data-action="board-menu" title="Меню доски">${icon("menu")}</button>
        </div>
      </div>
      <div class="link-list">
        ${renderBoardLinks(board)}
      </div>
    `;

    node.querySelector('[data-action="quick-add"]').addEventListener("click", () => toggleInlineAdd(board.id, node));
    node.querySelector('[data-action="board-menu"]').addEventListener("click", event => {
      event.stopPropagation();
      showBoardMenu(board.id, event.currentTarget);
    });

    node.addEventListener("dragstart", event => {
      if (event.target.closest(".bookmark-link")) return;
      if (event.target.closest("button, input, .inline-add")) {
        event.preventDefault();
        return;
      }
      draggedBoardId = board.id;
      event.dataTransfer.setData("text/plain", `board:${board.id}`);
      event.dataTransfer.effectAllowed = "move";
      node.classList.add("dragging");
    });

    node.addEventListener("dragover", event => {
      // Нейтрализован: document capture handler управляет drag-over визуалом
    });

    node.addEventListener("dragleave", event => {
      if (!draggedBoardId || draggedLinkContext) return;
      if (event.relatedTarget && node.contains(event.relatedTarget)) return;
      node.classList.remove("drag-over", "drag-before", "drag-after");
    });

    node.addEventListener("drop", async event => {
      // Нейтрализован: DOM-based drag в document capture обрабатывает drop
      // Ничего не делаем здесь — иначе moveBoardAround ломает DOM-порядок
    });

    node.addEventListener("dragend", () => {
      draggedBoardId = null;
      cleanupBoardDragUi();
    });

    node.querySelectorAll(".more-links-btn").forEach(button => {
      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        const action = button.dataset.boardToggle || "expand";
        if (action === "collapse") {
          expandedBoardsRuntime.delete(board.id);
        } else {
          expandedBoardsRuntime.add(board.id);
        }

        renderBoards();
      });
    });

    node.querySelectorAll("[data-link-action]").forEach(button => {
      const linkId = button.closest(".bookmark-link").dataset.linkId;
      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        if (button.dataset.linkAction === "edit") openBookmarkEditDialog(board.id, linkId);
        if (button.dataset.linkAction === "delete") trashLink(board.id, linkId);
      });
    });

    appendBoardLayoutItem(layout, node, layoutIndex);
    layoutIndex += 1;
  });

  if (!query) {
    appendBoardLayoutItem(layout, createAddBoardZone(isAddingBoardInline), layoutIndex);
  }
}

function renderBoardLinks(board) {
  if (!board.links.length) return `<div class="empty">Пустая доска</div>`;

  const shouldHide = state.settings.hideExtraBookmarks === true;
  const limit = Number(state.settings.visibleBookmarks || 10);
  const isExpanded = expandedBoardsRuntime.has(board.id);
  const linksToShow = shouldHide && !isExpanded ? board.links.slice(0, limit) : board.links;
  const hiddenCount = shouldHide && !isExpanded ? Math.max(0, board.links.length - linksToShow.length) : 0;
  const canCollapse = shouldHide && isExpanded && board.links.length > limit;

  return [
    linksToShow.map(link => linkTemplate(link, board.id)).join(""),
    hiddenCount ? `<button class="more-links-btn" type="button" data-board-toggle="expand" data-board-id="${escapeAttr(board.id)}">Показать ещё ${hiddenCount}</button>` : "",
    canCollapse ? `<button class="more-links-btn collapse-links-btn" type="button" data-board-toggle="collapse" data-board-id="${escapeAttr(board.id)}">Свернуть</button>` : ""
  ].join("");
}

function bindLinkDragDelegation() {
  if (el.boardsGrid.dataset.linkDragBound === "true") return;
  el.boardsGrid.dataset.linkDragBound = "true";

  el.boardsGrid.addEventListener("dragstart", event => {
    const linkNode = event.target.closest(".bookmark-link");
    if (!linkNode) return;

    draggedBoardId = null;
    cleanupBoardDragUi();

    const boardNode = linkNode.closest(".board");
    const fromBoardId = boardNode?.dataset.boardId || linkNode.dataset.boardId;
    const linkId = linkNode.dataset.linkId;

    if (!fromBoardId || !linkId) return;

    draggedLinkContext = { fromBoardId, linkId };
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-daniil-bookmark-link", JSON.stringify(draggedLinkContext));
    event.dataTransfer.setData("text/plain", `link:${fromBoardId}:${linkId}`);

    linkNode.classList.add("link-dragging");
  }, true);

  el.boardsGrid.addEventListener("dragover", event => {
    if (!draggedLinkContext) return;

    const boardNode = event.target.closest(".board");
    if (!boardNode) return;

    event.preventDefault();
    event.stopPropagation();

    event.dataTransfer.dropEffect = "move";
    document.querySelectorAll(".board.link-drop-target").forEach(item => {
      if (item !== boardNode) item.classList.remove("link-drop-target");
    });
    boardNode.classList.add("link-drop-target");
    updateLinkSortIndicator(event, boardNode.dataset.boardId);
  }, true);

  el.boardsGrid.addEventListener("drop", async event => {
    if (!draggedLinkContext) return;

    const boardNode = event.target.closest(".board");
    if (!boardNode) return;

    event.preventDefault();
    event.stopPropagation();

    const toBoardId = boardNode.dataset.boardId;
    const payload = { ...draggedLinkContext };
    const beforeLinkId = getLinkInsertContext(event, toBoardId)?.beforeLinkId || null;

    cleanupLinkDragUi();
    cleanupLinkSortIndicator();
    draggedLinkContext = null;

    await moveLinkToBoardPosition(payload.fromBoardId, payload.linkId, toBoardId, beforeLinkId);
  }, true);

  el.boardsGrid.addEventListener("dragend", () => {
    draggedLinkContext = null;
    cleanupLinkDragUi();
    cleanupLinkSortIndicator();
  }, true);

  el.boardsGrid.addEventListener("dragleave", event => {
    if (!draggedLinkContext) return;
    const boardNode = event.target.closest?.(".board");
    if (!boardNode) return;
    if (event.relatedTarget && boardNode.contains(event.relatedTarget)) return;
    boardNode.classList.remove("link-drop-target");
    cleanupLinkSortIndicator();
  }, true);

  document.addEventListener("dragover", event => {
    if (!draggedLinkContext) return;
    const boardNode = event.target.closest?.(".board");
    if (!boardNode) {
      cleanupLinkDragUi();
      cleanupLinkSortIndicator();
    }
  }, true);
}

function getLinkInsertContext(event, targetBoardId) {
  const boardNode = event.target.closest(".board");
  if (!boardNode || boardNode.dataset.boardId !== targetBoardId) return null;

  const links = [...boardNode.querySelectorAll(".bookmark-link")].filter(node => {
    const id = node.dataset.linkId;
    return id && !(draggedLinkContext && id === draggedLinkContext.linkId && targetBoardId === draggedLinkContext.fromBoardId);
  });

  const pointerY = event.clientY;
  let beforeNode = null;

  for (const node of links) {
    const rect = node.getBoundingClientRect();
    const middle = rect.top + rect.height / 2;
    if (pointerY < middle) {
      beforeNode = node;
      break;
    }
  }

  return {
    boardNode,
    beforeLinkId: beforeNode?.dataset.linkId || null,
    beforeNode
  };
}

function ensureLinkSortIndicator() {
  if (linkSortIndicator) return linkSortIndicator;
  linkSortIndicator = document.createElement("div");
  linkSortIndicator.className = "link-sort-indicator";
  return linkSortIndicator;
}

function updateLinkSortIndicator(event, targetBoardId) {
  const context = getLinkInsertContext(event, targetBoardId);
  if (!context) return;

  const indicator = ensureLinkSortIndicator();
  const list = context.boardNode.querySelector(".link-list");
  if (!list) return;

  if (context.beforeNode) {
    list.insertBefore(indicator, context.beforeNode);
  } else {
    list.appendChild(indicator);
  }
}

function cleanupLinkSortIndicator() {
  if (linkSortIndicator) {
    linkSortIndicator.remove();
    linkSortIndicator = null;
  }
}


function cleanupLinkDragUi() {
  document.querySelectorAll(".bookmark-link").forEach(item => item.classList.remove("link-dragging"));
  document.querySelectorAll(".board").forEach(item => item.classList.remove("link-drop-target"));
}


function cleanupBoardDragUi() {
  document.querySelectorAll(".board").forEach(item => item.classList.remove("dragging", "drag-over", "drag-before", "drag-after"));
}


function cleanupLinkDragUi() {
  document.querySelectorAll(".bookmark-link").forEach(item => item.classList.remove("link-dragging"));
  document.querySelectorAll(".board").forEach(item => item.classList.remove("link-drop-target"));
}

async function moveLinkToBoard(fromBoardId, linkId, toBoardId) {
  return moveLinkToBoardPosition(fromBoardId, linkId, toBoardId, null);
}

async function moveLinkToBoardPosition(fromBoardId, linkId, toBoardId, beforeLinkId = null) {
  const page = activePage();
  const fromBoard = page.boards.find(item => item.id === fromBoardId);
  const toBoard = page.boards.find(item => item.id === toBoardId);

  if (!fromBoard || !toBoard) {
    toast(state.settings.language === "en" ? "Board not found." : "Доска не найдена.");
    return;
  }

  const linkIndex = fromBoard.links.findIndex(item => item.id === linkId);
  if (linkIndex < 0) {
    toast(state.settings.language === "en" ? "Bookmark not found." : "Закладка не найдена.");
    return;
  }

  const [link] = fromBoard.links.splice(linkIndex, 1);

  let insertIndex = beforeLinkId
    ? toBoard.links.findIndex(item => item.id === beforeLinkId)
    : toBoard.links.length;

  if (insertIndex < 0) insertIndex = toBoard.links.length;

  toBoard.links.splice(insertIndex, 0, link);

  await persist();
  renderBoards();

  const sameBoard = fromBoardId === toBoardId;
  toast(
    state.settings.language === "en"
      ? (sameBoard ? "Bookmark reordered." : "Bookmark moved.")
      : (sameBoard ? "Порядок ссылок изменён." : "Закладка перенесена.")
  );
}


async function moveBoardBefore(fromBoardId, toBoardId) {
  const page = activePage();
  const fromIndex = page.boards.findIndex(item => item.id === fromBoardId);
  const toIndex = page.boards.findIndex(item => item.id === toBoardId);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

  const [moved] = page.boards.splice(fromIndex, 1);
  const adjustedToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
  page.boards.splice(adjustedToIndex, 0, moved);

  await persist();
  renderBoards();
}

async function moveBoardAround(fromBoardId, targetBoardId, position = "before") {
  const page = activePage();
  const fromIndex = page.boards.findIndex(item => item.id === fromBoardId);
  const targetIndex = page.boards.findIndex(item => item.id === targetBoardId);

  if (fromIndex < 0 || targetIndex < 0 || fromIndex === targetIndex) return;

  const [moved] = page.boards.splice(fromIndex, 1);

  let insertIndex = page.boards.findIndex(item => item.id === targetBoardId);
  if (insertIndex < 0) insertIndex = page.boards.length;
  if (position === "after") insertIndex += 1;

  page.boards.splice(insertIndex, 0, moved);

  await persist();
  renderBoards();
}


function linkTemplate(link, boardId = "") {
  return `
    <a class="bookmark-link" href="${escapeAttr(link.url)}" data-board-id="${escapeAttr(boardId)}" data-link-id="${escapeAttr(link.id)}" draggable="true">
      <img class="favicon favicon-loading" ${faviconAttrs(link.url)} alt="" />
      <span class="link-title" title="${escapeHtml(link.title)}">${escapeHtml(link.title)}</span>
      <span class="link-actions">
        <button type="button" class="icon-btn" data-link-action="edit" title="Редактировать" aria-label="Редактировать">${icon("edit")}</button>
        <button type="button" class="icon-btn" data-link-action="delete" title="В корзину" aria-label="В корзину">${icon("trash")}</button>
      </span>
    </a>
  `;
}

document.addEventListener("load", event => {
  const img = event.target;
  if (!img.classList?.contains("favicon")) return;
  img.classList.remove("favicon-loading");
}, true);

document.addEventListener("error", event => {
  const img = event.target;
  if (!img.classList?.contains("favicon")) return;
  img.classList.remove("favicon-loading");

  if (img.dataset.faviconStage !== "chrome" && img.dataset.chromeSrc) {
    img.dataset.faviconStage = "chrome";
    img.src = img.dataset.chromeSrc;
    return;
  }

  if (img.dataset.faviconStage !== "duck" && img.dataset.duckSrc) {
    img.dataset.faviconStage = "duck";
    img.src = img.dataset.duckSrc;
    return;
  }

  const fallback = document.createElement("span");
  fallback.className = "favicon-fallback";
  fallback.textContent = img.dataset.fallback || "•";
  img.replaceWith(fallback);
}, true);

function toggleInlineAdd(boardId, boardNode) {
  const old = boardNode.querySelector(".inline-add");
  if (old) {
    old.remove();
    return;
  }

  document.querySelectorAll(".inline-add").forEach(item => item.remove());

  const form = document.createElement("div");
  form.className = "inline-add";
  form.innerHTML = `
    <input class="inline-add-input" type="url" placeholder="https://example.com" />
    <div class="inline-add-actions">
      <button class="btn primary" type="button">${state.settings.language === "en" ? "Add" : "Добавить"}</button>
      <button class="btn danger" type="button">${t("cancel")}</button>
    </div>
  `;

  const input = form.querySelector("input");
  const addBtn = form.querySelector(".primary");
  const cancelBtn = form.querySelector(".danger");

  async function submit() {
    const url = normalizeUrl(input.value);
    if (!url) return toast("URL пустой. Такое даже браузер не переварит.");
    const title = await fetchTitle(url) || url.replace(/^https?:\/\//, "");
    const board = activePage().boards.find(item => item.id === boardId);
    board.links.unshift({ id: uid("link"), title, url });
    await persist();
    renderBoards();
    toast("Ссылка добавлена.");
  }

  addBtn.addEventListener("click", submit);
  cancelBtn.addEventListener("click", () => form.remove());
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") submit();
  });

  boardNode.appendChild(form);
  setTimeout(() => input.focus(), 50);
}

async function fetchTitle(url) {
  try {
    const response = await fetch(url, { method: "GET", cache: "no-store" });
    const text = await response.text();
    const match = text.match(/<title[^>]*>([^<]*)<\/title>/i);
    return match ? decodeHtml(match[1]).trim().slice(0, 120) : "";
  } catch {
    return "";
  }
}

async function fetchTitlesForBoard(boardId) {
  const board = activePage().boards.find(item => item.id === boardId);
  if (!board) return;

  toast("Обновляю titles. Интернет делает вид, что доступен...");
  let changed = 0;

  for (const link of board.links) {
    const title = await fetchTitle(link.url);
    if (title && title !== link.title) {
      link.title = title;
      changed++;
    }
  }

  await persist();
  renderBoards();
  toast(changed ? `Обновлено: ${changed}` : "Новые titles не найдены.");
}

function showPageMenu(pageId, trigger) {
  const page = state.pages.find(item => item.id === pageId);
  const anchor = trigger.closest(".page-pill-wrap") || trigger;
  const rect = anchor.getBoundingClientRect();

  if (activeMenuTrigger && activeMenuTrigger !== trigger) {
    activeMenuTrigger.classList.remove("active");
    activeMenuTrigger.closest(".page-pill-wrap")?.classList.remove("menu-open");
  }
  activeMenuTrigger = trigger;
  trigger.classList.add("active");
  trigger.closest(".page-pill-wrap")?.classList.add("menu-open");

  showMenu(rect.left, rect.bottom + 6, `
    <div class="context-menu page-context-menu">
      <button data-menu-action="rename-page">${icon("edit")}<span>${t("renamePage")}</span></button>
      <button data-menu-action="share-page">${icon("share")}<span>${state.settings.language === "en" ? "Share Page" : "Поделиться страницей"}</span></button>
      <div class="divider"></div>
      <button class="danger" data-menu-action="delete-page">${icon("trash")}<span>${state.settings.language === "en" ? "Delete" : "Удалить"}</span></button>
    </div>
  `);

  menuAction("rename-page", () => openPageDialog(page, true));
  menuAction("share-page", () => sharePage(pageId));
  menuAction("delete-page", () => trashPage(pageId));
}

function showBoardMenu(boardId, trigger) {
  const rect = trigger.getBoundingClientRect();
  showMenu(rect.left - 180, rect.bottom + 8, `
    <div class="context-menu">
      <button data-menu-action="open-board">${icon("open")}<span>${t("openAllLinks")}</span></button>
      <button data-menu-action="fetch-titles">${icon("refresh")}<span>${t("fetchAllTitles")}</span></button>
      <button data-menu-action="edit-board">${icon("edit")}<span>${t("editBoard")}</span></button>
      <button data-menu-action="share-board">${icon("share")}<span>${t("shareBoard")}</span></button>
      <div class="divider"></div>
      <button class="danger" data-menu-action="delete-board">${icon("trash")}<span>${t("deleteBoard")}</span></button>
    </div>
  `);

  menuAction("open-board", () => openAllLinks(boardId));
  menuAction("fetch-titles", () => fetchTitlesForBoard(boardId));
  menuAction("edit-board", () => openBoardDialog(activePage().boards.find(item => item.id === boardId)));
  menuAction("share-board", () => shareBoard(boardId));
  menuAction("delete-board", () => trashBoard(boardId));
}

function showMenu(left, top, html) {
  el.menuLayer.innerHTML = html;
  el.menuLayer.classList.remove("hidden");

  const topbar = document.querySelector('.topbar');
  const topbarBottom = topbar ? Math.round(topbar.getBoundingClientRect().bottom) : 0;
  const menuEl = el.menuLayer.firstElementChild;
  const menuWidth = menuEl ? Math.ceil(menuEl.getBoundingClientRect().width || 0) : 236;
  const menuHeight = menuEl ? Math.ceil(menuEl.getBoundingClientRect().height || 0) : 180;

  const resolvedLeft = Math.max(12, Math.min(left, window.innerWidth - Math.max(menuWidth, 236) - 12));
  const resolvedTop = Math.max(topbarBottom + 8, Math.min(top, window.innerHeight - Math.max(menuHeight, 180) - 12));

  el.menuLayer.style.left = `${resolvedLeft}px`;
  el.menuLayer.style.top = `${resolvedTop}px`;
}

function menuAction(action, handler) {
  const button = el.menuLayer.querySelector(`[data-menu-action="${action}"]`);
  if (!button) return;
  button.addEventListener("click", async event => {
    event.preventDefault();
    closeMenu();
    await handler();
  });
}

function closeMenu() {
  el.menuLayer.classList.add("hidden");
  el.menuLayer.innerHTML = "";
  if (activeMenuTrigger) {
    activeMenuTrigger.classList.remove("active");
    activeMenuTrigger.closest(".page-pill-wrap")?.classList.remove("menu-open");
    activeMenuTrigger = null;
  }
}

function openPageDialog(page = null, rename = false) {
  editPageId = page?.id || null;
  el.pageDialogTitle.textContent = rename ? t("renamePage") : t("newPage");
  el.pageTitleField.value = page?.title || "";
  el.pageDialog.showModal();
  setTimeout(() => el.pageTitleField.focus(), 50);
}

async function savePageDialog(event) {
  event.preventDefault();
  const title = el.pageTitleField.value.trim();
  if (!title) return toast("Нужно название страницы.");

  if (editPageId) {
    const page = state.pages.find(item => item.id === editPageId);
    page.title = title;
  } else {
    const newPage = { id: uid("page"), title, boards: [] };
    state.pages.push(newPage);
    state.activePageId = newPage.id;
  }

  await persist();
  el.pageDialog.close();
  renderAll();
}

function openBoardDialog(board = null) {
  if (!board) {
    isAddingBoardInline = true;
    renderBoards();
    setTimeout(() => document.querySelector(".inline-board-input")?.focus(), 30);
    return;
  }

  editBoardId = board.id;
  el.boardDialogTitle.textContent = t("editBoardTitle");
  el.boardTitleField.value = board.title || "";
  el.boardDialog.showModal();
  setTimeout(() => el.boardTitleField.focus(), 50);
}

async function saveBoardDialog(event) {
  event.preventDefault();
  const title = el.boardTitleField.value.trim();
  if (!title) return toast("Нужно название доски.");

  const page = activePage();
  if (editBoardId) {
    const board = page.boards.find(item => item.id === editBoardId);
    board.title = title;
  } else {
    const newBoard = { id: uid("board"), title, links: [] };

    // Если есть целевая колонка — вставляем доску туда правильно
    const targetCol = window._pendingBoardTargetCol;
    window._pendingBoardTargetCol = null;

    if (targetCol && document.contains(targetCol)) {
      // Добавляем в конец выбранной колонки через DOM
      page.boards.push(newBoard);
      await persist();
      el.boardDialog.close();
      renderBoards();
      // После рендера — перемещаем доску в нужную колонку
      setTimeout(async () => {
        const newNode = document.querySelector(`.board[data-board-id="${newBoard.id}"]`);
        if (newNode && targetCol) {
          // Вставляем перед кнопкой добавить
          const addBtn = targetCol.querySelector(".col-add-board-btn");
          if (addBtn) targetCol.insertBefore(newNode, addBtn);
          else targetCol.appendChild(newNode);
          addBoardGaps();
          await readAndSaveBoardOrder();
        }
      }, 50);
      return;
    } else {
      page.boards.push(newBoard);
    }
  }

  await persist();
  el.boardDialog.close();
  renderBoards();
}

function openBookmarkEditDialog(boardId, linkId) {
  const board = activePage().boards.find(item => item.id === boardId);
  const link = board?.links.find(item => item.id === linkId);
  if (!link) return;

  editBookmarkContext = { boardId, linkId };

  el.bookmarkUrlField.value = link.url || "";
  el.bookmarkTitleField.value = link.title || "";
  el.bookmarkDescriptionField.value = link.description || "";
  updateBookmarkDescriptionCounter();

  el.bookmarkEditDialog.showModal();
  setTimeout(() => el.bookmarkUrlField.focus(), 30);
}

function updateBookmarkDescriptionCounter() {
  const max = Number(el.bookmarkDescriptionField.getAttribute("maxlength") || 2000);
  const rest = max - el.bookmarkDescriptionField.value.length;
  const counter = el.bookmarkEditDialog.querySelector(".char-counter");
  if (counter) counter.textContent = String(rest);
}

async function fetchTitleForBookmarkEdit(event) {
  event.preventDefault();
  const url = normalizeUrl(el.bookmarkUrlField.value);
  if (!url) return;

  const title = await fetchTitle(url);
  if (title) {
    el.bookmarkTitleField.value = title;
  } else {
    toast(state.settings.language === "en" ? "Title not found." : "Название не найдено.");
  }
}

async function saveBookmarkEdit(event) {
  event.preventDefault();

  if (!editBookmarkContext) return;

  const board = activePage().boards.find(item => item.id === editBookmarkContext.boardId);
  const link = board?.links.find(item => item.id === editBookmarkContext.linkId);
  if (!link) return;

  const url = normalizeUrl(el.bookmarkUrlField.value);
  const title = el.bookmarkTitleField.value.trim();
  const description = el.bookmarkDescriptionField.value.trim();

  if (!url || !title) {
    toast(state.settings.language === "en" ? "URL and title are required." : "Нужны URL и название.");
    return;
  }

  link.url = url;
  link.title = title;
  link.description = description;

  await persist();
  renderBoards();
  el.bookmarkEditDialog.close();
  toast(state.settings.language === "en" ? "Bookmark updated." : "Закладка обновлена.");
}

async function trashLink(boardId, linkId) {
  const page = activePage();
  const board = page.boards.find(item => item.id === boardId);
  const link = board.links.find(item => item.id === linkId);
  if (!link) return;

  board.links = board.links.filter(item => item.id !== linkId);
  state.trash.links.push({
    ...link,
    deletedAt: Date.now(),
    originalPageId: page.id,
    originalPageTitle: page.title,
    originalBoardId: board.id,
    originalBoardTitle: board.title
  });

  await persist();
  renderBoards();
  toast("Ссылка перемещена в корзину.");
}

async function trashBoard(boardId) {
  const page = activePage();
  const board = page.boards.find(item => item.id === boardId);
  if (!board) return;
  if (!confirm(`Удалить доску «${board.title}» в корзину?`)) return;

  page.boards = page.boards.filter(item => item.id !== boardId);
  state.trash.boards.push({
    ...board,
    deletedAt: Date.now(),
    originalPageId: page.id,
    originalPageTitle: page.title
  });

  await persist();
  renderBoards();
  toast("Доска в корзине.");
}

function openDeletePageDialog(pageId) {
  const page = state.pages.find(item => item.id === pageId);
  if (!page) return;

  pendingDeletePageId = pageId;

  const isEn = (state.settings.language || "ru") === "en";
  if (el.deletePageDialogTitle) {
    el.deletePageDialogTitle.textContent = isEn
      ? `Delete “${page.title}”?`
      : `Удалить страницу «${page.title}»?`;
  }
  if (el.deletePageDialogText) {
    el.deletePageDialogText.textContent = isEn
      ? 'This will move the page and all its boards to trash. You can restore them within 30 days.'
      : 'Страница будет перемещена в корзину вместе со всеми досками. Восстановить её можно в течение 30 дней.';
  }

  if (!el.deletePageDialog.open) el.deletePageDialog.showModal();
}

async function confirmDeletePage(event) {
  event?.preventDefault();
  const pageId = pendingDeletePageId;
  pendingDeletePageId = null;
  if (el.deletePageDialog?.open) el.deletePageDialog.close();
  if (!pageId) return;
  await performTrashPage(pageId);
}

async function performTrashPage(pageId) {
  const page = state.pages.find(item => item.id === pageId);
  if (!page) return;

  state.pages = state.pages.filter(item => item.id !== pageId);
  state.trash.pages.push({
    ...page,
    deletedAt: Date.now()
  });
  state.activePageId = state.pages[0].id;

  await persist();
  renderAll();
  toast((state.settings.language || "ru") === "en" ? "Page moved to trash." : "Страница в корзине.");
}

async function trashPage(pageId) {
  const page = state.pages.find(item => item.id === pageId);
  if (!page) return;
  if (state.pages.length <= 1) {
    return toast((state.settings.language || "ru") === "en"
      ? "You cannot delete the last page."
      : "Последнюю страницу удалить нельзя. Даже хаосу нужны границы.");
  }
  openDeletePageDialog(pageId);
}

async function openAllLinks(boardId) {
  const board = activePage().boards.find(item => item.id === boardId);
  if (!board?.links?.length) return toast("В доске нет ссылок.");
  await chrome.windows.create({ url: board.links.map(link => link.url) });
}

async function shareBoard(boardId) {
  const board = activePage().boards.find(item => item.id === boardId);
  if (!board) return;
  const text = [
    `# ${board.title}`,
    "",
    ...board.links.map(link => `- ${link.title}: ${link.url}`),
    "",
    "JSON:",
    JSON.stringify(board, null, 2)
  ].join("\n");
  await navigator.clipboard.writeText(text);
  toast("Board скопирован в буфер.");
}

async function sharePage(pageId) {
  const page = state.pages.find(item => item.id === pageId);
  if (!page) return;
  const text = [
    `# ${page.title}`,
    "",
    ...page.boards.flatMap(board => [
      `## ${board.title}`,
      ...board.links.map(link => `- ${link.title}: ${link.url}`),
      ""
    ]),
    "JSON:",
    JSON.stringify(page, null, 2)
  ].join("\n");
  await navigator.clipboard.writeText(text);
  toast("Page скопирована в буфер.");
}

async function maybeOpenImportOnboarding() {
  try {
    if (state.onboarding?.importAsked === true) return;

    const page = activePage();
    const hasUserBoards = page.boards?.length && !(page.boards.length === 1 && page.boards[0].title === "Быстрый старт");

    if (hasUserBoards) {
      state.onboarding = { ...(state.onboarding || {}), importAsked: true };
      await persist();
      return;
    }

    setTimeout(() => openImportDialog(true).catch(console.error), 350);
  } catch (error) {
    console.error("Import onboarding failed", error);
  }
}

async function openImportDialog(isOnboarding = false) {
  closeMenu();
  [
    el.settingsDialog,
    el.generalSettingsDialog,
    el.wallpaperAdjustDialog,
    el.tabsDialog,
    el.trashDialog,
    el.pageDialog,
    el.boardDialog
  ].forEach(dialog => {
    try {
      if (dialog?.open) dialog.close();
    } catch {}
  });

  el.importBookmarksDialog.dataset.onboarding = isOnboarding ? "true" : "false";
  el.importFoldersList.innerHTML = `<div class="import-empty">Загружаю папки закладок...</div>`;

  try {
    const folders = await getBookmarkFoldersForImport();

    if (!folders.length) {
      el.importFoldersList.innerHTML = `
        <div class="import-empty">
          Папки с закладками не найдены. Можно пропустить импорт и начать с пустой страницы.
        </div>
      `;
    } else {
      renderImportFolders(folders);
    }

    if (!el.importBookmarksDialog.open) el.importBookmarksDialog.showModal();
  } catch (error) {
    console.error(error);
    el.importFoldersList.innerHTML = `
      <div class="import-empty">
        Не получилось прочитать закладки Chrome. Можно пропустить импорт и начать с пустой страницы.<br><br>
        <small>${escapeHtml(error?.message || String(error))}</small>
      </div>
    `;
    if (!el.importBookmarksDialog.open) el.importBookmarksDialog.showModal();
  }
}

function renderImportFolders(folders) {
  if (!folders.length) {
    el.importFoldersList.innerHTML = `<div class="import-empty">Папки с закладками не найдены.</div>`;
    return;
  }

  el.importFoldersList.innerHTML = folders.map(folder => `
    <label class="import-folder-row">
      <input type="checkbox" value="${escapeAttr(folder.id)}" checked />
      <span class="import-check"></span>
      <span class="import-folder-title">${escapeHtml(folder.title)}</span>
      <span class="import-folder-count">${folder.count} ${t("bookmarksCount")}</span>
    </label>
  `).join("");

  el.importFoldersList._folders = folders;
}

async function importSelectedBookmarkFolders(event) {
  event.preventDefault();

  const selectedIds = [...el.importFoldersList.querySelectorAll("input:checked")].map(input => input.value);
  const folders = el.importFoldersList._folders || [];
  const selected = folders.filter(folder => selectedIds.includes(folder.id));

  if (!selected.length) {
    toast(state.settings.language === "en" ? "Select at least one folder." : "Выбери хотя бы одну папку.");
    return;
  }

  const page = activePage();

  const quickStartIndex = page.boards.findIndex(board => board.title === "Быстрый старт" && board.links.length <= 3);
  if (quickStartIndex >= 0) {
    page.boards.splice(quickStartIndex, 1);
  }

  selected.forEach(folder => {
    page.boards.push({
      id: uid("board"),
      title: folder.title,
      links: folder.links.map(link => ({
        id: uid("link"),
        title: link.title,
        url: link.url
      }))
    });
  });

  state.onboarding = { ...(state.onboarding || {}), importAsked: true };

  await persist();
  renderBoards();
  el.importBookmarksDialog.close();
  toast(state.settings.language === "en" ? "Bookmarks imported." : "Закладки импортированы.");
}

async function skipBookmarkImport(event) {
  event.preventDefault();
  state.onboarding = { ...(state.onboarding || {}), importAsked: true };
  await persist();
  el.importBookmarksDialog.close();
}

async function importBookmarksToActivePage() {
  const boards = await getAllBookmarksAsBoards();
  if (!boards.length) return toast("Закладки Chrome не найдены.");
  activePage().boards = boards;
  await persist();
  renderBoards();
  toast("Закладки импортированы на текущую страницу.");
}

async function saveCurrentWindowAsBoard() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const links = tabs
    .filter(tab => tab.url && !tab.url.startsWith("chrome://"))
    .map(tab => ({
      id: uid("link"),
      title: tab.title || tab.url,
      url: tab.url
    }));

  if (!links.length) return toast("В этом окне нечего сохранять.");

  const title = prompt("Название доски:", `Окно ${new Date().toLocaleDateString("ru-RU")}`);
  if (!title) return;

  activePage().boards.push({ id: uid("board"), title, links });
  await persist();
  renderBoards();
  toast("Текущее окно сохранено как доска.");
}

async function openTabsDialog() {
  await renderTabs();
  el.tabsDialog.showModal();
}

async function renderTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  el.tabsList.innerHTML = "";

  tabs.forEach(tab => {
    const row = document.createElement("div");
    row.className = "tab-row";
    row.innerHTML = `
      <img class="favicon" src="${tab.favIconUrl || extensionFaviconUrl(tab.url || "", 32)}" data-google-src="${googleFaviconUrl(tab.url || "", 32)}" data-duck-src="${duckFaviconUrl(tab.url || "")}" data-fallback="${escapeAttr(hostnameLetter(tab.url || ""))}" data-favicon-stage="${tab.favIconUrl ? "direct" : "chrome"}" alt="" />
      <div>
        <div class="tab-title">${escapeHtml(tab.title || "Без названия")}</div>
        <div class="tab-url">${escapeHtml(tab.url || "")}</div>
      </div>
      <button class="icon-btn" title="Закрыть вкладку">×</button>
    `;

    row.addEventListener("click", event => {
      if (event.target.closest("button")) return;
      chrome.tabs.update(tab.id, { active: true });
      el.tabsDialog.close();
    });

    row.querySelector("button").addEventListener("click", async event => {
      event.stopPropagation();
      await chrome.tabs.remove(tab.id);
      renderTabs();
    });

    el.tabsList.appendChild(row);
  });
}


async function selectDefaultWallpaperForTheme(theme) {
  const current = STARTER_WALLPAPERS.find(item => item.id === state.settings.wallpaperId);
  if (state.settings.wallpaperType === "starter" && current?.theme === theme) {
    if (current.palette) {
      applyDetectedPalette(current.palette);
      if (typeof current.palette.overlay === "number") {
        state.settings.overlay = current.palette.overlay;
        if (el.overlayField) el.overlayField.value = current.palette.overlay;
      }
    }
    return;
  }

  const next = STARTER_WALLPAPERS.find(item => item.theme === theme);
  if (!next) return;

  await setLocalWallpaper("");
  state.settings.wallpaper = "";
  state.settings.wallpaperType = "starter";
  state.settings.wallpaperId = next.id;
  state.settings.activeUserWallpaperId = "";
  selectedWallpaperId = next.id;

  if (next.palette) {
    applyDetectedPalette(next.palette);
    if (typeof next.palette.overlay === "number") {
      state.settings.overlay = next.palette.overlay;
      if (el.overlayField) el.overlayField.value = next.palette.overlay;
    }
  }
}

function bindWallpaperStyleEvents() {
  el.darkThemeBtn.addEventListener("click", async () => {
    setThemeChoice("dark");
    state.settings.theme = "dark";
    await selectDefaultWallpaperForTheme("dark");
    await persist();
    await applySettings();
    await renderWallpaperCards();
    renderBoards();
  });

  el.lightThemeBtn.addEventListener("click", async () => {
    setThemeChoice("light");
    state.settings.theme = "light";
    await selectDefaultWallpaperForTheme("light");
    await persist();
    await applySettings();
    await renderWallpaperCards();
    renderBoards();
  });

  el.overlayField.addEventListener("input", async () => {
    state.settings.overlay = Number(el.overlayField.value) || 62;
    if (state.settings.theme === "light") state.settings.lightOverlayTouched = true;
    await persist();
    await applySettings();
  });

  el.accentField.addEventListener("input", async () => {
    state.settings.primaryColor = el.accentField.value;
    state.settings.accent = el.accentField.value;
    await persist();
    await applySettings();
  });

  el.densityField.addEventListener("change", async () => {
    state.settings.density = el.densityField.value;
    state.settings.compactMode = el.densityField.value === "compact";
    await persist();
    await applySettings();
  });

  el.languageField?.addEventListener("change", async () => {
    state.settings.language = el.languageField.value;
    await persist();
    applyI18n();
  });

  el.wallpaperField.addEventListener("change", async () => {
    const urlValue = el.wallpaperField.value.trim();
    if (!urlValue) return;
    await setLocalWallpaper("");
    state.settings.wallpaper = urlValue;
    state.settings.wallpaperType = "url";
    state.settings.wallpaperId = "";
    await persist();
    await applySettings();
  });

  el.primaryColorField.addEventListener("input", () => {
    state.settings.primaryColor = el.primaryColorField.value;
    state.settings.accent = el.primaryColorField.value;
    syncAdjustFields();
    scheduleBoardStyleApply();
  });

  el.boardColorField.addEventListener("input", () => {
    state.settings.boardColor = el.boardColorField.value;
    syncAdjustFields();
    scheduleBoardStyleApply();
  });

  el.boardOpacityField.addEventListener("input", () => {
    state.settings.boardOpacity = Number(el.boardOpacityField.value);
    syncAdjustFields();
    scheduleBoardStyleApply();
  });

  el.boardBlurField.addEventListener("input", () => {
    state.settings.boardBlur = Number(el.boardBlurField.value);
    syncAdjustFields();
    scheduleBoardStyleApply();
  });

  el.pickPrimaryColorBtn.addEventListener("click", () => pickColor("primary"));
  el.pickBoardColorBtn.addEventListener("click", () => pickColor("board"));

  document.getElementById("resetWallpaperStyleBtn").addEventListener("click", async () => {
    const palette = await extractCurrentWallpaperPalette();
    applyDetectedPalette(palette);
    await persist();
    await applySettings();
    syncAdjustFields();
  });

  setupDialogLightDismiss(el.wallpaperAdjustDialog);
  setupStylePopoverLightDismiss();
}

function setupDialogLightDismiss(dialog) {
  dialog.addEventListener("mousedown", event => {
    if (event.target === dialog) dialog.close();
  });
}

function setupStylePopoverLightDismiss() {
  document.addEventListener("mousedown", event => {
    if (!el.settingsDialog?.open) return;
    if (event.target.closest("#settingsDialog")) return;
    if (event.target.closest("#wallpaperQuickBtn")) return;
    el.settingsDialog.close();
  }, true);
}

function openWallpaperAdjustDialog() {
  closeMenu();
  [
    el.settingsDialog,
    el.generalSettingsDialog,
    el.tabsDialog,
    el.trashDialog,
    el.pageDialog,
    el.boardDialog
  ].forEach(dialog => {
    try {
      if (dialog?.open) dialog.close();
    } catch {}
  });
  syncAdjustFields();
  el.wallpaperAdjustDialog.showModal();
}

function syncAdjustFields() {
  const primary = state.settings.primaryColor || state.settings.accent || "#ffc06d";
  const board = state.settings.boardColor || "#1d1916";
  const opacity = Number(state.settings.boardOpacity ?? 75);
  const blur = Number(state.settings.boardBlur ?? 16);

  el.primaryColorField.value = primary;
  el.primaryColorText.textContent = primary.toUpperCase();
  el.boardColorField.value = board;
  el.boardColorText.textContent = board.toUpperCase();
  el.boardOpacityField.value = String(opacity);
  el.boardOpacityText.textContent = `${opacity}%`;
  el.boardBlurField.value = String(blur);
  el.boardBlurText.textContent = `${blur}px`;
}

async function pickColor(target) {
  if (!("EyeDropper" in window)) {
    toast("Пипетка недоступна в этой версии Chrome.");
    return;
  }

  try {
    const result = await new EyeDropper().open();
    if (!result?.sRGBHex) return;

    if (target === "primary") {
      state.settings.primaryColor = result.sRGBHex;
      state.settings.accent = result.sRGBHex;
    } else {
      state.settings.boardColor = result.sRGBHex;
    }

    syncAdjustFields();
    await persist();
    await applySettings();
  } catch {
    // Пользователь отменил выбор цвета.
  }
}

async function extractCurrentWallpaperPalette() {
  const local = await getLocalWallpaper();
  if (local) return extractPaletteFromImage(local);

  const starter = STARTER_WALLPAPERS.find(item => item.id === state.settings.wallpaperId) || STARTER_WALLPAPERS[0];
  if (starter?.file) {
    return extractPaletteFromImage(chrome.runtime.getURL(starter.file));
  }

  return {
    primaryColor: state.settings.theme === "light" ? "#7E8584" : "#D49A57",
    boardColor: state.settings.theme === "light" ? "#F3F0EA" : "#050807",
    boardOpacity: state.settings.theme === "light" ? 82 : 76,
    boardBlur: state.settings.theme === "light" ? 12 : 16,
    overlay: state.settings.theme === "light" ? 20 : 58
  };
}

function applyDetectedPalette(palette = {}) {
  const theme = state.settings.theme || "dark";
  const isLight = theme === "light";

  // Цвет картинки влияет только на accent и интерактивные элементы.
  // Доски остаются нейтральными, без оттенка картинки.
  const fallbackAccent = isLight ? "#7E8584" : "#D49A57";
  const nextAccent = palette.primaryColor || palette.accent || fallbackAccent;

  state.settings.primaryColor = nextAccent;
  state.settings.accent = nextAccent;
  state.settings.boardColor = isLight ? "#F3F0EA" : "#050807";
  state.settings.boardOpacity = palette.boardOpacity ?? state.settings.boardOpacity ?? (isLight ? 82 : 76);
  state.settings.boardBlur = palette.boardBlur ?? state.settings.boardBlur ?? (isLight ? 12 : 16);

  if (typeof palette.overlay === "number") {
    state.settings.overlay = palette.overlay;
  }
}

async function extractPaletteFromImage(src) {
  try {
    const img = await loadImage(src);
    const canvas = document.createElement("canvas");
    const size = 80;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, size, size);

    const { data } = ctx.getImageData(0, 0, size, size);
    const colors = [];

    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 200) continue;

      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      const saturation = getSaturation(r, g, b);
      colors.push({ r, g, b, brightness, saturation });
    }

    if (!colors.length) throw new Error("No colors");

    const accentCandidates = colors
      .filter(c => c.brightness > 70 && c.brightness < 225 && c.saturation > 0.16)
      .sort((a, b) => (b.saturation * 1.4 + b.brightness / 255) - (a.saturation * 1.4 + a.brightness / 255));

    const darkCandidates = colors
      .filter(c => c.brightness < 115)
      .sort((a, b) => a.brightness - b.brightness);

    const accent = accentCandidates[0] || colors[Math.floor(colors.length * 0.35)];
    const dark = darkCandidates[Math.floor(darkCandidates.length * 0.35)] || colors[0];

    return {
      primaryColor: rgbToHex(accent.r, accent.g, accent.b),
      boardColor: rgbToHex(
        Math.max(8, Math.round(dark.r * 0.55)),
        Math.max(8, Math.round(dark.g * 0.55)),
        Math.max(8, Math.round(dark.b * 0.55))
      ),
      boardOpacity: 75,
      boardBlur: 16
    };
  } catch {
    return {
      primaryColor: "#ffc06d",
      boardColor: "#1d1916",
      boardOpacity: 75,
      boardBlur: 16
    };
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!src.startsWith("data:") && !src.startsWith("chrome-extension:")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function getSaturation(r, g, b) {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  if (max === 0) return 0;
  return (max - min) / max;
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
}

function hexToRgbString(hex) {
  const clean = String(hex || "#1d1916").replace("#", "");
  const full = clean.length === 3 ? clean.split("").map(ch => ch + ch).join("") : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return "29, 25, 22";
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

function currentPaletteFromSettings() {
  const isLight = state.settings.theme === "light";

  return {
    primaryColor: state.settings.primaryColor || state.settings.accent || (isLight ? "#7E8584" : "#D49A57"),
    // boardColor сохраняем нейтральным, чтобы custom wallpaper не красил доски.
    boardColor: isLight ? "#F3F0EA" : "#050807",
    boardOpacity: state.settings.boardOpacity ?? (isLight ? 82 : 76),
    boardBlur: state.settings.boardBlur ?? (isLight ? 12 : 16),
    overlay: state.settings.overlay ?? (isLight ? 20 : 58)
  };
}

async function saveActiveUserWallpaperPalette() {
  if (state.settings.wallpaperType !== "local" || !state.settings.activeUserWallpaperId) return;
  const list = await getUserWallpapers();
  const item = list.find(entry => entry.id === state.settings.activeUserWallpaperId);
  if (!item) return;
  item.palette = currentPaletteFromSettings();
  await setUserWallpapers(list);
}

function scheduleBoardStyleApply() {
  clearTimeout(boardStyleApplyTimer);
  boardStyleApplyTimer = setTimeout(async () => {
    await saveActiveUserWallpaperPalette();
    await persist();
    await applySettings();
  }, 40);
}

function openGeneralSettings() {
  el.compactModeField.checked = state.settings.compactMode === true || state.settings.density === "compact";
  el.groupToolsField.checked = state.settings.groupTools === true;
  el.hideExtraField.checked = state.settings.hideExtraBookmarks === true;
  el.visibleBookmarksField.value = String(state.settings.visibleBookmarks || 10);
  el.shortenTitlesField.checked = state.settings.shortenTitles !== false;
  el.generalSettingsDialog.showModal();
}

async function saveGeneralSettings(event) {
  event.preventDefault();

  state.settings.compactMode = el.compactModeField.checked;
  state.settings.density = el.compactModeField.checked ? "compact" : "comfortable";
  state.settings.groupTools = el.groupToolsField.checked;
  state.settings.hideExtraBookmarks = el.hideExtraField.checked;
  state.settings.visibleBookmarks = Number(el.visibleBookmarksField.value) || 10;
  state.settings.shortenTitles = el.shortenTitlesField.checked;

  await persist();
  await applySettings();
  renderBoards();
  el.generalSettingsDialog.close();
  toast("Настройки сохранены.");
}

async function openSettings() {
  closeMenu();
  [
    el.generalSettingsDialog,
    el.wallpaperAdjustDialog,
    el.tabsDialog,
    el.trashDialog,
    el.pageDialog,
    el.boardDialog
  ].forEach(dialog => {
    try {
      if (dialog?.open) dialog.close();
    } catch {}
  });

  pendingWallpaperDataUrl = null;
  wallpaperSelectionChanged = false;
  wallpaperUrlChanged = false;
  selectedWallpaperId = state.settings.wallpaperType === "starter" ? (state.settings.wallpaperId || STARTER_WALLPAPERS.find(item => item.theme === (state.settings.theme || "dark"))?.id || STARTER_WALLPAPERS[0].id) : "";
  selectedTheme = state.settings.theme || "dark";

  if (el.wallpaperField) el.wallpaperField.value = state.settings.wallpaper || "";
  if (el.wallpaperFileField) el.wallpaperFileField.value = "";
  if (el.accentField) el.accentField.value = state.settings.primaryColor || state.settings.accent || "#ffc06d";
  if (el.densityField) el.densityField.value = state.settings.density || "comfortable";
  if (el.languageField) el.languageField.value = state.settings.language || "ru";
  if (el.overlayField) el.overlayField.value = state.settings.overlay ?? 62;

  setThemeChoice(selectedTheme, false);
  await renderWallpaperCards();
  syncAdjustFields();

  if (!el.settingsDialog.open) el.settingsDialog.show();
}

function setThemeChoice(theme, preview = true) {
  selectedTheme = theme;
  el.darkThemeBtn.classList.toggle("active", theme === "dark");
  el.lightThemeBtn.classList.toggle("active", theme === "light");
  if (preview) document.body.classList.toggle("light", theme === "light");
}

function wallpaperPreviewSrc(wallpaper) {
  if (!wallpaper) return "";
  if (wallpaper.dataUrl) return wallpaper.dataUrl;
  if (wallpaper.file) return chrome.runtime.getURL(wallpaper.file);
  if (wallpaper.url) return wallpaper.url;
  return "";
}

async function renderUserWallpapers() {
  if (!el.userWallpapersSection || !el.userWallpapersGrid) return;

  const list = await getUserWallpapers();
  const activeId = state.settings.activeUserWallpaperId || "";

  el.userWallpapersSection.classList.toggle("hidden", list.length === 0);
  el.userWallpaperCount.textContent = String(list.length);

  if (!list.length) {
    el.userWallpapersGrid.innerHTML = "";
    return;
  }

  const sorted = [...list].sort((a, b) => Number(a.archived === true) - Number(b.archived === true) || (b.createdAt || 0) - (a.createdAt || 0));

  el.userWallpapersGrid.innerHTML = sorted.map(item => `
    <article class="user-wallpaper-card ${item.id === activeId ? "active" : ""} ${item.archived ? "archived" : ""}" data-wallpaper-id="${escapeAttr(item.id)}">
      <button type="button" class="user-wallpaper-preview" title="${escapeHtml(item.title || "")}">
        <img src="${escapeAttr(item.dataUrl)}" alt="${escapeAttr(item.title || "Uploaded wallpaper")}" loading="lazy" />
      </button>
      <div class="user-wallpaper-actions">
        <button type="button" data-action="edit" title="Настроить">${icon("edit")}</button>
        <button type="button" data-action="use" title="Использовать">${icon("use")}</button>
        <button type="button" data-action="delete" class="danger" title="Удалить">${icon("trash")}</button>
        <button type="button" data-action="archive" class="archive" title="Архивировать">${item.archived ? "Вернуть" : "Архив"}</button>
      </div>
    </article>
  `).join("");

  el.userWallpapersGrid.querySelectorAll(".user-wallpaper-card").forEach(card => {
    const id = card.dataset.wallpaperId;

    card.querySelector(".user-wallpaper-preview").addEventListener("click", () => useUserWallpaper(id));

    card.querySelectorAll("button[data-action]").forEach(button => {
      button.addEventListener("click", async () => {
        const action = button.dataset.action;
        if (action === "use") await useUserWallpaper(id);
        if (action === "edit") await editUserWallpaper(id);
        if (action === "delete") await deleteUserWallpaper(id);
        if (action === "archive") await archiveUserWallpaper(id);
      });
    });
  });
}

async function useUserWallpaper(id) {
  const list = await getUserWallpapers();
  const item = list.find(entry => entry.id === id);
  if (!item) return;

  await setLocalWallpaper(item.dataUrl);
  state.settings.wallpaper = "";
  state.settings.wallpaperType = "local";
  state.settings.wallpaperId = "";
  state.settings.activeUserWallpaperId = id;

  if (item.palette) {
    applyDetectedPalette(item.palette);
  } else {
    const palette = await extractPaletteFromImage(item.dataUrl);
    item.palette = {
      ...palette,
      boardColor: state.settings.theme === "light" ? "#F3F0EA" : "#050807"
    };
    applyDetectedPalette(item.palette);
    await setUserWallpapers(list);
  }

  syncAdjustFields();
  await persist();
  await applySettings();
  await renderWallpaperCards();
}

async function editUserWallpaper(id) {
  await useUserWallpaper(id);
  if (el.settingsDialog?.open) el.settingsDialog.close();
  openWallpaperAdjustDialog();
}

async function deleteUserWallpaper(id) {
  const list = await getUserWallpapers();
  const next = list.filter(item => item.id !== id);
  await setUserWallpapers(next);

  if (state.settings.activeUserWallpaperId === id) {
    state.settings.activeUserWallpaperId = "";
    await setLocalWallpaper("");
    const first = STARTER_WALLPAPERS[0];
    state.settings.wallpaperType = "starter";
    state.settings.wallpaperId = first.id;
    applyDetectedPalette(first.palette);
  }

  await persist();
  await applySettings();
  await renderWallpaperCards();
}

async function archiveUserWallpaper(id) {
  const list = await getUserWallpapers();
  const item = list.find(entry => entry.id === id);
  if (!item) return;
  item.archived = !item.archived;
  await setUserWallpapers(list);
  await renderWallpaperCards();
}

async function renderWallpaperCards() {
  await renderUserWallpapers();

  const activeTheme = selectedTheme || state.settings.theme || "dark";
  const visibleWallpapers = STARTER_WALLPAPERS.filter(wallpaper => (wallpaper.theme || "dark") === activeTheme);

  document.getElementById("wallpaperCount").textContent = visibleWallpapers.length;

  el.wallpapersGrid.innerHTML = `
    <div class="wallpaper-group theme-active">
      <div class="wallpaper-group-grid">
        ${visibleWallpapers.map(wallpaper => `
          <button class="wallpaper-card ${selectedWallpaperId === wallpaper.id ? "active" : ""}" data-wallpaper-id="${escapeAttr(wallpaper.id)}" type="button">
            <span class="wallpaper-preview">
                <img src="${escapeAttr(wallpaperPreviewSrc(wallpaper))}" alt="${escapeAttr(wallpaper.title)}" loading="lazy" />
              </span>
            <span class="wallpaper-title">${escapeHtml(wallpaper.title)}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;

  el.wallpapersGrid.querySelectorAll(".wallpaper-card").forEach(card => {
    card.addEventListener("click", () => {
      const wallpaper = STARTER_WALLPAPERS.find(item => item.id === card.dataset.wallpaperId);
      if (!wallpaper) return;

      selectedWallpaperId = wallpaper.id;
      pendingWallpaperDataUrl = null;
      wallpaperSelectionChanged = true;
      wallpaperUrlChanged = false;

      if (el.wallpaperField) el.wallpaperField.value = "";

      setLocalWallpaper("").then(async () => {
        state.settings.wallpaper = "";
        state.settings.wallpaperType = "starter";
        state.settings.wallpaperId = selectedWallpaperId;
        state.settings.activeUserWallpaperId = "";

        if (wallpaper.theme) {
          state.settings.theme = wallpaper.theme;
          selectedTheme = wallpaper.theme;
          setThemeChoice(wallpaper.theme, false);
        }

        if (wallpaper.palette) {
          applyDetectedPalette(wallpaper.palette);
          if (typeof wallpaper.palette.overlay === "number") {
            state.settings.overlay = wallpaper.palette.overlay;
            if (el.overlayField) el.overlayField.value = wallpaper.palette.overlay;
          }
        }

        syncAdjustFields();
        await applySettings();
        await persist();
        await renderWallpaperCards();
        syncAdjustFields();
        renderBoards();
      });
    });
  });
}


async function saveSettings(event) {
  event.preventDefault();

  state.settings.theme = selectedTheme;
  state.settings.accent = el.accentField.value;
  state.settings.density = el.densityField.value;
  state.settings.language = el.languageField?.value || "ru";
  state.settings.overlay = Number(el.overlayField.value) || 62;

  const urlValue = el.wallpaperField.value.trim();

  if (pendingWallpaperDataUrl) {
    const userWallpaperId = uid("wallpaper");
    await addUserWallpaper({
      id: userWallpaperId,
      title: file.name || "Uploaded wallpaper",
      dataUrl: pendingWallpaperDataUrl,
      archived: false,
      createdAt: Date.now(),
      palette: null
    });

    await setLocalWallpaper(pendingWallpaperDataUrl);
    state.settings.wallpaper = "";
    state.settings.wallpaperType = "local";
    state.settings.wallpaperId = "";
    state.settings.activeUserWallpaperId = userWallpaperId;
  } else if (wallpaperUrlChanged && urlValue) {
    await setLocalWallpaper("");
    state.settings.wallpaper = urlValue;
    state.settings.wallpaperType = "url";
    state.settings.wallpaperId = "";
  } else if (wallpaperSelectionChanged && selectedWallpaperId) {
    await setLocalWallpaper("");
    state.settings.wallpaper = "";
    state.settings.wallpaperType = "starter";
    state.settings.wallpaperId = selectedWallpaperId;
  }

  await persist();
  await applySettings();
  applyI18n();
  el.settingsDialog.close();
  toast("Стиль сохранён.");
}

async function clearWallpaper() {
  pendingWallpaperDataUrl = null;
  selectedWallpaperId = "default";
  el.wallpaperField.value = "";
  el.wallpaperFileField.value = "";
  state.settings.wallpaper = "";
  state.settings.wallpaperType = "starter";
  state.settings.wallpaperId = "default";
  await setLocalWallpaper("");
  await persist();
  await applySettings();
  renderWallpaperCards();
  toast("Фон сброшен.");
}

function openTrashDialog() {
  cleanupTrash(state);
  renderTrash();
  el.trashDialog.showModal();
}

function renderTrash() {
  renderTrashGroup(el.trashLinksList, state.trash.links, "links");
  renderTrashGroup(el.trashBoardsList, state.trash.boards, "boards");
  renderTrashGroup(el.trashPagesList, state.trash.pages, "pages");
}

function renderTrashGroup(container, items, type) {
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = `<div class="empty">Пусто</div>`;
    return;
  }

  items.forEach(item => {
    const node = document.createElement("div");
    node.className = "trash-item";
    node.innerHTML = `
      <div>
        <div class="trash-item-title">${escapeHtml(item.title)}</div>
        <div class="trash-item-meta">
          Удалено: ${new Date(item.deletedAt).toLocaleString("ru-RU")}<br>
          ${trashMeta(item, type)}
        </div>
      </div>
      <div class="trash-actions">
        <button class="btn warning" type="button" data-action="restore">Восстановить</button>
        <button class="btn danger" type="button" data-action="delete">Удалить</button>
      </div>
    `;

    node.querySelector('[data-action="restore"]').addEventListener("click", () => restoreTrashItem(type, item.id));
    node.querySelector('[data-action="delete"]').addEventListener("click", () => deleteTrashItem(type, item.id));

    container.appendChild(node);
  });
}

function trashMeta(item, type) {
  if (type === "links") return `Доска: ${escapeHtml(item.originalBoardTitle || "неизвестная доска")} · Страница: ${escapeHtml(item.originalPageTitle || "неизвестная страница")}`;
  if (type === "boards") return `Страница: ${escapeHtml(item.originalPageTitle || "неизвестная страница")}`;
  return `Страница с ${(item.boards || []).length} досками`;
}

async function restoreTrashItem(type, id) {
  const list = state.trash[type];
  const item = list.find(entry => entry.id === id);
  if (!item) return;

  if (type === "links") {
    let page = state.pages.find(page => page.id === item.originalPageId) || activePage();
    let board = page.boards.find(board => board.id === item.originalBoardId);
    if (!board) {
      board = { id: uid("board"), title: item.originalBoardTitle || "Восстановлено", links: [] };
      page.boards.push(board);
    }
    const { deletedAt, originalPageId, originalPageTitle, originalBoardId, originalBoardTitle, ...link } = item;
    board.links.push(link);
  }

  if (type === "boards") {
    let page = state.pages.find(page => page.id === item.originalPageId) || activePage();
    const { deletedAt, originalPageId, originalPageTitle, ...board } = item;
    page.boards.push(board);
  }

  if (type === "pages") {
    const { deletedAt, ...page } = item;
    state.pages.push(page);
  }

  state.trash[type] = state.trash[type].filter(entry => entry.id !== id);
  await persist();
  renderAll();
  renderTrash();
  toast("Восстановлено.");
}

async function deleteTrashItem(type, id) {
  state.trash[type] = state.trash[type].filter(entry => entry.id !== id);
  await persist();
  renderTrash();
  toast("Удалено навсегда.");
}

async function emptyTrash() {
  if (!confirm("Очистить корзину полностью?")) return;
  state.trash = { links: [], boards: [], pages: [] };
  await persist();
  renderTrash();
  toast("Корзина очищена.");
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sqwizzey-tab-backup-${new Date().toISOString().slice(0,10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const parsed = JSON.parse(reader.result);
      state = migrateState(parsed);
      ensureActivePage();
      await persist();
      await applySettings();
      renderAll();
      toast("Импорт выполнен.");
    } catch {
      toast("Файл не похож на бэкап этого расширения.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

async function persist() {
  cleanupTrash(state);
  await syncStore.set(state);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function decodeHtml(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  return doc.documentElement.textContent || "";
}

function toast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.toast.classList.remove("show"), 2300);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}


/* ////////////////////////////////////////////////////
   v2.9.16 optimized link drag-and-drop
   Причина лагов: dragover дёргал querySelectorAll/getBoundingClientRect/DOM insert на каждый пиксель.
   Теперь считаем позиции один раз на доску, обновляем DOM только через requestAnimationFrame и только когда меняется место вставки.
//////////////////////////////////////////////////// */

/* ====================================================
   SQWIZZEY CLEAN PATCH v2.9.66
   Один блок. Никаких цепочек. Никаких дублирований.
   ==================================================== */

// === COLUMN LAYOUT: всегда 4 колонки ===
getBoardLayoutColumnCount = function() { return 4; };

createStableBoardColumns = function(totalItems) {
  const perColumn = Math.max(1, Math.ceil(Math.max(1, totalItems || 1) / 4));
  const columns = [];
  el.boardsGrid.innerHTML = "";
  el.boardsGrid.dataset.columns = "4";
  el.boardsGrid.style.setProperty("display", "grid", "important");
  el.boardsGrid.style.setProperty("grid-template-columns", "repeat(4, minmax(0, 1fr))", "important");
  el.boardsGrid.style.setProperty("align-items", "start", "important");
  el.boardsGrid.style.setProperty("gap", "16px", "important");
  el.boardsGrid.style.setProperty("width", "100%", "important");
  el.boardsGrid.style.setProperty("max-width", "min(100%, 1200px)", "important");
  el.boardsGrid.style.setProperty("margin", "0 auto", "important");
  el.boardsGrid.style.setProperty("columns", "unset", "important");
  for (let i = 0; i < 4; i++) {
    const col = document.createElement("div");
    col.className = "board-column";
    col.dataset.columnIndex = String(i);
    el.boardsGrid.appendChild(col);
    columns.push(col);
  }
  return { columns, perColumn };
};

appendBoardLayoutItem = function(layout, node, index) {
  // Round-robin: 0→col0, 1→col1, 2→col2, 3→col3, 4→col0...
  // All 4 columns always get boards from the start
  const col = index % layout.columns.length;
  layout.columns[col].appendChild(node);
};

// === GAP ZONES: под каждой доской ===
function addBoardGaps() {
  document.querySelectorAll(".board-drop-gap, .col-add-board-btn").forEach(g => g.remove());

  document.querySelectorAll(".board-column").forEach((col, colIndex) => {
    const boards = [...col.querySelectorAll(":scope > .board")];

    // Gap под каждой доской
    boards.forEach(board => {
      col.insertBefore(makeGap(board.dataset.boardId), board.nextSibling);
    });

    // Кнопка "Добавить доску" — всегда в каждой колонке (и в пустой тоже)
    const addBtn = document.createElement("button");
    addBtn.className = "col-add-board-btn";
    addBtn.type = "button";
    addBtn.textContent = "+ Добавить доску";
    addBtn.addEventListener("click", () => {
      // Запоминаем целевую колонку
      addBtn._targetCol = col;
      editBoardId = null;
      el.boardDialogTitle.textContent = t("newBoard");
      el.boardTitleField.value = "";
      el.boardDialog.showModal();
      setTimeout(() => el.boardTitleField.focus(), 50);
      // Сохраняем ссылку на колонку глобально для saveBoardDialog
      window._pendingBoardTargetCol = col;
    });
    col.appendChild(addBtn);
  });
}

function makeGap(afterId) {
  const g = document.createElement("div");
  g.className = "board-drop-gap";
  g.dataset.gapAfter = afterId;
  bindGap(g);
  return g;
}

function makeEmptyGap(col) {
  const g = document.createElement("div");
  g.className = "board-drop-gap empty-col-gap";
  g.addEventListener("dragover", ev => {
    if (!draggedBoardId) return;
    ev.preventDefault(); ev.stopPropagation();
    ev.dataTransfer.dropEffect = "move";
    clearActiveGaps(g);
    g.classList.add("drop-active");
  });
  g.addEventListener("dragleave", ev => {
    if (!g.contains(ev.relatedTarget)) g.classList.remove("drop-active");
  });
  g.addEventListener("drop", async ev => {
    ev.preventDefault(); ev.stopImmediatePropagation();
    g.classList.remove("drop-active");
    if (!draggedBoardId) return;
    const node = document.querySelector(`.board[data-board-id="${draggedBoardId}"]`);
    if (!node) return;
    draggedBoardId = null; cleanupBoardDragUi();
    col.insertBefore(node, g);
    addBoardGaps();
    await readAndSaveBoardOrder();
  });
  return g;
}

function bindGap(g) {
  const afterId = g.dataset.gapAfter;
  g.addEventListener("dragover", ev => {
    if (!draggedBoardId || draggedBoardId === afterId) return;
    ev.preventDefault(); ev.stopPropagation();
    ev.dataTransfer.dropEffect = "move";
    clearActiveGaps(g);
    g.classList.add("drop-active");
  });
  g.addEventListener("dragleave", ev => {
    if (!g.contains(ev.relatedTarget)) g.classList.remove("drop-active");
  });
  g.addEventListener("drop", async ev => {
    ev.preventDefault(); ev.stopImmediatePropagation();
    g.classList.remove("drop-active");
    if (!draggedBoardId || draggedBoardId === afterId) return;
    const node = document.querySelector(`.board[data-board-id="${draggedBoardId}"]`);
    const target = document.querySelector(`.board[data-board-id="${afterId}"]`);
    if (!node || !target) return;
    draggedBoardId = null; cleanupBoardDragUi();
    target.after(node);
    addBoardGaps();
    await readAndSaveBoardOrder();
  });
}

function clearActiveGaps(except) {
  document.querySelectorAll(".board-drop-gap.drop-active").forEach(g => {
    if (g !== except) g.classList.remove("drop-active");
  });
}

// Читает порядок из DOM и сохраняет в state
async function readAndSaveBoardOrder() {
  const page = activePage();
  const newOrder = [];
  document.querySelectorAll(".board-column").forEach(col => {
    col.querySelectorAll(":scope > .board[data-board-id]").forEach(el => {
      const b = page.boards.find(x => x.id === el.dataset.boardId);
      if (b && !newOrder.includes(b)) newOrder.push(b);
    });
  });
  if (newOrder.length === page.boards.length) {
    page.boards = newOrder;
    await persist();
  }
}

// === DOM-BASED BOARD DRAG ===
// Перехватываем на document в capture фазе — перебивает старые обработчики
document.addEventListener("dragover", ev => {
  if (!draggedBoardId || draggedLinkContext) return;
  // Gap зоны обрабатывают себя сами — не перехватываем
  if (ev.target.closest?.(".board-drop-gap")) return;
  const board = ev.target.closest?.(".board");
  if (!board || board.dataset.boardId === draggedBoardId) return;
  ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation();
  ev.dataTransfer.dropEffect = "move";
  document.querySelectorAll(".board.drag-over").forEach(b => {
    if (b !== board) b.classList.remove("drag-over", "drag-before", "drag-after");
  });
  const rect = board.getBoundingClientRect();
  const after = ev.clientY > rect.top + rect.height / 2;
  board.classList.toggle("drag-before", !after);
  board.classList.toggle("drag-after", after);
  board.classList.add("drag-over");
}, true);

document.addEventListener("drop", async ev => {
  if (!draggedBoardId || draggedLinkContext) return;
  // Gap зоны обрабатывают себя сами — не перехватываем
  if (ev.target.closest?.(".board-drop-gap")) return;
  const board = ev.target.closest?.(".board");
  if (!board || board.dataset.boardId === draggedBoardId) return;
  ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation();
  const node = document.querySelector(`.board[data-board-id="${draggedBoardId}"]`);
  if (!node) return;
  const rect = board.getBoundingClientRect();
  const after = ev.clientY > rect.top + rect.height / 2;
  draggedBoardId = null; cleanupBoardDragUi();
  if (after) board.after(node); else board.before(node);
  addBoardGaps();
  await readAndSaveBoardOrder();
}, true);

// === HOOK renderBoards ONCE ===
const _sqwOrigRenderBoards = renderBoards;
renderBoards = function() {
  _sqwOrigRenderBoards();
  addBoardGaps();
  // Enforce grid inline
  if (el.boardsGrid) {
    el.boardsGrid.style.setProperty("display", "grid", "important");
    el.boardsGrid.style.setProperty("grid-template-columns", "repeat(4, minmax(0, 1fr))", "important");
    el.boardsGrid.style.setProperty("gap", "16px", "important");
    el.boardsGrid.style.setProperty("max-width", "min(100%, 1200px)", "important");
    el.boardsGrid.style.setProperty("margin", "0 auto", "important");
    el.boardsGrid.style.setProperty("columns", "unset", "important");
  }
};

// === HOOK renderPages ONCE ===
const _sqwOrigRenderPages = renderPages;
renderPages = function() {
  _sqwOrigRenderPages();
  document.querySelectorAll(".page-pill-wrap").forEach(wrap => {
    const title = wrap.querySelector(".page-title")?.textContent || "";
    const w = Math.max(96, Math.min(210, 64 + Array.from(title).length * 9));
    wrap.style.setProperty("--page-pill-width", `${w}px`);
  });
};

// === INIT ===
queueMicrotask(() => {
  try { if (state?.pages?.length) { renderBoards(); renderPages(); } }
  catch(e) { console.warn("sqwizzey clean patch init", e); }
});
