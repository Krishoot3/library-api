const express = require('express');
const router = express.Router();

const book_controller = require('../controllers/bookController');
const validator = require('../validators/validator');

router.get('/', book_controller.default_page)

router.post('/book', validator.validateBody, book_controller.book_add);

router.get('/book/:bookName/author/:authorName', 
            validator.validateBookName, 
            validator.validateAuthorName, 
            book_controller.book_filter_detail);

router.get('/book/:bookName', validator.validateBookName, book_controller.book_detail);

router.put('/book/:bookName', validator.validateBookName, book_controller.book_edit);

router.delete('/book/:bookName', validator.validateBookName, book_controller.book_delete);

router.delete('/author/:authorName', validator.validateAuthorName, book_controller.author_delete);

module.exports = router;