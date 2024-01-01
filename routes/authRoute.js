const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const AuthController = require('../controller/AuthController');
const authMiddleware = require('../middleware/auth'); 
const upload = require('../middleware/upload');

const { validationResult } = require('express-validator');

// Middleware to check for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  validate,
], upload.single('avatar'), AuthController.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })],
  validate,
  AuthController.login);

router.post('/logout', AuthController.logout);

router.post('/forget-password', [
  body('email').isEmail(),
], AuthController.forgetPassword, AuthController.handleForgetPassword);

router.post('/reset-password', [
  body('token').not().isEmpty(),
  body('newPassword').isLength({ min: 6 }),
], AuthController.resetPassword);

router.get('/profile', authMiddleware, AuthController.myProfile);


module.exports = router;
