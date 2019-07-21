const express = require('express')
const router = express.Router()
const User = require('../model/user')
const auth = require('../middleware/authentication')

// adding a new user
router.post('/users', async (req,res)=>{  
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken()
        user.Tokens = user.Tokens.concat({token})
        await user.save()
        res.status(201).send({user,token})
    } catch (error) {
        res.status(401).send(error)
    }
})

router.post('/users/logout',auth,async (req,res)=>{
    try {
        req.user.Tokens = req.user.Tokens.filter((token)=>{
            return token.token!==req.token
        })
        req.user.save()
        await res.send()
    } catch (error) {
        res.status(401).send(error)
    }
})

router.post('/users/logoutAll',auth,async (req,res)=>{
    try {
        req.user.Tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})
//Getting all the users
router.get('/users/me',auth,async (req,res)=>{ 
        res.send(req.user)
})

//Getting user by id
router.get('/users/:id',async (req,res)=>{
    const uId = req.params.id
    try {
        const user = await User.findById(uId)
        if(!user){
            return res.status(404).send()
        }
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

// USER Login
router.post('/users/login',async (req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user,token})
    } catch (error) {
        res.status(401).send(error)
    }
    })

//Updating a user
router.patch('/users/:id', async (req,res)=>{
    
    //Checking the data to be edited
    const requestedUpdates = Object.keys(req.body)
    const allowedUpdates = ['password','name'] 
    const isValidate = requestedUpdates.every((update)=>allowedUpdates.includes(update))
    if(!isValidate) {
        return res.status(400).send("This update is not allowed")
    }
    try {
       //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
       const user = await User.findById(req.params.id)
       if(!user){
           res.status(400).send("USER NOT FOUND")
       }
       requestedUpdates.forEach((update) => user[update] = req.body[update])
       await user.save()
       res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

//Deleting a USER
router.delete('/users/:id',async (req,res)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(400).send("User not found")
        }
        res.status(200).send(user)

    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router