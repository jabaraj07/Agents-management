const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controller/authController');
const router = express.Router();
const {registerValidation,loginValidation} = require("../validations/authValidation");
const validate = require('../middlewares/validate');


router.post('/register',registerValidation,validate,registerUser);
router.post('/login', loginValidation, validate, loginUser);
router.post("/logout", logoutUser);



module.exports = router;