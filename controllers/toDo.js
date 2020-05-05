const Todos = require('../models/toDos');
const log = require('../helper/log');
const middlewares = require('../middlewares/middlewares');
const ErrorResponse = require('../helper/errorResponse');


module.exports = {
    //todos
    getTodos: middlewares.handleAsync(async (req, res, next) => {
        const todos = await Todos.find({user: req.user});
        //if no todos return error
        if(!todos){return next(new ErrorResponse('todos does not exist', 404))}
        //if not admin & user don't own todos return error
        if(!req.user && req.user.role != 'admin'){return next(new ErrorResponse('not authorize', 401));}
            const total = todos.length;
            let page = req.query.page;
            let limit = req.query.limit;
            //if data is being search
            if(page && limit){
                const pageTotal = Math.ceil(todos.length / limit);
                page = parseInt(req.query.page);
                const sortTodos = todos.slice(page * limit - limit, page * limit);
            if (page > pageTotal) {
                page = pageTotal
            }
            res.json({
                success: true,
                total,
                CurrentPage: page,
                pageTotal: pageTotal,
                todos: sortTodos
            });
            }else{  
                //get all data    
                res.status(200).json({
                success: true,
                total,
                todos
                });
    
            }    
}),
    //get single todos 
    singleTodos: middlewares.handleAsync(async (req, res, next)=>{
            const todos = await Todos.findOne({_id: req.params.id});
            if(!todos){
                return next(new ErrorResponse('TODOS DOES NOT EXIST', 404));
            }
            //check if user own todos
            if(todos.user.toString() != req.user.id && req.user.role != 'admin'){
                return next(new ErrorResponse('NOT AUTHORIZE', 401))
            }
            
            res.status(200).json({
                success: true,
                todos
            });
    }),
    //create todos
    createTodos: middlewares.handleAsync(async (req, res) => {
        if(req.user || req.user.role === 'admin'){
            req.body.user = req.user.id;
            const todos = await Todos.create(req.body);
            res.status(201).json({
                success: true,
                todos
            });
        }
    }),
    //update todos
    updateTodos: middlewares.handleAsync(async (req, res, next) => {
        const ID = req.params.id;
        let todos = await Todos.findById(ID);
        if(!todos){
            return next(new ErrorResponse(`no todos find with the ID of ${req.params.id}`, 404));
        }
        if(todos.user.toString() != req.user.id && req.user.role != 'admin'){
            return next(new ErrorResponse('NOT AUTHORIZE', 401))
        }
        todos = await Todos.findByIdAndUpdate(ID, {$set: req.body}, {new: true, runValidators: true});
        res.status(200).json({
            success: true,
            todos
        });
    }),
    //deleted todos
    delTodos: middlewares.handleAsync(async (req, res, next) => {
        const ID = req.params.id;
        let todos = await Todos.findById(ID);
        if(!todos){
            return next(new ErrorResponse(`no todos with the ID of ${req.params.id}`, 404));
        }

        if(todos.user.toString() != req.user.id && req.user.role != 'admin'){
            return next(new ErrorResponse('not authorize', 401));
        }


        todos = await Todos.deleteOne({_id:ID});
        res.status(200).json({
            success: true,
            msg: `Todos with the ID of ${ID} been deleted`
        });
    })

}