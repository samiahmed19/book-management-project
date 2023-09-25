const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { validateSignUp, validateSignIn } = require('../validator/validation');

router.post('/signup', validateSignUp, authController.signUp);
router.post('/signin', validateSignIn, authController.signIn);

module.exports = router;
