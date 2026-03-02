const { body } = require('express-validator');

const registerValidation = [
  body('fullName')
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
    .isEmail()
    .withMessage('Invalid email format'),

  body('mobile')
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile must be 10 digits')
    .isNumeric()
    .withMessage('Mobile must contain only numbers'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

module.exports = { registerValidation,loginValidation };