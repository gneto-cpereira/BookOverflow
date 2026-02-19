const db = require('../db');

/**
 * Helper to clean ISBN format
 */
const cleanISBN = (isbn) => isbn ? isbn.replace(/[- ]/g, "") : "";

// --- CREATE ---
exports.createBook = async (req, res) => {
  const { title, author, isbn, description, pages, language, shelf_location = 'Main Shelf' } = req.body;
  try {
    const queryText = `
      INSERT INTO books (title, author, isbn, description, shelf_location, pages, language)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const result = await db.query(queryText, [title, author, cleanISBN(isbn), description, shelf_location, pages, language]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao registar livro." });
  }
};

// --- READ ---
exports.getAllBooks = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao procurar livros." });
  }
};

exports.getExternalBook = async (req, res) => {
  const isbn = cleanISBN(req.params.isbn);

  try {
    // Fetch from both APIs simultaneously
    const [gRes, olRes] = await Promise.all([
      fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`).then(r => r.json()),
      fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`).then(r => r.json())
    ]);

    const gInfo = gRes.totalItems > 0 ? gRes.items[0].volumeInfo : null;
    const olInfo = olRes[`ISBN:${isbn}`] || null;

    if (!gInfo && !olInfo) {
      return res.status(404).json({ error: "Livro não encontrado." });
    }

    // Merge data: Google priority for title/desc, OpenLibrary for others if missing
    res.json({
      title: gInfo?.title || olInfo?.title || 'Sem título',
      author: gInfo?.authors?.join(', ') || olInfo?.authors?.map(a => a.name).join(', ') || 'Desconhecido',
      isbn: isbn,
      description: gInfo?.description || 'Sem descrição disponível.',
      pages: gInfo?.pageCount || olInfo?.number_of_pages || 0,
      language: gInfo?.language || 'pt'
    });
  } catch (err) {
    res.status(500).json({ error: "Erro na comunicação com as APIs." });
  }
};

// Get all unique shelf names from the database
exports.getShelves = async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT shelf_location FROM books WHERE shelf_location IS NOT NULL');
    const shelves = result.rows.map(r => r.shelf_location);
    res.json(shelves);
  } catch (err) {
    res.status(500).json({ error: "Error fetching shelves" });
  }
};

// --- DELETE ---
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM books WHERE id = $1', [id]);
    res.status(200).json({ message: "Livro removido com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao apagar livro" });
  }
};

// --- UPDATE ---
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, pages, description, language, shelf_location } = req.body;

  try {
    const queryText = `
      UPDATE books
      SET title = $1, author = $2, isbn = $3, pages = $4, description = $5, language = $6, shelf_location = $7
      WHERE id = $8 RETURNING *;
    `;
    const result = await db.query(queryText, [title, author, cleanISBN(isbn), pages, description, language, shelf_location, id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Livro não encontrado." });

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar livro." });
  }
}