const API_URL = 'http://localhost:3000/books';

export const bookApi = {
  // GET
  async fetchBooks() {
    const response = await fetch(API_URL);
    return await response.json();
  },

  // POST
  async addBook(bookData) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
    return await response.json();
  }
};