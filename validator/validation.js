const { body } = require('express-validator');

// Validation rules for user registration (Sign Up)
exports.validateSignUp = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
];
// Validation rules for user authentication (Sign In)
exports.validateSignIn = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
  ];
// Validation rules for updating a book
exports.validateUpdateBook = [
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    // Add more validation rules as needed
  ];
// Validation rules for adding a book to the cart
exports.validateAddToCart = [
    body('bookId').notEmpty().withMessage('Book ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ];
  