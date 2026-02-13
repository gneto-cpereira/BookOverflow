export function setupBookForm(formId, onAddCallback) {
  const form = document.getElementById(formId);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      isbn: document.getElementById('isbn').value
    };

    await onAddCallback(formData);
    form.reset();
  });
}