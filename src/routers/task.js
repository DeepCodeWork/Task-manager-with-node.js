const Task = require('../model/task')
const express = require('express')
const auth = require('../middleware/authentication')
const router = express.Router()

//Adding a task
router.post('/tasks',auth,async (req,res)=>{
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    try {
        const newTask = await task.save()
        res.status(201).send(newTask)
    } catch (error) {
        res.status(401).send(error)
    }
})

//Retrieving all the tasks
// router.get('/tasks',async (req,res)=>{
//     try {
//         const tasks = await Task.find({})
//         if(!tasks){
//             return res.status(401).send()
//         }
//         res.status(201).send(tasks)
//     } catch (error) {
//         res.status(401).send(error)
//     }
// })

//getting all the task with perticular user
router.get('/tasks/me',auth,async (req,res)=>{

   try {
    //const task = await Task.findById(uId)
    console.log(req.user._id)
    const task = await Task.find({owner:req.user._id,isCompleted:req.query.isCompleted==="true"} )
    console.log("sksksks")
    if(!task){
            return res.status(400).send("NOT FOUND. Enter correct ID")
         }
    res.status(201).send(task)
    }catch (error) {
       res.status(400).send()
   }
})

//updating a task
router.patch('/tasks/:id', auth,async (req,res)=>{

    //Checking the data to edited
    const requestedUpdates = Object.keys(req.body)
    const allowedUpdates = ['isCompleted']
    const isValidate = requestedUpdates.every((update)=>allowedUpdates.includes(update))
    if(!isValidate) {
        return res.status(400).send("This update is not allowed")
    }
    try {
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(400).send("Please authenticate")
        }
        requestedUpdates.forEach((update)=>{
        task[update] = req.body[update]
        })
        await task.save()
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send()
    }
})

//deleting a task
router.delete('/tasks/:id', auth,async (req,res)=>{
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(400).send("Task not found")
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router