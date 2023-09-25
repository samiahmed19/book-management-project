const express = require('express');
const Router = express.Router();
const bookController = require('../controller/bookController');
// const { authenticateUser } = require('../middleware/authMiddleware');
// const { validateBook } = require('../validator/validation');

router.get('/books', bookController.getAllBooks);
router.get('/books/:bookId', bookController.getBookById);
router.post('/books', authenticateUser, validateBook, bookController.createBook);
router.put('/books/:bookId', authenticateUser, validateBook, bookController.updateBook);
router.delete('/books/:bookId', authenticateUser, bookController.deleteBook);

module.exports = Router;
