const router = require('express').Router();
const getUser = require('../controllers/auth');
//register users
router.post('/register', getUser.register);
//login users
router.post('/login', getUser.login);


module.exports = router;