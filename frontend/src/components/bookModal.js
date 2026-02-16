import Swal from 'sweetalert2';

export async function openBookModal(book = null) {
  const isEdit = !!book;

  const { value: formValues } = await Swal.fire({
    title: isEdit ? 'Editar Livro' : 'Adicionar Novo Livro',
    html: `
      <input id="swal-title" class="swal2-input" placeholder="Título" value="${isEdit ? book.title : ''}">
      <input id="swal-author" class="swal2-input" placeholder="Autor" value="${isEdit ? book.author : ''}">
      <input id="swal-isbn" class="swal2-input" placeholder="ISBN" value="${isEdit ? book.isbn : ''}">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: isEdit ? 'Guardar Alterações' : 'Adicionar à Estante',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      return {
        title: document.getElementById('swal-title').value,
        author: document.getElementById('swal-author').value,
        isbn: document.getElementById('swal-isbn').value
      };
    }
  });

  return formValues;
}