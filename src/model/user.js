const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//defining collections 
const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
      },
      email:{
          type:String,
          required:true,
          unique:true,
          trim:true,
          toLowerCase:true,
          validate(value){
              if(!validator.isEmail(value))
                  throw new Error('Enter valid Email')   
          }
      },
      password:{
          type:String,
          required:true,
          minlength:7,
          trim:true,
          validate(value){
              if(value.toLowerCase().includes('password'))
                  throw new Error('password should not contain "password"')
          }   
      },
      age:{
          type:Number,
          default:0,
          validate(value){
              if(value<0)
              {
                    throw new Error("Age must be a positive number")
              }
          }
      },
      Tokens:[{
          token:{
              type:String,
              required:true
          }
      }]
    })

//model static functions
userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error("Email not found")
    }
    const isCorrectPassword =await bcrypt.compare(password,user.password)
    if(isCorrectPassword){
        return user
    }
    throw new Error("Password not found")
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id},'mynodeleanrning')
    user.Tokens = user.Tokens.concat({token})
    await user.save()
    return token
}

//Hashing the password
userSchema.pre('save',async function(next){
    const user= this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User',userSchema)

  module.exports=User