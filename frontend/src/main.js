import { bookApi } from './api/bookApi';
import { renderBookTable } from './components/bookTable';
import { openBookModal } from './components/bookModal';

// Book Table
async function refreshLibrary() {
  // READ
  const books = await bookApi.fetchBooks();
  
  renderBookTable(
    books, 
    // DELETE
    async (id) => {
      if (confirm("Tens a certeza que queres remover este livro?")) {
        await bookApi.deleteBook(id);
        refreshLibrary();
      }
    },
    // UPDATE
    async (book) => {
      const updatedData = await openBookModal(book);
      if (updatedData) {
        await bookApi.updateBook(book.id, updatedData);
        await refreshLibrary();
      }
    }
  );
}

// CREATE
document.getElementById('add-book-btn').addEventListener('click', async () => {
  const newData = await openBookModal();
  if (newData) {
    await bookApi.addBook(newData);
    await refreshLibrary();
  }
});

refreshLibrary();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW Registered!', reg))
      .catch(err => console.log('SW Registration failed:', err));
  });
}