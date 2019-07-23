const express = require('express')
const app = express()
require('./db/mongoose')
const User = require('./model/user')

const port = process.env.PORT || 3000
app.use(express.json())

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log("Server at "+port)
})

