const mongoose = require('mongoose')

//connecting to database
mongoose.connect('mongodb://127.0.0.1:27017/Task-Manager-API',{
    useNewUrlParser:true,
    useCreateIndex:true
})

