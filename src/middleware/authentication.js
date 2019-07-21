const jwt = require('jsonwebtoken')
const User = require('../model/user')
const hashString = 'mynodeleanrning'
const auth = async (req,res,next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        console.log(token)
    const decoded_token = jwt.verify(token,hashString)
    console.log(decoded_token)
    const user = await User.findOne({_id:decoded_token._id,'Tokens.token':token})
    if(!user){
        throw new Error("Please authenticate")
    }
    req.token=token
    req.user = user
    next()
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports=auth