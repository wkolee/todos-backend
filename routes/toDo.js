const router = require('express').Router();
const log = require('../helper/log');
const toDos = require('../controllers/toDo');
const auth = require('../middlewares/auth');

//get all todos

router.get('/', auth.protectRoute,auth.authorize('user', 'admin'), toDos.getTodos);
//get a single todos
router.get('/:id', auth.protectRoute,auth.authorize('user', 'admin'), toDos.singleTodos);
//create todos
router.post('/', auth.protectRoute, auth.authorize('user', 'admin'),toDos.createTodos);
//update todos
router.put('/:id',auth.protectRoute, auth.authorize('user', 'admin'),toDos.updateTodos);
//delete todos
router.delete('/:id', auth.protectRoute,auth.authorize('user', 'admin'), toDos.delTodos);



module.exports = router;