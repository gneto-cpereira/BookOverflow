const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// CREATE
router.post('/', bookController.createBook);

// READ
router.get('/external/:isbn', bookController.getExternalBook);
router.get('/shelves', bookController.getShelves);
router.get('/', bookController.getAllBooks);

// UPDATE
router.put('/:id', bookController.updateBook);

// DELETE
router.delete('/:id', bookController.deleteBook);

module.exports = router;