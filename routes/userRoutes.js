const express = require('express');
const { handleSignup, handleUserLogin } = require('../controllers/userController');
const router = express.Router();

router.post('/', handleSignup);
router.post('/login', handleUserLogin);
module.exports = router;