import Swal from 'sweetalert2';
import { Html5Qrcode } from 'html5-qrcode';

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
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <div id="reader" style="width: 100%; display: none; border-radius: 8px; overflow: hidden;"></div>
      
      <div style="display: flex; gap: 5px;">
        <input id="swal-isbn" class="swal2-input" style="margin: 0; flex-grow: 1;" placeholder="ISBN" value="${book?.isbn || ''}">
        <button type="button" id="btn-scan" class="swal2-confirm swal2-styled" style="margin: 0; background-color: #6e7881;">📷</button>
        <button type="button" id="btn-search-isbn" class="swal2-confirm swal2-styled" style="margin: 0;">🔍</button>
      </div>
      
      <input id="swal-title" class="swal2-input" placeholder="Title" value="${book?.title || ''}">
      <input id="swal-author" class="swal2-input" placeholder="Author" value="${book?.author || ''}">
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
  const btnSearch = document.getElementById('btn-search-isbn');
  const btnScan = document.getElementById('btn-scan');
  const readerEl = document.getElementById('reader');

  // Clear validation on type
  [isbnEl, titleEl, authorEl].forEach(el =>
    el.addEventListener('input', () => Swal.resetValidationMessage())
  );

  // ISBN Search logic
  btnSearch.addEventListener('click', () => handleISBNSearch(isbnEl, titleEl, authorEl, btnSearch));

  // Bar code
  btnScan.addEventListener('click', () => startScanner(isbnEl, btnSearch, readerEl));
}

/**
 * Logic to fetch data from Google Books API
 */
async function handleISBNSearch(isbnEl, titleEl, authorEl, btn) {
  if (!isbnEl.value) return Swal.showValidationMessage('Enter ISBN first');

  btn.disabled = true;
  btn.textContent = '⏳';

  try {
    const res = await fetch(`https://judy-nations-scene-observed.trycloudflare.com/books/external/${isbnEl.value}`);
    if (!res.ok) throw new Error();

    const data = await res.json();
    titleEl.value = data.title || '';
    authorEl.value = data.author || '';
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
  };

  if (!data.title || !data.author || !data.isbn) {
    Swal.showValidationMessage('All fields are required');
    return false;
  }

  return data;
}

/**
 * Logic to fetch data from Google Books API
 * Refined for PWA / Mobile
 */
async function startScanner(isbnEl, btnSearch, readerEl) {
  // Use the imported or window method
  const ScannerClass = window.Html5Qrcode || Html5Qrcode; 
  const html5QrCode = new ScannerClass("reader");
  
  readerEl.style.display = 'block';

  const config = { 
    fps: 10, 
    qrbox: { width: 250, height: 150 },
    aspectRatio: 1.0 // Garante proporções quadradas/limpas no telemóvel
  };

  try {
    await html5QrCode.start(
      { facingMode: "environment" }, 
      config,
      (decodedText) => {
        // SUCCESS: Vibrate (haptic feedback)
        if (navigator.vibrate) navigator.vibrate(100); 
        
        isbnEl.value = decodedText;
        html5QrCode.stop().then(() => {
          readerEl.style.display = 'none';
          btnSearch.click(); // Trigger Google API Search!
        });
      }
    );
  } catch (err) {
    console.error("Camera access error:", err);
    Swal.showValidationMessage("Permissão de câmara negada ou erro de hardware.");
  }
}