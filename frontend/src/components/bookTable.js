import { Grid, h } from "gridjs";
import "gridjs/dist/theme/mermaid.css";

export function renderBookTable(books, onDelete, onEdit) {
  const container = document.getElementById('table-container');
  container.innerHTML = '';

  new Grid({
    columns: [
      { id: 'id', name: 'ID', hidden: true },
      { id: 'title', name: 'Título' },
      { id: 'author', name: 'Autor' },
      { id: 'isbn', name: 'ISBN' },
      { 
        name: 'Ações',
        formatter: (cell, row) => {
          const bookId = row.cells[0].data;

          const bookData = {
            id: bookId,
            title: row.cells[1].data,
            author: row.cells[2].data,
            isbn: row.cells[3].data
          };

          return h('div', { className: 'actions-wrapper' }, [
            h('button', {
              className: 'edit-btn',
              onClick: () => onEdit(bookData)
            }, '📝'),
            h('button', {
              className: 'delete-btn',
              onClick: () => onDelete(bookId)
            }, '🗑️')
          ]);
        }
      }
    ],
    data: books,
    search: true,
    sort: true,
    pagination: { limit: 10 },
    language: {
      search: { placeholder: 'Pesquisar livro...' },
      pagination: {
        previous: '←',
        next: '→',
        showing: 'Showing',
        results: () => 'books'
      }
    }
  }).render(container);
}