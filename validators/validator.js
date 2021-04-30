const { body, param, validationResult } = require('express-validator');

const errorReporter = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array().map(error => error.msg);

      return res.status(422).json({error: errorMessage[0] });
    }
    next();
};

exports.validateBookName = [
    param('bookName')
    .trim()
    .escape()
    .isLength({min: 3})
    .withMessage('Minimum 3 characters are required!')
    .bail()
    .isLength({max: 50})
    .withMessage('Maximum 50 characters are required!'),
    errorReporter
];

exports.validateAuthorName = [
    param('authorName')
    .trim()
    .escape()
    .isLength({min: 3})
    .withMessage('Minimum 3 characters are required!')
    .bail()
    .isLength({max: 50})
    .withMessage('Maximum 50 characters are required!'),
    errorReporter
];

exports.validateBody = [
    body('author', 'name', 'genre', 'description')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('The parameters must not be empty!')
    .bail()
    .isLength({min: 3})
    .withMessage('Minimum 3 characters required!')
    .bail(),

    body('author', 'name')
    .isLength({max: 50})
    .withMessage('Maximum 50 characters are required!')
    .bail(),

    body('genre')
    .isLength({max: 30})
    .withMessage('Maximum 30 characters are required!')
    .bail()
    .isIn(['Beletria', 'Pre deti', 'Odborna a naucna', 'Historia'])
    .withMessage('Wrong genre!')
    .bail(),

    body('description')
    .isLength({max: 100})
    .withMessage('Maximum 100 characters are required!')
    .bail(),

    body('purchase_price')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Purchase price can not be empty!')
    .bail()
    .isNumeric()
    .withMessage('Purchase price must be a number!'),
    errorReporter
];