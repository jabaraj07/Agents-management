const { body } = require('express-validator');

const agentCreateValidation = [
  body('name')
    .notEmpty()
    .withMessage('Agent name is required'),

  body('email')
    .isEmail()
    .withMessage('Valid email is required'),

  body('mobile')
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile must be 10 digits')
    .isNumeric()
    .withMessage('Mobile must contain only numbers')
];

// For update we can reuse the same rules; if some fields are optional we can adjust but keeping simple
const agentUpdateValidation = agentCreateValidation;

module.exports = { agentCreateValidation, agentUpdateValidation };