import { Grid, h } from "gridjs";
import Swal from 'sweetalert2';
import "gridjs/dist/theme/mermaid.css";

/**
 * Truncates text and adds a click event to show the full version
 */
const formatDescription = (text) => {
  const content = text || 'No description available';
  if (content.length <= 50) return content;

  return h('span', {
    style: 'cursor: pointer; border-bottom: 1px dotted #666;',
    onClick: () => Swal.fire({
      title: 'Full Description',
      text: content,
      confirmButtonText: 'Close'
    })
  }, `${content.substring(0, 50)}...`);
};

/**
 * Define table columns and action button logic
 */
const getColumns = (onDelete, onEdit) => [
  { id: 'id', name: 'ID', hidden: true },
  { id: 'shelf_location', name: 'Shelf' },
  { id: 'title', name: 'Title' },
  { id: 'author', name: 'Author' },
  { id: 'isbn', name: 'ISBN' },
  { 
    id: 'description', 
    name: 'Description',
    formatter: (cell) => formatDescription(cell) // Apply truncation logic
  },
  { id: 'pages', name: 'Pages' },
  { id: 'language', name: 'Language' },
  {
    name: 'Actions',
    formatter: (_, row) => {
      const book = {
        id: row.cells[0].data,
        shelf_location: row.cells[1].data,
        title: row.cells[2].data,
        author: row.cells[3].data,
        isbn: row.cells[4].data,
        description: row.cells[5].data,
        pages: row.cells[6].data,
        language: row.cells[7].data
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
  search: { placeholder: 'Search...' },
  pagination: {
    previous: '←',
    next: '→',
    showing: 'Showing',
    results: () => 'books'
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