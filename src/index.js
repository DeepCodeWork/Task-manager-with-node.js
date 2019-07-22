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

const main = async ()=>{
    const user = await User.findById('5d34c3f071de591ab461bf91')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

