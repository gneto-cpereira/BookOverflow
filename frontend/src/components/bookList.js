export function renderBookList(books, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  books.forEach(book => {
    const li = document.createElement('li');
    li.className = 'book-item';
    li.innerHTML = `
      <strong>${book.title}</strong> - ${book.author} 
      <small>(${book.isbn})</small>
    `;
    container.appendChild(li);
  });
}