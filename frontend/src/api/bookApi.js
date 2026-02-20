const API_URL = '/books';

export const bookApi = {
    // GET
    async fetchAllBooks() {
        const response = await fetch(API_URL);
        return await response.json();
    },

    async fetchExternalBooks(isbn) {
        const response = await fetch(`${API_URL}/external/${isbn}`);
        return await response.json();
    },

    async fetchShelves() {
        const response = await fetch(`${API_URL}/shelves`);
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