const router = require('express').Router();
const getUser = require('../controllers/auth');
const auth = require('../middlewares/auth');
//register users
router.post('/register', getUser.register);
//login users
router.post('/login', getUser.login);

//get user profile 
router.get('/profile', auth.protectRoute, auth.authorize('user', 'admin'), getUser.profile);
module.exports = router;