const mongoose = require('mongoose')

//defining task model
const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },

    isCompleted:{
        type:Boolean,
        required:true,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
})

//For any pre conditions before saving the docs
taskSchema.pre('save',function(next){
    const task = this
    next()
})
const task = mongoose.model('task',taskSchema)
module.exports = task