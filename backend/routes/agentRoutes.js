const express = require('express');
const router = express.Router();
const {
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent,
} = require('../controller/agentController');
const {
  agentCreateValidation,
  agentUpdateValidation,
} = require('../validations/agentValidation');
const validate = require('../middlewares/validate');

// all routes protected by auth middleware at application level or here
router.get('/', getAgents);
router.post('/', agentCreateValidation, validate, createAgent);
router.put('/:id', agentUpdateValidation, validate, updateAgent);
router.delete('/:id', deleteAgent);

module.exports = router;