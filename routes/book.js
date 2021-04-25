const express = require('express');
const router = express.Router();

const book_controller = require('../controllers/bookController');

router.get('/', book_controller.default_page)

router.post('/book', book_controller.book_add);

router.get('/book/:bookName/author/:authorName', book_controller.book_filter_detail);

router.get('/book/:bookName', book_controller.book_detail);

router.put('/book/:bookName', book_controller.book_edit);

router.delete('/book/:bookName', book_controller.book_delete);

router.delete('/author/:authorName', book_controller.author_delete);

module.exports = router;