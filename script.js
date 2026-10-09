const STORAGE_KEY = "libraryDeskBooks";

const starterBooks = [
  { id: "BK-101", title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", issued: false },
  { id: "BK-102", title: "Atomic Habits", author: "James Clear", category: "Education", issued: true },
  { id: "BK-103", title: "Clean Code", author: "Robert C. Martin", category: "Technology", issued: false },
  { id: "BK-104", title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", issued: false }
];

let books = loadBooks();
let toastTimer;

function loadBooks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : starterBooks.map(book => ({ ...book }));
  } catch (error) {
    return starterBooks.map(book => ({ ...book }));
  }
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function setPage(page) {
  const pages = {
    dashboard: ["dashboardPage", "Dashboard"],
    books: ["booksPage", "All Books"],
    add: ["addPage", "Add a Book"]
  };

  Object.keys(pages).forEach(key => {
    document.getElementById(pages[key][0]).classList.toggle("hidden", key !== page);
  });

  document.getElementById("pageTitle").textContent = pages[page][1];
  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  if (page === "books") renderAllBooks();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderStats() {
  const issued = books.filter(book => book.issued).length;
  document.getElementById("totalCount").textContent = books.length;
  document.getElementById("issuedCount").textContent = issued;
  document.getElementById("availableCount").textContent = books.length - issued;
}

function bookRow(book) {
  const status = book.issued
    ? '<span class="pill issued">Issued</span>'
    : '<span class="pill available">Available</span>';
  const action = book.issued
    ? `<button class="action-btn return" data-action="toggle" data-id="${escapeAttribute(book.id)}">Return</button>`
    : `<button class="action-btn" data-action="toggle" data-id="${escapeAttribute(book.id)}">Issue</button>`;

  return `<tr>
    <td><div class="book-detail"><div class="book-cover">📘</div><div><div class="book-title">${escapeHTML(book.title)}</div><div class="book-id">${escapeHTML(book.id)}</div></div></div></td>
    <td>${escapeHTML(book.author)}</td>
    <td>${escapeHTML(book.category)}</td>
    <td>${status}</td>
    <td>${action}<button class="delete-btn" title="Delete book" aria-label="Delete ${escapeAttribute(book.title)}" data-action="delete" data-id="${escapeAttribute(book.id)}">✕</button></td>
  </tr>`;
}

function renderRecentBooks() {
  const recent = [...books].slice(-4).reverse();
  document.getElementById("recentBooks").innerHTML = recent.map(bookRow).join("");
  document.getElementById("emptyRecent").classList.toggle("hidden", books.length !== 0);
}

function renderAllBooks() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const status = document.getElementById("statusFilter").value;
  const filtered = books.filter(book => {
    const matchesText = book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) || book.id.toLowerCase().includes(query);
    const matchesStatus = status === "all" ||
      (status === "issued" && book.issued) ||
      (status === "available" && !book.issued);
    return matchesText && matchesStatus;
  });

  document.getElementById("allBooks").innerHTML = filtered.map(bookRow).join("");
  document.getElementById("emptyBooks").classList.toggle("hidden", filtered.length !== 0);
}

function render() {
  renderStats();
  renderRecentBooks();
  renderAllBooks();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

function escapeAttribute(value) {
  return escapeHTML(value);
}

function makeBookId() {
  let number = 101;
  while (books.some(book => book.id === `BK-${number}`)) number++;
  return `BK-${number}`;
}

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => setPage(button.dataset.page));
});

["quickAdd", "booksAdd", "emptyAdd"].forEach(id => {
  document.getElementById(id).addEventListener("click", () => setPage("add"));
});
document.getElementById("viewAll").addEventListener("click", () => setPage("books"));
document.getElementById("cancelAdd").addEventListener("click", () => {
  document.getElementById("bookForm").reset();
  document.getElementById("formError").classList.add("hidden");
  setPage("dashboard");
});
document.getElementById("searchInput").addEventListener("input", renderAllBooks);
document.getElementById("statusFilter").addEventListener("change", renderAllBooks);

document.getElementById("bookForm").addEventListener("submit", event => {
  event.preventDefault();
  const title = document.getElementById("bookTitle").value.trim();
  const author = document.getElementById("bookAuthor").value.trim();
  const category = document.getElementById("bookCategory").value;
  const customId = document.getElementById("bookId").value.trim();
  const error = document.getElementById("formError");

  if (!title || !author || !category) {
    error.textContent = "Please fill in all required fields.";
    error.classList.remove("hidden");
    return;
  }

  const id = customId || makeBookId();
  if (books.some(book => book.id.toLowerCase() === id.toLowerCase())) {
    error.textContent = "That Book ID already exists. Please use a different ID.";
    error.classList.remove("hidden");
    return;
  }

  books.push({ id, title, author, category, issued: false });
  saveBooks();
  render();
  event.target.reset();
  error.classList.add("hidden");
  setPage("dashboard");
  showToast("Book added successfully!");
});

document.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const book = books.find(item => item.id === button.dataset.id);
  if (!book) return;

  if (button.dataset.action === "toggle") {
    book.issued = !book.issued;
    saveBooks();
    render();
    showToast(book.issued ? "Book issued successfully." : "Book returned successfully.");
  }

  if (button.dataset.action === "delete") {
    const confirmed = window.confirm(`Delete "${book.title}" from the library?`);
    if (!confirmed) return;
    books = books.filter(item => item.id !== book.id);
    saveBooks();
    render();
    showToast("Book deleted.");
  }
});

render();
