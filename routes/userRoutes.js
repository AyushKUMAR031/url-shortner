const express = require('express');
const { handleSignup, handleUserLogin, handleLogout } = require('../controllers/userController');
const router = express.Router();

router.post('/', handleSignup);
router.post('/login', handleUserLogin);
router.get('/logout', handleLogout);
module.exports = router;