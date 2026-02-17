// const API_URL = 'http://localhost:3000/books';
const API_URL = 'https://judy-nations-scene-observed.trycloudflare.com/books';

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
    },

    // DELETE
    async deleteBook(id) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        return response.ok;
    },

    // PUT
    async updateBook(id, bookData) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        return await response.json();
    }
};