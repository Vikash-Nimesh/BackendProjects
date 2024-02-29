const mongoose = require('mongoose');
const {Schema} = mongoose;


const userSchema = new Schema({

    user_name:{
        type:String,
        require:true
    },
    user_email:{
        type:String,
        require:true,
        unique:true
    },
    user_password:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }


})

module.exports = mongoose.model('user',userSchema)
