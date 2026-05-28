
let state;

const pageSelect = document.getElementById("pageSelect");
const boardSelect = document.getElementById("boardSelect");
const statusBox = document.getElementById("status");

init();

async function init() {
  state = await loadState();
  renderPages();
  renderBoards();

  pageSelect.addEventListener("change", renderBoards);
  document.getElementById("addCurrentBtn").addEventListener("click", addCurrentTab);
  document.getElementById("saveWindowBtn").addEventListener("click", saveWindow);
  document.getElementById("openStartBtn").addEventListener("click", () => chrome.tabs.create({ url: "chrome://newtab" }));
}

function currentPage() {
  return state.pages.find(page => page.id === pageSelect.value) || state.pages[0];
}

function renderPages() {
  pageSelect.innerHTML = state.pages
    .map(page => `<option value="${page.id}" ${page.id === state.activePageId ? "selected" : ""}>${escapeHtml(page.title)}</option>`)
    .join("");
}

function renderBoards() {
  const page = currentPage();
  boardSelect.innerHTML = page.boards
    .map(board => `<option value="${board.id}">${escapeHtml(board.title)}</option>`)
    .join("");
}

async function addCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url || tab.url.startsWith("chrome://")) {
    return setStatus("Эту вкладку нельзя сохранить.");
  }

  const page = currentPage();
  let board = page.boards.find(item => item.id === boardSelect.value);

  if (!board) {
    board = { id: uid("board"), title: "Inbox", links: [] };
    page.boards.push(board);
  }

  board.links.unshift({
    id: uid("link"),
    title: tab.title || tab.url,
    url: tab.url
  });

  await syncStore.set(state);
  renderBoards();
  setStatus("Вкладка добавлена.");
}

async function saveWindow() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const links = tabs
    .filter(tab => tab.url && !tab.url.startsWith("chrome://"))
    .map(tab => ({
      id: uid("link"),
      title: tab.title || tab.url,
      url: tab.url
    }));

  if (!links.length) return setStatus("В этом окне нечего сохранять.");

  currentPage().boards.push({
    id: uid("board"),
    title: `Окно ${new Date().toLocaleDateString("ru-RU")}`,
    links
  });

  await syncStore.set(state);
  renderBoards();
  setStatus("Окно сохранено как новая доска.");
}

function setStatus(message) {
  statusBox.textContent = message;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
