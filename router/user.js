const express = require('express');
const Router = express.Router();
const userController = require('../controller/userController');

Router.get('/',userController.getPage);
Router.get('/login',userController.getLogin);
Router.get('/profile',userController.getProfile);
Router.post('/verify-login',userController.verifyLogin);
Router.post('/create-user',userController.createUser);
Router.post('/add-book',userController.addBook);
Router.get('/get-add-book',userController.getAddBook);
Router.get('/get-books',userController.getBooks);
Router.get('/delete-book',userController.deleteBook);
module.exports = Router