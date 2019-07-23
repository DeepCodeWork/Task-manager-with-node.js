const jwt = require('jsonwebtoken')
const User = require('../model/user')
const auth = async (req,res,next)=>{
    try {
        console.log(req.header('Authorization'))
        const token = await req.header('Authorization').replace('Bearer ','')
        const decoded_token = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findOne({_id:decoded_token._id,'Tokens.token':token})
    if(!user){
        throw new Error()
    }
        req.token=token
        req.user = user
        next()
    } catch (e) {
        res.status(400).send("Please authenticate")
    }
}

module.exports=auth