
const STORAGE_PREFIX = "dsp_v3_";
const META_KEY = STORAGE_PREFIX + "meta";
const CHUNK_KEY = STORAGE_PREFIX + "chunk_";
const LOCAL_WALLPAPER_KEY = STORAGE_PREFIX + "local_wallpaper";
const LOCAL_USER_WALLPAPERS_KEY = STORAGE_PREFIX + "user_wallpapers";
const LOCAL_STATE_FALLBACK_KEY = STORAGE_PREFIX + "state_local_fallback";
const CHUNK_SIZE = 3500;
const TRASH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const STARTER_WALLPAPERS = [
  {
    "id": "light-clouds",
    "title": "Clouds",
    "theme": "light",
    "file": "wallpapers/light-clouds.jpg",
    "palette": {
      "primaryColor": "#2F6796",
      "boardColor": "#EAF0F4",
      "boardOpacity": 25,
      "boardBlur": 9,
      "overlay": 0
    }
  },
  {
    "id": "light-mist",
    "title": "Mist",
    "theme": "light",
    "file": "wallpapers/light-mist.png",
    "palette": {
      "primaryColor": "#6F7472",
      "boardColor": "#ECECEA",
      "boardOpacity": 25,
      "boardBlur": 9,
      "overlay": 0
    }
  },
  {
    "id": "light-audi",
    "title": "Motion",
    "theme": "light",
    "file": "wallpapers/light-audi.jpg",
    "palette": {
      "primaryColor": "#7E8584",
      "boardColor": "#F1F1EE",
      "boardOpacity": 25,
      "boardBlur": 9,
      "overlay": 0
    }
  },
  {
    "id": "dark-forest",
    "title": "Forest",
    "theme": "dark",
    "file": "wallpapers/dark-forest.jpg",
    "palette": {
      "primaryColor": "#D49A57",
      "boardColor": "#18231F",
      "boardOpacity": 25,
      "boardBlur": 12,
      "overlay": 0
    }
  },
  {
    "id": "dark-stars",
    "title": "Stars",
    "theme": "dark",
    "file": "wallpapers/dark-stars.jpg",
    "palette": {
      "primaryColor": "#8E8CFF",
      "boardColor": "#17152A",
      "boardOpacity": 25,
      "boardBlur": 12,
      "overlay": 0
    }
  },
  {
    "id": "dark-blackhole",
    "title": "Red Clash",
    "theme": "dark",
    "file": "wallpapers/dark-blackhole.png",
    "palette": {
      "primaryColor": "#FF3B1F",
      "boardColor": "#0E0808",
      "boardOpacity": 25,
      "boardBlur": 12,
      "overlay": 0
    }
  }
];

function wallpaperCss(wallpaper) {
  if (!wallpaper) return "";
  if (wallpaper.css) return wallpaper.css;
  if (wallpaper.file) return `url("${chrome.runtime.getURL(wallpaper.file)}")`;
  return "";
}

function wallpaperCss(wallpaper) {
  if (!wallpaper) return "";
  if (wallpaper.css) return wallpaper.css;
  if (wallpaper.file) return `url("${chrome.runtime.getURL(wallpaper.file)}")`;
  return "";
}

function wallpaperCss(wallpaper) {
  if (!wallpaper) return "";
  if (wallpaper.css) return wallpaper.css;
  if (wallpaper.file) return `url("${chrome.runtime.getURL(wallpaper.file)}")`;
  return "";
}

function wallpaperCss(wallpaper) {
  if (!wallpaper) return "";
  if (wallpaper.css) return wallpaper.css;
  if (wallpaper.file) return `url("${chrome.runtime.getURL(wallpaper.file)}")`;
  return "";
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function extensionFaviconUrl(url, size = 32) {
  const safeUrl = normalizeUrl(url);
  if (!safeUrl) return "";
  return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(safeUrl)}&size=${size}`;
}

function googleFaviconUrl(url, size = 32) {
  const safeUrl = normalizeUrl(url);
  if (!safeUrl) return "";
  return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(safeUrl)}&sz=${size}`;
}

function duckFaviconUrl(url) {
  try {
    const host = new URL(normalizeUrl(url)).hostname;
    return `https://icons.duckduckgo.com/ip3/${host}.ico`;
  } catch {
    return "";
  }
}

function faviconAttrs(url) {
  return `src="${googleFaviconUrl(url, 32)}" data-chrome-src="${extensionFaviconUrl(url, 32)}" data-duck-src="${duckFaviconUrl(url)}" data-fallback="${hostnameLetter(url)}" data-favicon-stage="google"`;
}

function normalizeUrl(url) {
  const value = String(url || "").trim();
  if (!value) return "";
  if (/^(https?:|chrome:|edge:|file:)/i.test(value)) return value;
  return `https://${value}`;
}

function hostnameLetter(url) {
  try {
    return new URL(normalizeUrl(url)).hostname.replace(/^www\./, "").slice(0, 1).toUpperCase() || "•";
  } catch {
    return "•";
  }
}

function defaultState() {
  const pageId = uid("page");
  return {
    pages: [
      {
        id: pageId,
        title: "Home",
        boards: [
          {
            id: uid("board"),
            title: "Быстрый старт",
            links: [
              { id: uid("link"), title: "Google", url: "https://google.com" },
              { id: uid("link"), title: "YouTube", url: "https://youtube.com" },
              { id: uid("link"), title: "ChatGPT", url: "https://chatgpt.com" }
            ]
          }
        ]
      }
    ],
    activePageId: pageId,
    trash: {
      links: [],
      boards: [],
      pages: []
    },
    settings: {
      theme: "dark",
      wallpaperType: "starter",
      wallpaperId: "dark-forest",
      wallpaper: "",
      accent: "#55c785",
      density: "comfortable",
      overlay: 62,
      language: "ru",
      compactMode: false,
      groupTools: false,
      hideExtraBookmarks: true,
      visibleBookmarks: 10,
      shortenTitles: true,
      primaryColor: "#D49A57",
      boardColor: "#18231F",
      boardOpacity: 75,
      boardBlur: 16,
      activeUserWallpaperId: ""
    },
    onboarding: {
      importAsked: false
    },
    updatedAt: Date.now()
  };
}

function migrateState(raw) {
  const base = defaultState();

  if (!raw) return base;

  if (Array.isArray(raw.pages)) {
    return {
      ...base,
      ...raw,
      trash: {
        links: raw.trash?.links || [],
        boards: raw.trash?.boards || [],
        pages: raw.trash?.pages || []
      },
      settings: { ...base.settings, ...(raw.settings || {}) }
    };
  }

  if (Array.isArray(raw.boards)) {
    base.pages[0].boards = raw.boards;
    base.settings = { ...base.settings, ...(raw.settings || {}) };
    return base;
  }

  return base;
}

function chunkStringByBytes(value, maxBytes) {
  const encoder = new TextEncoder();
  const chunks = [];
  let current = "";

  for (const char of String(value || "")) {
    const next = current + char;
    if (current && encoder.encode(next).length > maxBytes) {
      chunks.push(current);
      current = char;
    } else {
      current = next;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

const syncStore = {
  async get() {
    try {
      const metaObj = await chrome.storage.sync.get(META_KEY);
      const meta = metaObj[META_KEY];
      if (meta && meta.chunks) {
        const keys = Array.from({ length: meta.chunks }, (_, i) => CHUNK_KEY + i);
        const chunkObj = await chrome.storage.sync.get(keys);
        const raw = keys.map(key => chunkObj[key] || "").join("");
        if (raw) {
          try {
            return JSON.parse(raw);
          } catch (error) {
            console.error("Cannot parse synced state", error);
          }
        }
      }
    } catch (error) {
      console.warn("Cannot read chrome.storage.sync state, using local fallback", error);
    }

    try {
      const localObj = await chrome.storage.local.get(LOCAL_STATE_FALLBACK_KEY);
      return localObj[LOCAL_STATE_FALLBACK_KEY] || null;
    } catch (error) {
      console.error("Cannot read local state fallback", error);
      return null;
    }
  },

  async set(state) {
    const safeState = JSON.parse(JSON.stringify({ ...state, updatedAt: Date.now() }));
    const raw = JSON.stringify(safeState);
    const chunks = chunkStringByBytes(raw, CHUNK_SIZE);

    try {
      const previous = await chrome.storage.sync.get(META_KEY);
      const previousChunks = previous[META_KEY]?.chunks || 0;
      const toRemove = [];
      for (let i = chunks.length; i < previousChunks; i++) {
        toRemove.push(CHUNK_KEY + i);
      }
      if (toRemove.length) await chrome.storage.sync.remove(toRemove);

      const payload = {
        [META_KEY]: {
          chunks: chunks.length,
          updatedAt: Date.now(),
          version: 3
        }
      };
      chunks.forEach((chunk, i) => {
        payload[CHUNK_KEY + i] = chunk;
      });

      await chrome.storage.sync.set(payload);
      try {
        await chrome.storage.local.remove(LOCAL_STATE_FALLBACK_KEY);
      } catch {}
      return true;
    } catch (error) {
      console.warn("chrome.storage.sync quota/write failed, saving state locally", error);
      await chrome.storage.local.set({ [LOCAL_STATE_FALLBACK_KEY]: safeState });
      return true;
    }
  }
};

async function getLocalWallpaper() {
  const obj = await chrome.storage.local.get(LOCAL_WALLPAPER_KEY);
  return obj[LOCAL_WALLPAPER_KEY] || "";
}

async function setLocalWallpaper(dataUrl) {
  if (dataUrl) {
    await chrome.storage.local.set({ [LOCAL_WALLPAPER_KEY]: dataUrl });
  } else {
    await chrome.storage.local.remove(LOCAL_WALLPAPER_KEY);
  }
}


async function getUserWallpapers() {
  const obj = await chrome.storage.local.get(LOCAL_USER_WALLPAPERS_KEY);
  const list = obj[LOCAL_USER_WALLPAPERS_KEY];
  return Array.isArray(list) ? list : [];
}

async function setUserWallpapers(list) {
  await chrome.storage.local.set({ [LOCAL_USER_WALLPAPERS_KEY]: Array.isArray(list) ? list : [] });
}

async function addUserWallpaper(item) {
  const list = await getUserWallpapers();
  list.unshift(item);
  await setUserWallpapers(list);
  return list;
}

async function getAllBookmarksAsBoards() {
  const roots = await chrome.bookmarks.getTree();
  const boards = [];

  function bookmarksFromNode(node, limit = 120) {
    const result = [];

    function walk(current) {
      if (result.length >= limit) return;
      if (current.url) {
        result.push({
          id: uid("link"),
          title: current.title || current.url,
          url: current.url
        });
        return;
      }
      (current.children || []).forEach(walk);
    }

    (node.children || []).forEach(walk);
    return result;
  }

  const rootChildren = roots?.[0]?.children || [];

  rootChildren.forEach(root => {
    const folders = (root.children || []).filter(child => !child.url);
    const directLinks = (root.children || []).filter(child => child.url);

    if (directLinks.length) {
      boards.push({
        id: uid("board"),
        title: root.title || "Панель закладок",
        links: directLinks.slice(0, 120).map(item => ({
          id: uid("link"),
          title: item.title || item.url,
          url: item.url
        }))
      });
    }

    folders.forEach(folder => {
      const links = bookmarksFromNode(folder);
      if (links.length) {
        boards.push({
          id: uid("board"),
          title: folder.title || "Без названия",
          links
        });
      }
    });
  });

  return boards;
}


async function getBookmarkFoldersForImport() {
  const roots = await chrome.bookmarks.getTree();
  const folders = [];

  function collectLinks(node, limit = 500) {
    const result = [];

    function walk(current) {
      if (result.length >= limit) return;
      if (current.url) {
        result.push({
          id: uid("link"),
          title: current.title || current.url,
          url: current.url
        });
        return;
      }
      (current.children || []).forEach(walk);
    }

    (node.children || []).forEach(walk);
    return result;
  }

  function walkFolder(node, path = []) {
    const children = node.children || [];
    const links = collectLinks(node);
    const directLinks = children.filter(child => child.url);

    if (links.length) {
      folders.push({
        id: node.id,
        title: node.title || path[path.length - 1] || "Без названия",
        path: [...path, node.title || "Без названия"].filter(Boolean).join(" / "),
        count: links.length,
        directCount: directLinks.length,
        links
      });
    }

    children.filter(child => !child.url).forEach(child => {
      walkFolder(child, [...path, node.title || ""]);
    });
  }

  const rootChildren = roots?.[0]?.children || [];
  rootChildren.forEach(root => {
    (root.children || []).filter(child => !child.url).forEach(folder => {
      walkFolder(folder, [root.title || ""]);
    });

    const directLinks = (root.children || []).filter(child => child.url);
    if (directLinks.length) {
      folders.unshift({
        id: root.id,
        title: root.title || "Панель закладок",
        path: root.title || "Панель закладок",
        count: directLinks.length,
        directCount: directLinks.length,
        links: directLinks.map(item => ({
          id: uid("link"),
          title: item.title || item.url,
          url: item.url
        }))
      });
    }
  });

  return folders;
}

async function loadState() {
  const synced = await syncStore.get();
  let state = migrateState(synced);
  cleanupTrash(state);

  if (!synced) {
    try {
      const importedBoards = await getAllBookmarksAsBoards();
      if (importedBoards.length) state.pages[0].boards = importedBoards;
    } catch (error) {
      console.warn("Bookmark import failed", error);
    }
    await syncStore.set(state);
  }

  return state;
}

function cleanupTrash(state) {
  const cutoff = Date.now() - TRASH_TTL_MS;
  state.trash.links = (state.trash.links || []).filter(item => item.deletedAt > cutoff);
  state.trash.boards = (state.trash.boards || []).filter(item => item.deletedAt > cutoff);
  state.trash.pages = (state.trash.pages || []).filter(item => item.deletedAt > cutoff);
}
