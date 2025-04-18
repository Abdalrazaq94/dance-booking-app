const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const { login } = require('../auth/auth');

router.get('/login', controller.show_login);
router.post('/login', login, controller.handle_login);

router.get('/register', controller.show_register_page); // 
router.post('/register', controller.post_new_user);

router.get('/logout', controller.logout);

module.exports = router;
