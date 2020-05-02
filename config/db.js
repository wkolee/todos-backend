const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/todo";
const db = async ()=>{
    await mongoose.connect(url, 
         {
            useCreateIndex: true, 
            useFindAndModify: false,
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
        console.log(`DATABASE CONNECT TO ${url}`.yellow);
}

module.exports = db;