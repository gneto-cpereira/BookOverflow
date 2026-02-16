const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/external/:isbn', bookController.getExternalBook);

router.get('/', bookController.getAllBooks);
router.post('/', bookController.createBook);

router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;