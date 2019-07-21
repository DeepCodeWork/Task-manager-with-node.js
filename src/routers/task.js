const Task = require('../model/task')
const express = require('express')
const router = express.Router()

//Adding a task
router.post('/tasks',async (req,res)=>{
    const task = new Task(req.body)
    try {
        const newTask = await task.save()
        res.status(201).send(newTask)
    } catch (error) {
        res.status(401).send(error)
    }
})

//Retrieving all the tasks
router.get('/tasks',async (req,res)=>{
    try {
        const tasks = await Task.find({})
        if(!tasks){
            return res.status(401).send()
        }
        res.status(201).send(tasks)
    } catch (error) {
        res.status(401).send(error)
    }
})

//getting task with ID
router.get('/tasks/:id',async (req,res)=>{

   try {
    const uId = req.params.id
    const task = await Task.findById(uId)
    if(!task){
            return res.status(400).send("NOT FOUND. Enter correct ID")
         }
    res.status(201).send(task)
    }catch (error) {
       res.status(400).send()
   }
})

//updating a task
router.patch('/tasks/:id',async (req,res)=>{

    //Checking the data to edited
    const requestedUpdates = Object.keys(req.body)
    const allowedUpdates = ['isCompleted']
    const isValidate = requestedUpdates.every((update)=>allowedUpdates.includes(update))
    if(!isValidate) {
        return res.status(400).send("This update is not allowed")
    }
    try {
        const task = await Task.findById(req.params.id)
        if(!task){
            return res.status(400).send()
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
router.delete('/tasks/:id',async (req,res)=>{
    try {
        const task = await Task.findOneAndDelete(req.params.id)
        if(!task){
            return res.status(400).send("Task not found")
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router