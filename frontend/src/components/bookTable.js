import { Grid, h } from "gridjs";
import "gridjs/dist/theme/mermaid.css";

/**
 * Define table columns and action button logic
 */
const getColumns = (onDelete, onEdit) => [
  { id: 'id', name: 'ID', hidden: true },
  { id: 'title', name: 'Título' },
  { id: 'author', name: 'Autor' },
  { id: 'isbn', name: 'ISBN' },
  {
    name: 'Ações',
    formatter: (_, row) => {
      const book = {
        id: row.cells[0].data,
        title: row.cells[1].data,
        author: row.cells[2].data,
        isbn: row.cells[3].data
      };

      return h('div', { className: 'actions-wrapper' }, [
        h('button', { className: 'edit-btn', onClick: () => onEdit(book) }, '📝'),
        h('button', { className: 'delete-btn', onClick: () => onDelete(book.id) }, '🗑️')
      ]);
    }
  }
];

/**
 * Grid.js UI localization strings
 */
const languageConfig = {
  search: { placeholder: 'Pesquisar livro...' },
  pagination: {
    previous: '←',
    next: '→',
    showing: 'A mostrar',
    results: () => 'livros'
  }
};

/**
 * Main function to initialize and render the table
 */
export function renderBookTable(books, onDelete, onEdit) {
  const container = document.getElementById('table-container');
  if (!container) return;
  
  container.innerHTML = '';

  new Grid({
    columns: getColumns(onDelete, onEdit),
    data: books,
    search: true,
    sort: true,
    pagination: { limit: 10 },
    language: languageConfig
  }).render(container);
}