const express = require('express')
const router = express.Router()
const multer = require('multer')
const User = require('../model/user')
const auth = require('../middleware/authentication')
const sharp = require('sharp')
const {welcomeMail,cancelMail} = require('../emails/account')

// adding a new user
router.post('/users/signup', async (req,res)=>{  
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken()
        user.Tokens = user.Tokens.concat({token})
        await user.save()
        welcomeMail(user.email,user.name)
        res.status(200).send({user,token})
    } catch (error) {
        res.status(401).send(error)
    }
})

//Getting your information
router.get('/users/me',auth,async (req,res)=>{ 
        res.send(req.user)
})

// USER Login
router.post('/users/login',async (req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user:user,token})
    } catch (error) {
        res.status(401).send(error)
    }
    })

//Updating a user
router.patch('/users/me', auth,async (req,res)=>{
    
    //Checking the data to be edited
    const requestedUpdates = Object.keys(req.body)
    const allowedUpdates = ['password','name'] 
    const isValidate = requestedUpdates.every((update)=>allowedUpdates.includes(update))
    if(!isValidate) {
        return res.status(400).send("This update is not allowed")
    }
    try {
       //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
       //const user = await User.findById(req.params.id)
       //if(!user){
         //res.status(400).send("USER NOT FOUND")
       //}
       requestedUpdates.forEach((update) => req.user[update] = req.body[update])
       await req.user.save()
       res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

//module to upload profile 
const upload = multer({   
    limits:{
        fileSize:1000000,
    },
    fileFilter(req,file,callBack){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callBack(new Error("JPG JPEG PNG are only supported formats"))
        }
        callBack(undefined,true)
    }
    
})                         
                    
//uploading a profile photo
router.post('/users/me/avatar',auth,upload.single('avatar') ,async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send(req.user),
    (error,req,res,next)=>{
         res.status(400).send({error:error.message})
    }
})

//retrieving the profile picture
router.get('/users/me/avatar',auth,async (req,res)=>{
    res.set('Content-Type','image/png')
    res.send(req.user.avatar)
})

//delete profile picture
router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
})

//Signing out a user
router.post('/users/logout',auth,async (req,res)=>{
    try {
        req.user.Tokens = req.user.Tokens.filter((token)=>{
            return token.token!==req.token
        })
        req.user.save()
        await res.send("Logged out succesfully")
    } catch (error) {
        res.status(401).send(error)
    }
})

//signing out form all devices
router.post('/users/logoutAll',auth,async (req,res)=>{
    try {
        req.user.Tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})

//Deleting a USER
router.delete('/users/me',auth,async (req,res)=>{
    try {
        await req.user.remove()
        cancelMail(req.user.email,req.user.name)
        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router