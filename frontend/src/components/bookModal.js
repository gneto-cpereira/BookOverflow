import Swal from 'sweetalert2';

/**
 * Main function to open the modal for Adding or Editing
 */
export async function openBookModal(book = null) {
  const isEdit = !!book;

  const { value: formValues } = await Swal.fire({
    title: isEdit ? 'Edit Book' : 'Add via ISBN',
    html: getModalTemplate(book),
    didOpen: () => setupEventListeners(),
    preConfirm: () => validateForm(),
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: isEdit ? 'Save' : 'Add',
  });

  return formValues;
}

/**
 * Returns the HTML structure for the modal
 */
function getModalTemplate(book) {
  return `
    <div style="display: flex; gap: 5px; margin-bottom: 10px;">
      <input id="swal-isbn" class="swal2-input" style="margin: 0; flex-grow: 1;" placeholder="ISBN" value="${book?.isbn || ''}">
      <button type="button" id="btn-search-isbn" class="swal2-confirm swal2-styled" style="margin: 0; padding: 10px; min-width: 45px;">🔍</button>
    </div>
    <input id="swal-title" class="swal2-input" placeholder="Title" value="${book?.title || ''}">
    <input id="swal-author" class="swal2-input" placeholder="Author" value="${book?.author || ''}">
  `;
}

/**
 * Hooks up search and input reset logic
 */
function setupEventListeners() {
  const isbnEl = document.getElementById('swal-isbn');
  const titleEl = document.getElementById('swal-title');
  const authorEl = document.getElementById('swal-author');
  const btnSearch = document.getElementById('btn-search-isbn');

  // Clear validation on type
  [isbnEl, titleEl, authorEl].forEach(el => 
    el.addEventListener('input', () => Swal.resetValidationMessage())
  );

  // ISBN Search logic
  btnSearch.addEventListener('click', () => handleISBNSearch(isbnEl, titleEl, authorEl, btnSearch));
}

/**
 * Logic to fetch data from Google Books API
 */
async function handleISBNSearch(isbnEl, titleEl, authorEl, btn) {
  if (!isbnEl.value) return Swal.showValidationMessage('Enter ISBN first');

  btn.disabled = true;
  btn.textContent = '⏳';

  try {
    const res = await fetch(`http://localhost:3000/books/external/${isbnEl.value}`);
    if (!res.ok) throw new Error();

    const data = await res.json();
    titleEl.value = data.title || '';
    authorEl.value = data.author || '';
    btn.textContent = '✅';
    Swal.resetValidationMessage();
  } catch (err) {
    btn.textContent = '❌';
    Swal.showValidationMessage('Book not found in Google database');
  } finally {
    setTimeout(() => { btn.disabled = false; btn.textContent = '🔍'; }, 1500);
  }
}

/**
 * Validates required fields before closing
 */
function validateForm() {
  const data = {
    title: document.getElementById('swal-title').value.trim(),
    author: document.getElementById('swal-author').value.trim(),
    isbn: document.getElementById('swal-isbn').value.trim(),
  };

  if (!data.title || !data.author || !data.isbn) {
    Swal.showValidationMessage('All fields are required');
    return false;
  }

  return data;
}