import { bookApi } from './api/bookApi';
import { renderBookList } from './components/bookList';
import { setupBookForm } from './components/bookForm';

// Book list
async function refreshLibrary() {
  const books = await bookApi.fetchBooks();
  renderBookList(books, 'book-list');
}

// Form
setupBookForm('book-form', async (newBook) => {
  await bookApi.addBook(newBook);
  await refreshLibrary();
});

refreshLibrary();