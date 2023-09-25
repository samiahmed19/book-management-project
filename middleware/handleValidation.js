
const {body}=required('express-validator');
const { required } = require("joi");
const { authenticateUser } = require("./authMiddleware");
const { handlevalidations } = require("./validatorMiddleware");


const createBookValidation=[
    book('title').notEmpty().withMessage('Title is required'),
    book('author').notEmpty().withMessage('Author is required')
];

Router.post('./books',authenticateUser,createBookValidation,handlevalidations,bookController.createBook)