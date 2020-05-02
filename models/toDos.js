const mongoose = require('mongoose');

const todosSchema = mongoose.Schema({
    taskname : {
        type: String,
        required: true,
        maxlength: 30,
        minlength: 3
    },
    task: {
        type: String,
        required: true,
        maxlength: 500,
        minlength: 3
    },
    didCompleted: {
        type: Boolean,
        completed: false,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Todos', todosSchema);