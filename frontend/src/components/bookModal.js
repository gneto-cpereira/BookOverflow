import Swal from 'sweetalert2';
import { Html5Qrcode } from 'html5-qrcode';
import { bookApi } from '../api/bookApi';

/**
 * Main function to open the modal for Adding or Editing
 */
export async function openBookModal(book = null) {
  const isEdit = !!book;
  
  let shelves = [];
  try {
    shelves = await bookApi.fetchShelves();
  } catch (err) {
    console.warn("Could not fetch shelves, using defaults", err);
  }

  const { value: formValues } = await Swal.fire({
    title: isEdit ? 'Edit Book' : 'Add via ISBN',
    html: getModalTemplate(book, shelves),
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
function getModalTemplate(book, shelves = []) {
  const shelfOptions = (shelves || [])
    .map(s => `<option value="${s}">`)
    .join('');

  return `
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <div id="reader" style="width: 100%; display: none; border-radius: 8px; overflow: hidden;"></div>
      
      <div style="display: flex; gap: 5px;">
        <input id="swal-isbn" class="swal2-input" style="margin: 0; flex-grow: 1;" placeholder="ISBN" value="${book?.isbn || ''}">
        <button type="button" id="btn-scan" class="swal2-confirm swal2-styled" style="margin: 0; background-color: #6e7881;">📷</button>
        <button type="button" id="btn-search-isbn" class="swal2-confirm swal2-styled" style="margin: 0;">🔍</button>
      </div>

      <label style="text-align: left; font-size: 0.8rem; color: #666;">Shelf Location</label>
      <input id="swal-shelf" list="shelf-options" class="swal2-input" style="margin-top: 0;" 
             placeholder="Select or type new shelf..." value="${book?.shelf_location || ''}">
      <datalist id="shelf-options">
        ${shelfOptions}
      </datalist>
      
      <input id="swal-title" class="swal2-input" placeholder="Title" value="${book?.title || ''}">
      <input id="swal-author" class="swal2-input" placeholder="Author" value="${book?.author || ''}">
      <input id="swal-description" class="swal2-input" placeholder="Description" value="${book?.description || ''}">
      <input id="swal-pages" class="swal2-input" placeholder="Pages" value="${book?.pageCount || ''}">
      <input id="swal-language" class="swal2-input" placeholder="Language" value="${book?.language || ''}">
    </div>
  `;
}

/**
 * Hooks up search and input reset logic
 */
function setupEventListeners() {
  const isbnEl = document.getElementById('swal-isbn');
  const titleEl = document.getElementById('swal-title');
  const authorEl = document.getElementById('swal-author');
  const descriptionEl = document.getElementById('swal-description');
  const pagesEl = document.getElementById('swal-pages');
  const languageEl = document.getElementById('swal-language');
  const btnSearch = document.getElementById('btn-search-isbn');
  const btnScan = document.getElementById('btn-scan');
  const readerEl = document.getElementById('reader');

  // Clear validation on type
  [isbnEl, titleEl, authorEl, descriptionEl, pagesEl, languageEl].forEach(el =>
    el.addEventListener('input', () => Swal.resetValidationMessage())
  );

  // ISBN Search logic
  btnSearch.addEventListener('click', () => handleISBNSearch(isbnEl, titleEl, authorEl, descriptionEl, pagesEl, languageEl, btnSearch));

  // Bar code
  btnScan.addEventListener('click', () => startScanner(isbnEl, btnSearch, readerEl));
}

/**
 * Logic to fetch data from Google Books API
 */
async function handleISBNSearch(isbnEl, titleEl, authorEl, descriptionEl, pagesEl, languageEl, btn) {
  if (!isbnEl.value) return Swal.showValidationMessage('Enter ISBN first');

  btn.disabled = true;
  btn.textContent = '⏳';

  try {
    const data = await bookApi.fetchExternalBooks(isbnEl.value)
    if (!data || data.error) throw new Error();
    titleEl.value = data.title || '';
    authorEl.value = data.author || '';
    descriptionEl.value = data.description || '';
    pagesEl.value = data.pages || '';
    languageEl.value = data.language || '';
    btn.textContent = '✅';
    Swal.resetValidationMessage();
  } catch (err) {
    btn.textContent = '❌';
    Swal.showValidationMessage('Book not found in External database');
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
    description: document.getElementById('swal-description').value.trim() || 'No description',
    pages: parseInt(document.getElementById('swal-pages').value) || 0,
    language: document.getElementById('swal-language').value.trim() || 'pt',
    shelf_location: document.getElementById('swal-shelf').value.trim() || 'Main Shelf'
  };

  if (!data.title || !data.author || !data.isbn) {
    Swal.showValidationMessage('Title, Author and ISBN are mandatory');
    return false;
  }

  return data;
}

/**
 * Logic to fetch data from Google Books API
 * Refined for PWA / Mobile
 */
async function startScanner(isbnEl, btnSearch, readerEl) {
  const ScannerClass = window.Html5Qrcode || Html5Qrcode;
  const html5QrCode = new ScannerClass("reader");
  readerEl.style.display = 'block';

  const config = {
    fps: 20,
    qrbox: { width: 150, height: 70 },
    aspectRatio: 1.0,
    experimentalFeatures: {
      useBarCodeDetectorIfSupported: true
    }
  };

  try {
    await html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        if (navigator.vibrate) navigator.vibrate(100);
        isbnEl.value = decodedText;
        html5QrCode.stop().then(() => {
          readerEl.style.display = 'none';
          btnSearch.click();
        });
      }
    );
  } catch (err) {
    console.error("Erro no Scanner:", err);
  }
}